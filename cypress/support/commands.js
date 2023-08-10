// We cannot use social login with sidebase in tests because it
// will trigger a captcha in CI. Instead, we login the user through google api
// and cheat the sidebase by modifying its auth object on the client end.
// However, the update does not reflect on frontend because nuxt computes
// auth state and pages on the server. We, therefore, use a custom test-env-only
// command to login user with credentials so that we have the logged-in 
// page on user end, then we modify the auth object on the client side to
// the actual user who logged in through google.
Cypress.Commands.add('login', () => {
  cy.visit('http://localhost:3000')
  cy.get('nav a[href="/search"]').should('be.visible')

  cy.request({
    method: 'POST',
    url: 'https://www.googleapis.com/oauth2/v4/token',
    body: {
      grant_type: 'refresh_token',
      client_id: Cypress.env('googleClientId'),
      client_secret: Cypress.env('googleClientSecret'),
      refresh_token: Cypress.env('googleRefreshToken'),
    },
  }).then(({ body }) => {
    const { access_token } = body
    localStorage.setItem('token', access_token)

    cy.window().then((win) => {
      win.userStore.user_token = access_token
    })

    const payload = {
      strategy: 'google',
      token: `Bearer ${access_token}`,
    }

    cy.request('/api/auth/csrf').then((res) => {
      cy.request({
        method: 'POST',
        url: '/api/auth/callback/credentials',
        body: {
          username: 'jsmith',
          password: 'hunter2',
          csrfToken: res.body.csrfToken,
        },
        followRedirect: false,
      }).then((res) => {
        expect(res.status).to.eq(302)
        cy.visit('/')
        cy.get('nav a[href="/search"]').should('be.visible')
      })
    })

    cy.intercept('/kg/**/*', (req) => {
      req.headers['Authorization'] = `Bearer ${access_token}`
    })

    cy.window().then((win) => {
      win.useNuxtApp().$loginEndpoint.create(payload).then((user) => {
        win.userStore.user = user.person
        win.userStore.userid = user.id
        win.userStore.user_can_admin = user.can_admin
        win.userStore.user_is_admin = user.is_admin
        win.userStore.user_orgs = user.affiliations
      })
    })
  })
})