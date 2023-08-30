Cypress.Commands.add('login', (asAdmin) => {
  cy.visit(`${Cypress.env('baseUrl')}`)
  cy.get('nav a[href="/search"]').should('be.visible')

  cy.intercept('/kg/login', {
    fixture: asAdmin ? 'loginAsAdmin.json' : 'login.json',
  })

  cy.intercept('/kg/favorites/*', {
    fixture: 'favorites.json',
  })

  cy.intercept('/kg/artifact/imports?*', {
    fixture: 'importer/empty.json'
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

Cypress.Commands.add('loginAsAdmin', () => {
  cy.login(true)
})

Cypress.Commands.add('loadArtifactAsOwner', (fixture) => {
  const userId = Cypress.env('testUserId')
  const userName = Cypress.env('testUserName')
  function injectOwnerInfo(obj) {
    if (Object.is(obj, null)
      || Object.is(obj, undefined)
      || typeof obj === 'string') return

    Object.keys(obj).forEach((key) => {
      if (key === 'owner' && Object.keys(obj[key]).includes('person')) {
        obj[key]['person']['name'] = userName
        obj[key]['id'] = userId
      } else if (key === 'owner_id') {
        obj[key] = userId
      } else {
        injectOwnerInfo(obj[key])
      }
    })
  }
  cy.fixture(fixture).then(function (fixture) {
    injectOwnerInfo(fixture)
    this.fixture = fixture
  }).as('fixture')
})