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

        it('should display artifact files', () => {
            cy.fixture('artifact.json').then((artifact) => {
                artifact.artifact.files.forEach((file) => {
                    cy.get(`a[href="${file.url}"]`)
                        .should('be.visible')
                        .and('contain', file.name)
                        .and('have.attr', 'target', '_blank')
                })
            })
        })

        it('should not display edit buttons', () => {
            cy.get('button').should('not.contain', 'Edit')
                .and('not.contain', 'Edit New Version')
                .and('not.contain', 'Reimport New Version')
        })

    })

    context('should be able to interact with artifact', () => {

        it('should bring user to login page when click on love button', () => {
            cy.get('#btn-favorite-artifact').should('be.visible').click()
            cy.url().should('include', '/login')
        })

        it('should bring user to reivew page when click on review button', () => {
            cy.get('#btn-comment-artifact').should('be.visible').click()
            cy.url().should('include', '/artifact/review')
        })

        it('should show history record when click on show record history button', () => {
            cy.get('#container-artifact-history').should('not.exist')

            cy.get('#btn-show-history').should('contain', 'Show Record History').and('be.visible').click()
            cy.get('#container-artifact-history').should('be.visible')
            
            cy.get('#btn-show-history').should('contain', 'Hide Record History').and('be.visible').click()
            cy.get('#container-artifact-history').should('not.exist')
        })

        it('should alert user when click on claim this artifact button', () => {
            cy.get('#btn-claim-artifact').should('be.visible').click()
            cy.get('.ownership-info').should('contain', 'Kindly login to claim role')
        })

        it('should redirect user to search page when click on author chips', () => {
            cy.fixture('artifact.json').then((artifact) => {
                artifact.artifact.affiliations.forEach((affiliation) => {
                    cy.get(`[href="/search?author_keywords=${affiliation.affiliation.person.name}"]`)
                        .should('be.visible')
                        .and('not.have.attr', 'target', '_blank')
                })
            })
        })

        it('should redirect user to search page when click on keyword chips', () => {
            cy.fixture('artifact.json').then((artifact) => {
                artifact.artifact.tags.forEach((tag) => {
                    cy.get(`[href="/search?keywords=${tag.tag}"]`)
                        .should('be.visible')
                        .and('not.have.attr', 'target', '_blank')
                })
            })
        })
        
    })

    context('should display artifact relationship correctly', () => {
        beforeEach(() => {
            cy.get('.v-tab').last().click()
        })

        it('should display artifact relationship', () => {
            cy.fixture('artifact.json').then((record) => {
                record.artifact.artifact_group.relationships.forEach((relationship) => {
                    cy.get('.v-card').contains(relationship.relation, { matchCase: false })
                    cy.get('.v-card')
                        .should('contain', relationship.related_artifact_group.publication.artifact.title)
                        .and('contain', relationship.related_artifact_group.publication.artifact.description)
                    cy.get(`a[href="/artifact/${relationship.related_artifact_group_id}"]`).should('be.visible')
                })
            })
        })

        it('should display reverse artifact relationships', () => {
            cy.fixture('artifact.json').then((record) => {
                record.artifact.artifact_group.reverse_relationships.forEach((relationship) => {
                    cy.get('.v-card').contains(relationship.relation, { matchCase: false })
                    cy.get('.v-card')
                        .should('contain', relationship.related_artifact_group.publication.artifact.title)
                        .and('contain', relationship.related_artifact_group.publication.artifact.description)
                        cy.get(`a[href="/artifact/${relationship.related_artifact_group_id}"]`).should('be.visible')
                })
            })
        })
    })

    context('should be able to filter artifact relationship', () => {
        beforeEach(() => {
            cy.get('.v-tab').last().click()
        })

        it('should display backward/forward relation correctly', () => {
            cy.fixture('artifact.json').then((record) => {
                cy.get('.item-artifact-relation').should('have.length', 
                    record.artifact.artifact_group.relationships.length
                  + record.artifact.artifact_group.reverse_relationships.length
                )
            })
        })

        it('should display forward relation correctly', () => {
            cy.get('.v-field__input').first().click()
			cy.get('.v-overlay:last-of-type .v-list-item').eq(1).click()
			
            cy.fixture('artifact.json').then((record) => {
                cy.get('.item-artifact-relation').should('have.length', record.artifact.artifact_group.relationships.length)
            })
        })

        it('should display backward relation correctly', () => {
            cy.get('.v-field__input').first().click()
			cy.get('.v-overlay:last-of-type .v-list-item').eq(2).click()
			
            cy.fixture('artifact.json').then((record) => {
                cy.get('.item-artifact-relation').should('have.length', record.artifact.artifact_group.reverse_relationships.length)
            })
        })

        it('should dispaly nothing when no artifact with matching criteria', () => {
            cy.get('.v-field__input').last().click({ force: true })
            cy.get('.v-overlay:last-of-type .v-list-item').eq(0).click()

            cy.get('.item-nothing-message').should('be.visible')
        })

        it('should display results correctly when filter applies', () => {
            cy.get('.v-field__input').last().click({ force: true })
            cy.get('.v-overlay:last-of-type .v-list-item').first().click()

            cy.fixture('artifact.json').then((record) => {
                const filters = ['Cites','Supplements','Extends','Uses','Describes','Requires','Processes','Produces'].map(e => e.toLowerCase())
                filters.forEach((filter, i) => {
                    const relations = record.artifact.artifact_group.relationships.filter((relationship) => relationship.relation === filter)
                    const reverseRelationships = record.artifact.artifact_group.reverse_relationships.filter((relationship) => relationship.relation === filter)
                    cy.get('.v-overlay:last-of-type .v-list-item').eq(i + 1).click()
                    cy.get('.item-artifact-relation').should('have.length', relations.length + reverseRelationships.length)
                    cy.get('.v-overlay:last-of-type .v-list-item').eq(i + 1).click()
                })
            })
        })
    })
})