describe('Home page', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
  })

  context('header', () => {
    it('display username', () => {
      cy.window().then((win) => {
        cy.get('header span').contains(win.useNuxtApp().$auth.user.name)
      })
    })

    it('can switch to/from admin mode', () => {
      cy.get('header button').should('have.length', 3)
      cy.get('.mdi-alpha-a-circle').should('be.visible').and('have.attr', 'style', 'color: green;')

      cy.get('header button').eq(1).click()
      cy.get('.mdi-alpha-a-circle').should('be.visible').and('have.attr', 'style', 'color: red;')

      cy.get('nav a').should('have.length.above', 8)

      cy.get('header button').eq(1).click()
      cy.get('.mdi-alpha-a-circle').should('be.visible').and('have.attr', 'style', 'color: green;')

    })

    it('can logout', () => {
      cy.get('header button').last().contains('Logout').click()
      cy.get('header button').last().contains('Login')
    })
  })

  context('sidebar', () => {
    it('should have a sidebar with appropriate links', () => {
      cy.on('uncaught:exception', (err, runnable) => {
        if (err.message.includes(`Cannot read properties of undefined (reading 'owned_artifacts')`))
          return false
      })

      cy.get('header button').should('have.length', 3)
      cy.get('.mdi-alpha-a-circle').should('be.visible').and('have.attr', 'style', 'color: green;')
      cy.get('header button').eq(1).click()
      
      cy.get('nav').should('be.visible')

      const navAssertions = [
        { href: '/search', target: undefined, title: 'Search Artifacts' },
        { href: '/favorites', target: undefined, title: 'Favorite Artifacts' },
        { href: '/myartifacts', target: undefined, title: 'My Artifacts' },
        { href: '/import', target: undefined, title: 'Submit Artifact' },
        { href: '/profile', target: undefined, title: 'Manage Account' },

        { href: '/admin/artifacts', target: undefined, title: 'Artifacts' },
        { href: '/admin/imports', target: undefined, title: 'Artifact Imports' },
        { href: '/admin/users', target: undefined, title: 'Users' },
        { href: '/admin/sessions', target: undefined, title: 'Login Sessions' },
        { href: '/admin/importers', target: undefined, title: 'Importer Status' },
        { href: '/admin/claims', target: undefined, title: 'Claims' },

        { href: '/', target: undefined, title: 'About' },
        { href: 'https://searcch.cyberexperimentation.org/best-practices', target: '_blank', title: 'Best Practices' },
        { href: '/faqs', target: undefined, title: 'FAQ' }
      ]

      cy.get('nav a').as('navItems').should('have.length', navAssertions.length)
      navAssertions.forEach(({ href, target, title }, index) => {
        if (target === '_blank' && href.startsWith('http')) {
          cy.get('@navItems').eq(index)
            .should('have.attr', 'target', target)
            .and('have.attr', 'href', href)
            .contains(title)
        } else {
          cy.get('@navItems').eq(index).contains(title).click()
          cy.wait(300)
          cy.url().should('eq', `${Cypress.env('baseUrl')}${href}`)
        }
        if (title === 'About') {
          cy.get('@navItems').eq(index).should('have.class', 'v-list-item--active')
        }
      })
    })
  })
})