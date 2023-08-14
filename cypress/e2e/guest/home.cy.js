describe('Home Page for Guests', () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env('baseUrl')}`)
    // sometimes we have slow network, run this to wait for the full page to load
    cy.get('nav a[href="/search"]').should('be.visible')
  })

  it('should display the correct title', () => {
    cy.title().should('eq', 'frontend - SEARCCH Hub')
  })

  context('header', () => {
    it('should have a title', () => {
      cy.get('header').should('be.visible').and('contain', 'SEARCCH Hub')
    })

    it('can control sidebar expansion', () => {
      cy.get('header button').first().as('sidebarCtl').click()
      cy.get('nav a .v-list-item-title').should('not.be.visible')

      cy.get('@sidebarCtl').click()
      cy.get('nav a .v-list-item-title').should('be.visible')
    })

    it('can show login options', () => {
      cy.get('header button').last().contains('Login').click()
      cy.get('.v-menu').should('be.visible')
      cy.get('.v-menu .v-list-item button').as('loginOptions')
        .should('have.length', 3).and('be.visible')

      const loginOptions = ['github', 'google', 'cilogon']
      cy.get('@loginOptions').each(($el) => {
        cy.wrap($el.text().trim().toLowerCase()).should('be.oneOf', loginOptions)
      });
    })
  })

  context('sidebar', () => {
    it('should have a sidebar with appropriate links', () => {
      cy.get('nav').should('be.visible')

      const navAssertions = [
        { href: '/search', target: undefined, title: 'Search Artifacts' },
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

