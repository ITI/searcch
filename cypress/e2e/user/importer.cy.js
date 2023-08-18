describe('Import Artifact', () => {
    beforeEach(() => {
        cy.login()

        cy.visit(`${Cypress.env('baseUrl')}/import`)
        cy.get('nav a[href="/search"]').should('be.visible')
    })

    context('should display error message when input is ____', () => {
        beforeEach(() => {
            cy.get('#input-artifact-import').focus()
        })

        it('empty', () => {
            cy.get('#input-artifact-import').blur()

            cy.get('.v-messages__message')
                .should('be.visible')
                .and('contain', 'URL is required')
        })

        it('an invalid URL', () => {
            cy.get('#input-artifact-import').type('invalid url').blur()

            cy.get('.v-messages__message')
                .should('be.visible')
                .and('contain', 'invalid URL')
        })
    })

    context('initial page loading', () => {
        it('should display no imports message when the list is empty', () => {
            cy.intercept('/kg/artifact/imports?*', {
                fixture: 'importer/empty.json'
            }).as('import')

            cy.wait('@import')

            cy.get('.v-col').last().should('contain', 'No imports found')
        })

        it('should display a list of artifacts', () => {
            cy.intercept('/kg/artifact/imports?*', {
                fixture: 'importer/imports.json'
            }).as('import')

            cy.wait('@import')
            cy.get('.v-card').should('have.length.at.least', 1)
        })
    })

    it('should display correct status/phase when importing artifacts', () => {
        const fixture = 'importer/imports.json'
        cy.intercept('/kg/artifact/imports?*', { fixture }).as('import')

        cy.wait('@import')

        cy.fixture(fixture).then((data) => {
            const artifactImports = data.artifact_imports
            cy.get('.v-card').should('have.length', artifactImports.length)
            cy.get('.v-card').each(($el, index) => {
                const artifactImport = artifactImports[index]
                cy.wrap($el).should('contain', artifactImport.url)
                cy.wrap($el).should('contain', `${Math.trunc(artifactImport.progress)}%`)
                cy.wrap($el).should('contain', artifactImport.status)
                cy.wrap($el).should('contain', artifactImport.phase)
                if (artifactImport.status ==='failled' && !Object.is(artifactImport.log, null)) {
                    cy.wrap($el).should('contain', artifactImport.log)
                }
            })
        })
    })
})