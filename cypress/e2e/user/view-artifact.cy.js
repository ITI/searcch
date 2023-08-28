import DOMPurify from "dompurify"

describe('View Artifact', () => {
    beforeEach(() => {
        cy.intercept('/kg/artifact/*', {
            fixture: 'artifact.json',
        })
        cy.login()
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
                artifact.artifact.files.forEach((file, i) => {
                    cy.get(`#file${i}`).should('contain', file.name)
                        .and('contain', file.size ? bytesToSize(file.size) : 'unknown')
                        .and('contain', file.filetype ?? 'unkown')

                    cy.get(`#file${i}`).click()
                    file.members.forEach((member) => {
                        cy.get(`#file${i}`).find('.v-list-group__items')
                            .should('contain', member.name)
                            .and('contain', member.size ? bytesToSize(member.size) : 'unknown')
                            .and('contain', member.filetype ?? 'unkown')
                    })
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

        it('should be able to like/dislike an artifact', () => {
            cy.intercept('/kg/favorite/*', (req) => {
                expect(req.body).to.be.empty
                expect(req.method).to.oneOf(['POST', 'DELETE'])
            }).as('favorite')
            cy.get('#btn-favorite-artifact').should('be.visible').click()
            cy.wait('@favorite')
        })

        it('should bring user to reivew page when click on review button', () => {
            cy.get('#btn-comment-artifact').should('be.visible').click()
            cy.url().should('include', '/artifact/review')
        })

        it('should display modal when click `claim this artifact` button', () => {
            cy.intercept('GET', `/kg/artifact/request/owner/*`, {
                fixture: 'ownershipRequestEmpty.json',
            })
            cy.get('#btn-claim-artifact').should('be.visible').click()
            cy.get('div.modal').should('be.visible')
        })

        it('should show history record when click on show record history button', () => {
            cy.get('#container-artifact-history').should('not.exist')

            cy.get('#btn-show-history').should('contain', 'Show Record History').and('be.visible').click()
            cy.get('#container-artifact-history').should('be.visible')
            
            cy.get('#btn-show-history').should('contain', 'Hide Record History').and('be.visible').click()
            cy.get('#container-artifact-history').should('not.exist')
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

    context('should be able to claim artifact through justification', () => {
        beforeEach(() => {
            cy.intercept('GET', `/kg/artifact/request/owner/*`, {
                fixture: 'ownershipRequestEmpty.json',
            }).as('getOwnershipInfo')
            cy.get('#btn-claim-artifact').should('be.visible').click()
            cy.get('div.modal').should('be.visible')
        })

        it('should display error message when no justification is entered', () => {
            cy.get('#btn-modal-claim-ownership').click()
            cy.get('div.modal').should('contain', 'Kindly provide a valid justification')
        })

        it('should be able to submit request through justification', () => {
            cy.fixture('ownershipRequest.json').then(({ artifact_owner_request: fixture }) => {
                cy.intercept('POST', '/kg/artifact/request/owner/*', (req) => {
                    expect(req.body).to.be.deep.contain({ message: fixture.message })
                    expect(req.method).to.equal('POST')
                    req.reply({
                        fixture: 'ownershipRequest.json',
                    })
                }).as('claimOwnership')
                cy.get('#justificationTextarea').type(fixture.message)

                cy.get('#btn-modal-claim-ownership').click()

                cy.wait('@claimOwnership')
                cy.get('div.modal').should('not.visible')

                cy.get('.ownership-info').should('contain', 'Claim request successfully sent')
                cy.get('.ownership-info', { timeout: 5000 }).should('not.exist')

                cy.intercept('/kg/artifact/request/owner/*', {
                    fixture: 'ownershipRequest.json',
                }).as('claimOwnership')
                cy.get('#btn-claim-artifact').should('be.visible').click({ force: true })
                cy.get('div.modal').should('be.visible')

                cy.get('#justificationTextarea').should('contain.value', fixture.message)
                cy.get('#btn-modal-claim-ownership').should('contain', 'Ownership Claim Requested')
                    .and('be.disabled')
            })
        })

        it('should display error message when request ownership fails', () => {
            cy.fixture('ownershipRequest.json').then(({ artifact_owner_request: fixture }) => {
                cy.intercept('POST', `/kg/artifact/request/owner/${fixture.artifact_group_id}`, (req) => {
                    expect(req.body).to.be.deep.contain({ message: fixture.message })
                }).as('claimOwnership')

                cy.get('#justificationTextarea').type(fixture.message)
                cy.get('#btn-modal-claim-ownership').click()
                cy.wait('@claimOwnership')

                cy.get('div.modal').should('not.visible')

                cy.get('.ownership-info').should('contain', 'An error occured in sending the claim request')
                cy.wait(5000).then(() => {
                    cy.get('.ownership-info').should('not.exist')
                })

                cy.get('#btn-claim-artifact').should('be.visible').click({ force: true })
                cy.wait('@getOwnershipInfo')
                cy.get('div.modal').should('be.visible')

                cy.get('#justificationTextarea').should('contain.value', fixture.message)
                cy.get('#btn-modal-claim-ownership').should('contain', 'Claim Ownership')
                    .and('not.be.disabled')
            })
        })
    })

    context('should be able to claim artifact through magic link', () => {
        beforeEach(() => {
            cy.intercept('GET', `/kg/artifact/request/owner/*`, {
                fixture: 'ownershipRequestEmpty.json',
            }).as('getOwnershipInfo')
            cy.get('#btn-claim-artifact').should('be.visible').click()
            cy.get('div.modal').should('be.visible')
            cy.get('#btn-modal-magic-key').should('be.visible').click()
        })

        it('should display a magic key modal', () => {
            cy.get('.v-overlay--active .v-card').should('be.visible')
                .and('contain', 'Please enter magic key')
        })

        // since frontend test is stateless, we cannot test if the requrest is approved or not
        // upon approve, the user will be redirected to the artifact page with ownership info
        // so the only way to test this is to return a page with edit function, which essentaially
        // is covered in edit artifact test
        // it('should display approval message upon validating the magic key', () => {
            // cy.intercept('POST', `/kg/artifact/request/owner/*`, {
            //     fixture: 'ownershipApproveResponse.json',
            // }).as('claimOwnershipByMagicKey')
            // cy.get('.v-field__input').type('magic key')
            // cy.get('#btn-submit-magic-key').click()
            // cy.wait('@claimOwnershipByMagicKey')
        // })

        it('should display error message when the magic key is invalid', () => {
            cy.intercept('POST', `/kg/artifact/request/owner/*`, {
                fixture: 'ownershipApproveResponse.json',
            }).as('claimOwnershipByMagicKey')
            cy.get('#btn-submit-magic-key').click()
            cy.get('.v-overlay--active .v-card').should('contain', 'Kindly provide a valid magic key')
        })

        it('should display error message when the magic key request fails', () => {
            cy.intercept('POST', `/kg/artifact/request/owner/*`, {
                statusCode: 403,
                body: {
                    message: 'An error occured in sending the claim request'
                }
            }).as('claimOwnershipByMagicKey')
            cy.get('.v-field__input').type('magic key')
            cy.get('#btn-submit-magic-key').click({ force: true })
            cy.wait('@claimOwnershipByMagicKey')

            cy.get('.ownership-info').should('contain', 'An error occured in sending the claim request')
            cy.wait(5000).then(() => {
                cy.get('.ownership-info').should('not.exist')
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