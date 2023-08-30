describe('Edit Artifact Relation', () => {
    const artifactFixture = 'artifact.json'
    const licensesFixture = 'licenses.json'
    const venuesFixture = 'venues.json'
    const organizationsFixture = 'organizations.json'
    const badgesFixture = 'badges.json'
    const artifactRecommendationsFixture = 'artifacts.json'
    beforeEach(() => {
        cy.loadArtifactAsOwner(artifactFixture)
        cy.intercept('GET', '/kg/venues?*', { fixture: venuesFixture })
        cy.intercept('GET', '/kg/organizations?*', { fixture: organizationsFixture })
        cy.intercept('GET', '/kg/badges?*', { fixture: badgesFixture })
        cy.intercept('GET', '/kg/licenses?*', { fixture: licensesFixture })
        cy.get('@fixture').then((fixture) => {
            cy.intercept('GET', `/kg/artifact/${fixture.artifact.artifact_group_id}/${fixture.artifact.id}`, fixture)
            cy.intercept('PUT', `/kg/artifact/${fixture.artifact.artifact_group_id}/${fixture.artifact.id}`, fixture).as('updateArtifact')
            cy.intercept('GET', `/kg/artifact/recommendation/${fixture.artifact.artifact_group_id}/${fixture.artifact.id}`, { fixture: artifactRecommendationsFixture })
            cy.login()
            cy.visit(`${Cypress.env('baseUrl')}/artifact/${fixture.artifact.artifact_group_id}/${fixture.artifact.id}?edit_relation=true`)
        })
    })

    context('should display edit page correctly', function () {
        it('should display the edit artifact relation page', function () {
            cy.get('.v-sheet').should('be.visible').and('contain', 'Edit Relationship')
        })

        it('should display artifact relationship', function () {
            this.fixture.artifact.artifact_group.relationships.forEach((relationship) => {
                cy.get(`#container-relation-${relationship.id}`).contains(relationship.relation, { matchCase: false })
                cy.get(`#container-relation-${relationship.id}`)
                    .should('contain', relationship.related_artifact_group.publication.artifact.title)
                    .and('contain', relationship.related_artifact_group.publication.artifact.description)
                    .find(`#btn-delete-relation-${relationship.id}`).should('be.visible').and('not.be.disabled')
                cy.get(`#container-relation-${relationship.id} a[href="/artifact/${relationship.related_artifact_group_id}"]`).should('be.visible')
            })
        })

        it('should display reverse artifact relationships', function () {
            this.fixture.artifact.artifact_group.reverse_relationships.forEach((relationship) => {
                cy.get(`#container-relation-${relationship.id}`).contains(relationship.relation, { matchCase: false })
                cy.get(`#container-relation-${relationship.id}`)
                    .should('contain', relationship.related_artifact_group.publication.artifact.title)
                    .and('contain', relationship.related_artifact_group.publication.artifact.description)
                    .find(`#btn-delete-relation-${relationship.id}`).should('be.visible').and('not.be.disabled')
                cy.get(`#container-relation-${relationship.id} a[href="/artifact/${relationship.related_artifact_group_id}"]`).should('be.visible')
            })
        })
    })

    context('should edit artifact relationship correctly', function () {
        context('should add artifact relationship', function () {
            beforeEach(() => {
                cy.intercept('GET', '/kg/user/artifacts', { fixture: this.fixture })
                cy.get('#btn-open-relation-modal').click()
            })

            it('should display add related modal', function () {    
                cy.get('.v-dialog--fullscreen').should('be.visible')
                cy.fixture(artifactRecommendationsFixture).then((fixture) => {
                    cy.get('#container-artifact-list .v-card').should('have.length', fixture.artifacts.artifacts.length)
                })
            })

            it('should have a functional close button', function () {
                cy.get('.v-dialog--fullscreen').find('#btn-close-relation-modal')
                    .should('not.be.disabled').click()
                cy.get('.v-dialog--fullscreen').should('not.exist')
            })

            it('should add artifact relationship correctly', function () {
                cy.fixture(artifactRecommendationsFixture).then((recommendations) => {
                    cy.intercept('POST', '/kg/artifact/relationships', (req) => {
                        expect(req.body).to.have.property('artifact_group_id', this.fixture.artifact.artifact_group_id)
                        expect(req.body).to.have.property('related_artifact_group_id', recommendations.artifacts.artifacts[0].artifact_group_id)
                        expect(req.body).to.have.property('relation', 'cites')
                        req.reply({
                            "artifact_relationship": {
                                "id": 214, 
                                "artifact_id": this.fixture.artifact.id, 
                                "artifact_group_id": this.fixture.artifact.artifact_group_id, 
                                "relation": "cites", 
                                "related_artifact_id": null, 
                                "related_artifact_group_id": recommendations.artifacts.artifacts[0].artifact_group_id,
                            }
                        })                              
                    }).as('addArtifactRelationship')
                })
                cy.get('#container-artifact-list .v-card').first().find('.v-field__input').click()
                cy.get('.v-overlay:last-of-type .v-list-item').eq(0).click()
                cy.get('#container-artifact-list .v-card').first().find('#btn-artifact-add-related').click()
                cy.wait('@addArtifactRelationship')
                cy.get('.v-dialog--fullscreen').should('not.exist')
            })
        })

        it('should remove artifact relationship', function () {
            const relation = this.fixture.artifact.artifact_group.relationships[0]
            cy.intercept('DELETE', `/kg/artifact/relationship/${relation.id}`, {
                "message": "deleted artifact_relationship"
            }).as('deleteArtifactRelationship')
            cy.get(`#container-relation-${relation.id}`).find(`#btn-delete-relation-${relation.id}`).click()
            cy.get(`#container-relation-${relation.id}`).should('not.exist')
            cy.wait('@deleteArtifactRelationship')
        })
    })
})