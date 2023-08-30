describe('Import Artifact', () => {
    beforeEach(() => {
        cy.login()

        cy.visit(`${Cypress.env('baseUrl')}/import`)
        cy.get('nav a[href="/search"]').should('be.visible')
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
                fixture: 'importer/all.json'
            }).as('import')

            cy.wait('@import')
            cy.get('.v-card').should('have.length.at.least', 1)
        })
    })

    context('should display error message when input is ____', () => {
        beforeEach(() => {
            cy.get('#input-artifact-import').focus()
        })

        it('empty', () => {
            cy.get('#input-artifact-import').blur()

            cy.get('.v-messages__message')
                .should('be.visible')
                .and('contain', 'URL required')
        })

        it('an invalid URL', () => {
            cy.get('#input-artifact-import').type('invalid url').blur()

            cy.get('.v-messages__message')
                .should('be.visible')
                .and('contain', 'Invalid URL')
        })
    })

    context('interaction with importer options', () => {
        beforeEach(() => {
            cy.get('#input-artifact-import').type('https://example.com').blur()
        })

        it('should set autofollow field to true', () => {
            cy.intercept('/kg/artifact/imports', (req) => {
                expect(req.method).to.equal('POST')
                expect(req.body).deep.contain({ 
                    autofollow: true,
                    url: 'https://example.com'
                })
            }).as('import')
            cy.get('#btn-start-import').click()
            cy.wait('@import')
        })

        it('should set autofollow to false when disable import candidates', () => {
            cy.get('#cb-autofollow').click()
            cy.intercept('/kg/artifact/imports', (req) => {
                expect(req.method).to.equal('POST')
                expect(req.body).deep.contain({
                    autofollow: false,
                    url: 'https://example.com'
                })
            }).as('import')
            cy.get('#btn-start-import').click()
            cy.wait('@import')
        })

        it('should set noextract to true when disable extraction', () => {
            cy.get('#cb-noextract').click()
            cy.intercept('/kg/artifact/imports', (req) => {
                expect(req.method).to.equal('POST')
                expect(req.body).deep.contain({
                    autofollow: true,
                    noextract: true,
                    url: 'https://example.com'
                })
            }).as('import')
            cy.get('#btn-start-import').click()
            cy.wait('@import')
        })

        it('should set nofetch to true when disable fetch', () => {
            cy.get('#cb-nofetch').click()
            cy.intercept('/kg/artifact/imports', (req) => {
                expect(req.method).to.equal('POST')
                expect(req.body).deep.contain({
                    autofollow: true,
                    nofetch: true,
                    url: 'https://example.com'
                })
            }).as('import')
            cy.get('#btn-start-import').click()
            cy.wait('@import')
        })
    })

    context('interaction with all importing artifacts', () => {
        const fixture = 'importer/all.json'
        beforeEach(() => {
            cy.intercept('/kg/artifact/imports?*', { fixture }).as('import')
            cy.wait('@import')
        })

        it('should display correct status/phase when importing artifacts', () => {
            cy.fixture(fixture).then((data) => {
                const artifactImports = data.artifact_imports
                cy.get('.v-card').should('have.length', artifactImports.length)
                cy.get('.v-card').each(($el, index) => {
                    const artifactImport = artifactImports[index]
                    cy.wrap($el).should('contain', artifactImport.url)
                        .and('contain', `${Math.trunc(artifactImport.progress)}%`)
                        .and('contain', artifactImport.status)
                        .and('contain', artifactImport.phase)
                        .and('contain', artifactImport.artifact?.type || 'unknown')

                    if (artifactImport.status ==='failled' && !Object.is(artifactImport.log, null))
                        cy.wrap($el).should('contain', artifactImport.log)
                })
            })
        })
    })

    context('interaction with yet succeed imported artifacts', () => {
        const fixture = 'importer/non-success.json'
        beforeEach(() => {
            cy.intercept('/kg/artifact/imports?*', { fixture }).as('import')
            cy.wait('@import')
        })

        it('can delete an artifact import given it does not succeed', () => {
            cy.fixture(fixture).then((data) => {
                const artifactImports = data.artifact_imports
                cy.get('.v-card').should('have.length', artifactImports.length)
                cy.get('.v-card').each(($el, index) => {
                    const artifactImport = artifactImports[index]
                    cy.intercept(`/kg/artifact/import/${artifactImport.id}`, (req) => {
                        expect(req.method).to.equal('DELETE')
                    }).as('deleteImport')
                    cy.wrap($el).find('button').first().should('contain', 'Delete Import').click()
                    cy.wait('@deleteImport')
                })
            })
        })

        it('cannot read artifact detail given it does not succeed', () => {
            cy.fixture(fixture).then((data) => {
                const artifactImports = data.artifact_imports
                cy.get('.v-card').should('have.length', artifactImports.length)
                cy.get('.v-card').each(($el, index) => {
                    const artifactImport = artifactImports[index]
                    cy.wrap($el).find('a').last().should('contain', 'Read More').and('have.attr', 'disabled', 'disabled')
                })
            })
        })
    })

    context('interaction with successful imported artifacts', () => {
        const fixture = 'importer/success.json'
        beforeEach(() => {
            cy.intercept('/kg/artifact/imports?*', { fixture }).as('import')
            cy.wait('@import')
        })

        it('can delete imported artifact', () => {
            cy.fixture(fixture).then((data) => {
                const artifactImports = data.artifact_imports
                cy.get('.v-card').should('have.length', artifactImports.length)
                cy.get('.v-card').each(($el, index) => {
                    const artifactImport = artifactImports[index]
                    cy.intercept(`/kg/artifact/${artifactImport.artifact_group_id}/${artifactImport.artifact_id}`, (req) => {
                        expect(req.method).to.equal('DELETE')
                    }).as('deleteImport')
                    cy.wrap($el).find('button').first().should('contain', 'Delete').click()
                    cy.wait('@deleteImport')
                })
            })
        })

        it('can archive imported artifact', () => {
            cy.fixture(fixture).then((data) => {
                const artifactImports = data.artifact_imports
                cy.get('.v-card').should('have.length', artifactImports.length)
                cy.get('.v-card').each(($el, index) => {
                    const artifactImport = artifactImports[index]
                    cy.intercept(`/kg/artifact/import/${artifactImport.id}`, (req) => {
                        expect(req.method).to.equal('PUT')
                        expect(req.body).deep.equal({ archived: true })
                    }).as('archiveImport')
                    cy.wrap($el).find('button').eq(1).should('contain', 'Archive').click()
                    cy.wait('@archiveImport')
                })
            })
        })

        it('can edit imported artifact', () => {
            cy.fixture(fixture).then((data) => {
                const artifactImports = data.artifact_imports
                cy.get('.v-card').should('have.length', artifactImports.length)
                cy.get('.v-card').each(($el, index) => {
                    const artifactImport = artifactImports[index]
                    cy.wrap($el).find('a').eq(1).should('contain', 'Edit').click()
                    cy.url().should('eq', `${Cypress.env('baseUrl')}/artifact/${artifactImport.artifact_group_id}/${artifactImport.artifact_id}?edit=true`)
                })
            })
        })

        it('can view imported artifact', () => {
            cy.fixture(fixture).then((data) => {
                const artifactImports = data.artifact_imports
                cy.get('.v-card').should('have.length', artifactImports.length)
                cy.get('.v-card').each(($el, index) => {
                    const artifactImport = artifactImports[index]
                    cy.wrap($el).find('a').last().should('contain', 'Read More').click()
                    cy.url().should('eq', `${Cypress.env('baseUrl')}/artifact/${artifactImport.artifact_group_id}/${artifactImport.artifact_id}`)
                })
            })
        })
    })
})