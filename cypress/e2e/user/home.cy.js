describe('Home page', () => {
  beforeEach(() => {
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
      cy.on('uncaught:exception', (err, runnable) => {
        return false
      })
      
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

  context('footer', () => {
    it('should have a footer with sponsor info', () => {
      cy.get('footer').should('be.visible')
      cy.get('footer span').should('contain', '© 2023 - SEARCCH is supported by the National Science Foundation under Grant Numbers 1925773, 1925616, 1925588, 1925564')
    });

    it('should have a footer with feedback link', () => {
      cy.get('footer a')
        .should('have.attr', 'href', 'https://forms.gle/nsP4kJVsjAmKKLU86')
        .and('have.attr', 'target', '_blank')
        .and('contain', 'Send Us Feedback')
    })
  })

  context('main content', () => {
    it('should have a main content area', () => {
      cy.get('main').should('be.visible')
    })
    it('should have a continue button that navigates user to search page', () => {
      cy.get('main a.v-btn')
        .should('contain', 'Continue')
        .and('be.visible')
        .click()
      cy.url().should('eq', `${Cypress.env('baseUrl')}/search`)
    })
  })
})