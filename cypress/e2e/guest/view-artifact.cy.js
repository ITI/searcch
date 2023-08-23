import DOMPurify from "dompurify"

describe('View Artifact', () => {
    beforeEach(() => {
        cy.intercept('/kg/artifact/*', {
            fixture: 'artifact.json',
        })
        cy.visit(`${Cypress.env('baseUrl')}/artifact/1`)
    })

    context('should display artifact correctly', () => {
        it('should display artifact title and description', () => {
            cy.fixture('artifact.json').then((artifact) => {
                cy.get('.v-sheet').should('be.visible')
                    .and('contain', artifact.artifact.title)
                    .and('contain', DOMPurify.sanitize(artifact.artifact.description))
            })
        })

        it('should display artifact type', () => {
            cy.fixture('artifact.json').then((artifact) => {
                artifact.artifact.tags.forEach(({ tag }) => {
                    cy.get('.v-chip').should('contain', tag)
                })
            })
        })

        it('should display artifact affiliations', () => {
            cy.fixture('artifact.json').then((artifact) => {
                artifact.artifact.affiliations.forEach((affiliation) => {
                    cy.get('.v-chip').should('contain', affiliation.affiliation.person.name)
                })
            })
        })

        it('should display artifact badges', () => {
            cy.fixture('artifact.json').then((artifact) => {
                artifact.artifact.badges.forEach((badge) => {
                    cy.get('a').should('contain', badge.badge.title)
                })
            })
        })

        it('should display artifact venues', () => {
            cy.fixture('artifact.json').then((artifact) => {
                artifact.artifact.venues.forEach((venue) => {
                    cy.get('.v-chip').should('contain', venue.venue.abbrev || venue.venue.title)
                })
            })
        })

        it('should display artifact type', () => {
            cy.fixture('artifact.json').then((artifact) => {
                cy.get('.v-chip').contains(artifact.artifact.type, { matchCase: false })
            })
        })

        it('should display artifact license', () => {
            cy.fixture('artifact.json').then((artifact) => {
                cy.get('.v-chip').contains(`${artifact.artifact.license.short_name} (${artifact.artifact.license.long_name})`)
            })
        })

        it('should display artifact importer', () => {
            cy.fixture('artifact.json').then((artifact) => {
                cy.get('.v-chip').contains(`${artifact.artifact.importer.name} v${artifact.artifact.importer.version}`)
            })
        })

        it('should display artifact programming languages', () => {
            cy.fixture('artifact.json').then((artifact) => {
                artifact.artifact.meta.filter((meta) => meta.name === 'languages').forEach((language) => {
                    cy.get('.v-chip').should('contain', language.value)
                })
            })
        })
        
    })
})