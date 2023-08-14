describe('Home page for logged in users', () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env('baseUrl')}`)
    cy.get('nav a[href="/search"]').should('be.visible')
    cy.login()
  })

  context('header', () => {
    it('display username', () => {
      cy.window().then((win) => {
        cy.get('header span').contains(win.useNuxtApp().$auth.user.name)
      })
    })

    it('can logout', () => {
      cy.get('header button').last().contains('Logout').click()
      cy.get('header button').last().contains('Login')
    })
  })

  context('sidebar', () => {
    it('should have a sidebar with appropriate links', () => {
      cy.get('nav').should('be.visible')

      const navAssertions = [
        { href: '/search', target: undefined, title: 'Search Artifacts' },
        { href: '/favorites', target: undefined, title: 'Favorite Artifacts' },
        { href: '/myartifacts', target: undefined, title: 'My Artifacts' },
        { href: '/import', target: undefined, title: 'Submit Artifact' },
        { href: '/profile', target: undefined, title: 'Manage Account' },
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
          cy.url().should('eq', `${Cypress.env('baseUrl')}${href}`)
        }
        if (title === 'About') {
          cy.get('@navItems').eq(index).should('have.class', 'v-list-item--active')
        }
      })
    })
  })
})