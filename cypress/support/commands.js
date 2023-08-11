Cypress.Commands.add('login', () => {
  cy.visit(`${Cypress.env('baseUrl')}`)
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
      win.useNuxtApp().$userStore.user_token = access_token
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
          strategy: payload.strategy,
          token: payload.token,
          csrfToken: res.body.csrfToken,
        },
        followRedirect: false,
      }).then((res) => {
        cy.visit('/')
        cy.get('nav a[href="/search"]').should('be.visible')

        cy.window().then((win) => {
          expect(win.useNuxtApp().$auth.loggedIn).to.be.true
          expect(win.useNuxtApp().$auth.user.name).to.be.a.string
          expect(win.useNuxtApp().$auth.user.email).to.be.a.string
        })
      })
    })
  })
})