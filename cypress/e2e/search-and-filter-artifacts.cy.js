describe('Search and Filter Artifacts for Guests', () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env('baseUrl')}/search`)
    cy.get('nav a[href="/search"]').should('be.visible')
  })

  it('displays a search bar', () => {
    cy.get('#input-search-artifact').should('exist')
  })

  it('can toggle advanced search', () => {
    cy.get('.mdi-chevron-down').should('be.visible')

    cy.get('.v-expansion-panel-title__overlay').click()
    cy.get('.v-expansion-panel-text__wrapper').should('be.visible')

    cy.get('.v-expansion-panel-title__overlay').click()
    cy.get('.v-expansion-panel-text__wrapper').should('not.exist')
  })

  context('can display search results', () => {
    it('can navigate using pagination', () => {
      cy.get('#input-search-artifact').type('{enter}')
      cy.get('.v-pagination__list button').should('have.length.at.least', 2)
      
      cy.get('.v-card').should('have.length.at.least', 1)
      cy.get('.v-card').first().as('firstCard')

      cy.intercept('GET', '/kg/artifact/search?*').as('getArtifacts')
      cy.get('.v-pagination__list button').last().click()
      cy.wait('@getArtifacts').its('response.statusCode').should('eq', 200)

      cy.get('.v-card').should('have.length.at.least', 1)
      cy.get('.v-card').first().should('not.equal', '@firstCard')
    })

    it(' cannot navigate using pagination when limited results exist', () => {
      cy.get('#input-search-artifact').type('stackdb{enter}')
      cy.get('.v-pagination__list').should('be.visible')
      cy.get('.v-pagination__list button').should('have.length', 3)
      cy.get('.v-card').should('have.length.at.least', 1)
    })

    it('displays no result when the search is inapplicable', () => {
      cy.get('#input-search-artifact').type('deadbeef{enter}')
      cy.get('.v-pagination__list').should('be.visible')
      cy.get('.v-pagination__list button').should('have.length', 2)
      cy.get('.v-card').should('have.length', 0)
    })
  })


  // it('can filter artifacts by author', () => {

  // })

  // it('can filter artifacts by organization', () => {

  // })

  // it('can filter artifacts by artifact type', () => {

  // })

  // it('can filter artifacts by artifact badge', () => {

  // })

  // it('can filter artifacts by artifact venue', () => {

  // })

  // context('can sort artifacts by date', () => {
  //   it('ascending', () => {

  //   })

  //   it('descending', () => {

  //   })
  // })

  // context('can sort artifacts by view', () => {
  //   it('ascending', () => {

  //   })

  //   it('descending', () => {

  //   })
  // })

  // context('can sort artifacts by rating', () => {
  //   it('ascending', () => {

  //   })

  //   it('descending', () => {

  //   })
  // })
})