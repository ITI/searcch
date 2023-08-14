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

		it('cannot navigate using pagination when limited results exist', () => {
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

	context('can do action with a search result', () => {
		beforeEach(() => {
			cy.get('#input-search-artifact').type('stackdb{enter}')
			cy.get('.v-card').should('have.length.at.least', 1)
		})

		it('redirects to login page after attempting to favorite an artifact', () => {
			cy.get('#btn-artifact-favorite').should('be.visible').click()
			cy.url().should('eq', `${Cypress.env('baseUrl')}/login`)
		})

		it('redirects to comment page after attempting to comment on an artifact', () => {
			cy.get('#btn-artifact-comment').should('be.visible').click()
			cy.url().should('contain', `${Cypress.env('baseUrl')}/artifact/review`)
		})

		it('redirects to artifact detail when clicking `Read more`', () => {
			cy.get('#btn-artifact-read-more').should('be.visible').click()
			cy.url().should('contain', `${Cypress.env('baseUrl')}/artifact/`)
		})
	})

	context('can filter artifacts by different criteria', () => {
		beforeEach(() => {
			cy.get('.v-expansion-panel-title__overlay').click()
			cy.get('.v-expansion-panel-text__wrapper').should('be.visible')
			cy.intercept('GET', '/kg/artifact/search?*').as('getArtifacts')
		})

		it('by author', () => {
			cy.get('#input-filter-by-author').type('issac newton')
			cy.get('#btn-advanced-search-submit').click()
			cy.wait('@getArtifacts')
			cy.get('.v-card').should('have.length', 0)

			cy.get('#input-filter-by-author').clear().type('david')
			cy.get('#btn-advanced-search-submit').click()
			cy.wait('@getArtifacts')
			cy.get('.v-card').should('have.length.at.least', 1)
		})

		it('by organization', () => {
			cy.get('#input-filter-by-organization').type('University College London')
			cy.get('#btn-advanced-search-submit').click()
			cy.wait('@getArtifacts')
			cy.get('.v-card').should('have.length.at.least', 1)

			cy.get('#input-filter-by-organization').clear().type('Hogwarts School of Witchcraft and Wizardry')
			cy.get('#btn-advanced-search-submit').click()
			cy.wait('@getArtifacts')
			cy.get('.v-card').should('have.length', 0)
		})

		it('by artifact type', { scrollBehavior: false }, () => {
			cy.get('#input-search-artifact').type('stackdb{enter}')
			cy.wait('@getArtifacts')
			cy.get('.v-pagination__list button').then(($btns) => {
				const length = $btns.length

				cy.get('.v-field__input').eq(3).click()
				cy.get('.v-overlay:last-of-type .v-list-item').eq(0).click()
				cy.get('.v-overlay:last-of-type .v-list-item').eq(1).click()
				cy.get('#btn-advanced-search-submit').click({ force: true })
				cy.wait('@getArtifacts')
				cy.get('.v-pagination__list button').should('not.have.length', length)

				cy.get('.v-field__input').eq(3).click()
				cy.get('.v-overlay:last-of-type .v-list-item').eq(0).click()
				cy.get('.v-overlay:last-of-type .v-list-item').eq(0).click()
				cy.get('.v-overlay:last-of-type .v-list-item').eq(4).click()
				cy.get('#btn-advanced-search-submit').click({ force: true })
				cy.wait('@getArtifacts')
				cy.get('.v-pagination__list button').should('have.length', length)
			})
		})

		it('by artifact badge', { scrollBehavior: false }, () => {
			cy.get('.v-field__input').eq(4).click({ force: true })
			cy.get('.v-overlay:last-of-type .v-list-item').eq(0).click()
			cy.get('.v-overlay:last-of-type .v-list-item').eq(1).click()
			cy.get('#btn-advanced-search-submit').click({ force: true })
			cy.wait('@getArtifacts')
			cy.get('.v-pagination__list button').then(($btns) => {
				const length = $btns.length

				cy.get('.v-field__input').eq(4).click({ force: true })
				cy.get('.v-overlay:last-of-type .v-list-item').eq(2).click()
				cy.get('#btn-advanced-search-submit').click({ force: true })
				cy.wait('@getArtifacts')
				cy.get('.v-pagination__list button').should('not.have.length', length)
			})
		})

		it('by artifact venue', { scrollBehavior: false }, () => {
			cy.get('.v-field__input').eq(5).click({ force: true })
			cy.get('.v-overlay:last-of-type .v-list-item').eq(0).click()
			cy.get('.v-overlay:last-of-type .v-list-item').eq(1).click()
			cy.get('#btn-advanced-search-submit').click({ force: true })
			cy.wait('@getArtifacts')
			cy.get('.v-pagination__list button').then(($btns) => {
				const length = $btns.length

				cy.get('.v-field__input').eq(5).click({ force: true })
				cy.get('.v-overlay:last-of-type .v-list-item').eq(2).click()
				cy.get('#btn-advanced-search-submit').click({ force: true })
				cy.wait('@getArtifacts')
				cy.get('.v-pagination__list button').should('not.have.length', length)
			})
		})
	})

	context('can sort artifact by different criteria', () => {
		beforeEach(() => {
			cy.get('.v-expansion-panel-title__overlay').click()
			cy.get('.v-expansion-panel-text__wrapper').should('be.visible')
			cy.intercept('GET', '/kg/artifact/search?*').as('getArtifacts')
		})

		it('by date', () => {
			cy.get('.v-field__input').eq(6).click({ force: true })
			cy.get('.v-overlay:last-of-type .v-list-item').eq(1).click({ force: true })
			cy.get('.v-col-sm-4 input').first().click({ force: true })
			cy.get('#btn-advanced-search-submit').click({ force: true })
			cy.wait('@getArtifacts')
			cy.get('.v-card').first().then(($firstCard) => {
				cy.get('.v-col-sm-4 input').last().click({ force: true })
				cy.get('#btn-advanced-search-submit').click({ force: true })
				cy.wait('@getArtifacts')

				cy.get('.v-card').first().should('not.equal', $firstCard)
			})
		})

		it('by view', () => {
			cy.get('.v-field__input').eq(6).click({ force: true })
			cy.get('.v-overlay:last-of-type .v-list-item').eq(2).click({ force: true })
			cy.get('.v-col-sm-4 input').first().click({ force: true })
			cy.get('#btn-advanced-search-submit').click({ force: true })
			cy.wait('@getArtifacts')
			cy.get('.v-card').first().then(($firstCard) => {
				cy.get('.v-col-sm-4 input').last().click({ force: true })
				cy.get('#btn-advanced-search-submit').click({ force: true })
				cy.wait('@getArtifacts')

				cy.get('.v-card').first().should('not.equal', $firstCard)
			})
		})

		it('by rating', () => {
			cy.get('.v-field__input').eq(6).click({ force: true })
			cy.get('.v-overlay:last-of-type .v-list-item').eq(3).click({ force: true })
			cy.get('.v-col-sm-4 input').first().click({ force: true })
			cy.get('#btn-advanced-search-submit').click({ force: true })
			cy.wait('@getArtifacts')
			cy.get('.v-card').first().then(($firstCard) => {
				cy.get('.v-col-sm-4 input').last().click({ force: true })
				cy.get('#btn-advanced-search-submit').click({ force: true })
				cy.wait('@getArtifacts')

				cy.get('.v-card').first().should('not.equal', $firstCard)
			})
		})
	})
})