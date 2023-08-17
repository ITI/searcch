Cypress.Commands.add('login', (asAdmin) => {
  cy.visit(`${Cypress.env('baseUrl')}`)
  cy.get('nav a[href="/search"]').should('be.visible')

  cy.intercept('/kg/login', {
    fixture: asAdmin ? 'loginAsAdmin.json' : 'login.json',
  })

  cy.intercept('/kg/favorites/*', {
    fixture: 'favorites.json',
  })

  cy.request('/api/auth/csrf').then((res) => {
    cy.request({
      method: 'POST',
      url: '/api/auth/callback/credentials',
      body: {
        username: 'testuser',
        password: 'testuser',
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