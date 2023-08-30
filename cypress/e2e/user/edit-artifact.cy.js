const bytesToSize = bytes => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes == 0) return '0 Bytes'
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

const testDisableStatus = function () {
    it('should disable save button', () => {
        cy.get('#btn-save-artifact').should('be.visible').and('be.disabled')
    })

    it('should disable publish button', () => {
        cy.get('#btn-publish-artifact').should('be.visible').and('be.disabled')
    })

    it('should disable keywords add button', () => {
        cy.get('#container-artifact-keywords button').should('be.visible').and('be.disabled')
    })

    it('should disable programming language add button', () => {
        cy.get('#container-artifact-programming-languages button').should('be.visible').and('be.disabled')
    })
}

const testSubmitInput = function (field, value) {
    it(`should submit successfully when artifact ${field} is valid`, () => {
        cy.get(`#input-artifact-${field}`).clear().type(value)
        cy.get('#btn-save-artifact').click()
        cy.get('@updateArtifact').its('request.body').should('deep.contain', {
            [field]: value
        })
    })
}

describe('Edit Artifact', () => {
    const artifactFixture = 'artifact.json'
    const licensesFixture = 'licenses.json'
    const venuesFixture = 'venues.json'
    const organizationsFixture = 'organizations.json'
    const badgesFixture = 'badges.json'
    beforeEach(() => {
        cy.loadArtifactAsOwner(artifactFixture)
        cy.get('@fixture').then((fixture) => {
            cy.intercept('GET', `/kg/artifact/${fixture.artifact.artifact_group_id}/${fixture.artifact.id}`, fixture)
            cy.intercept('PUT', `/kg/artifact/${fixture.artifact.artifact_group_id}/${fixture.artifact.id}`, fixture).as('updateArtifact')
            cy.intercept('GET', '/kg/licenses?*', { fixture: licensesFixture })
            cy.intercept('GET', '/kg/venues?*', { fixture: venuesFixture })
            cy.intercept('GET', '/kg/organizations?*', { fixture: organizationsFixture })
            cy.intercept('GET', '/kg/badges?*', { fixture: badgesFixture })
            cy.login()
            cy.visit(`${Cypress.env('baseUrl')}/artifact/${fixture.artifact.artifact_group_id}/${fixture.artifact.id}?edit=true`)
        })
        cy.fixture(licensesFixture).as('licensesFixture')
        cy.fixture(venuesFixture).as('venuesFixture')
        cy.fixture(organizationsFixture).as('organizationsFixture')
        cy.fixture(badgesFixture).as('badgesFixture')
    })

    context('should display edit page correctly', () => {
        it('should display the edit artifact page', () => {
            cy.get('.v-form').should('be.visible').and('contain', 'Edit Artifact')
        })

        it('should display the artifact title and link', () => {
            cy.fixture(artifactFixture).then((fixture) => {
                cy.get('.v-sheet').first().should('contain', fixture.artifact.title)
                cy.get('.v-sheet').first().should('contain', fixture.artifact.url)
            })
        })

        it('should display edit artifact relation link', () => {
            cy.get('@fixture').then((fixture) => {
                cy.get(`a[href="/artifact/${fixture.artifact.artifact_group_id}/${fixture.artifact.id}?edit_relation=true"]`)
                    .should('be.visible')
                    .and('not.be.disabled')
            })
        })

        it('should display artifact title input', function () {
            cy.get('#input-artifact-title')
                .should('be.visible')
                .and('not.be.disabled')
                .and('have.value', this.fixture.artifact.title)
        })

        it('should display artifact description input', function () {
            cy.get('#input-artifact-description')
                .should('be.visible')
                .and('not.be.disabled')
                .and('have.value', this.fixture.artifact.description)
        })

        it('should display artifact url input', function () {
            cy.get('#input-artifact-url')
                .should('be.visible')
                .and('not.be.disabled')
                .and('have.value', this.fixture.artifact.url)
        })

        it('should display artifact type input', function () {
            cy.get('#select-artifact-type')
                .should('exist')
                .and('not.be.disabled')
                .and('have.value', this.fixture.artifact.type)
        })

        it('should display artifact author chips', function () {
            cy.get('#container-artifact-authors .v-card-title').should('contain', 'Authors')
            cy.get('#container-artifact-authors button .mdi-plus').should('be.visible')
            this.fixture.artifact.affiliations.forEach((affiliation) => {
                cy.get('#container-artifact-authors .v-chip')
                    .should('contain', affiliation.affiliation.person.name)
                    .find('.v-chip__close').should('be.visible')
            })
        })

        it('should display artifact keywords chips', function () {
            cy.get('#container-artifact-keywords .v-card-title').should('contain', 'Keywords')
            cy.get('#container-artifact-keywords button .mdi-plus').should('be.visible')
            this.fixture.artifact.tags.forEach((tag) => {
                cy.get('#container-artifact-keywords .v-chip')
                    .should('contain', tag.tag)
                    .find('.v-chip__close').should('be.visible')
            })
        })

        it('should display artifact programming language chips', function () {
            cy.get('#container-artifact-programming-languages .v-card-title').should('contain', 'Programming Languages')
            cy.get('#container-artifact-programming-languages button .mdi-plus').should('be.visible')
            this.fixture.artifact.meta.filter((meta) => meta.name === 'languages').forEach((language) => {
                cy.get('#container-artifact-programming-languages .v-chip')
                    .find('input').should('have.value', language.value)
                cy.get('#container-artifact-programming-languages .v-chip')
                    .find('.v-chip__close').should('be.visible')
            })
        })

        it('should display artifact badge input', function () {
            cy.get('#container-artifact-badges .v-card-title').should('contain', 'Badges')
            cy.get('#container-artifact-badges button .mdi-plus').should('be.visible')
            this.fixture.artifact.badges.forEach((badge) => {
                cy.get('#container-artifact-badges').should('contain', badge.badge.title)
            })
            cy.get('#container-artifact-badges .mdi-close')
                .should('have.length', this.fixture.artifact.badges.length)
        })

        it('should display artifact importer', function () {
            cy.get('#container-artifact-importer .v-chip')
                .should('contain', `${this.fixture.artifact.importer.name} v${this.fixture.artifact.importer.version}`)
                .find('.v-chip__close').should('not.exist')
        })

        it('should display artifact licenses', function () {
            cy.get('#container-artifact-licenses .v-chip')
                .should('contain', `${this.fixture.artifact.license.short_name} (${this.fixture.artifact.license.long_name})`)
                .find('.v-chip__close').should('not.exist')
        })

        it('should display artifact files', () => {
            cy.fixture('artifact.json').then((artifact) => {
                artifact.artifact.files.forEach((file, i) => {
                    cy.get(`#file${i}`).should('contain', file.name)
                        .and('contain', file.size ? bytesToSize(file.size) : 'unknown')
                        .and('contain', file.filetype ?? 'unkown')
                        .find('.v-list-item__prepend > .mdi-close')
                            .should('be.visible')
                            .and('not.be.disabled')

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

        it('should display save/publish button', () => {
            cy.get('#btn-save-artifact').should('be.visible').and('not.be.disabled')
            cy.get('#btn-publish-artifact').should('be.visible').and('not.be.disabled')
        })
    })

    context('edit artifact title', () => {
        context('display error when artifact title is empty', () => {
            beforeEach(() => {
                cy.get('#input-artifact-title').clear()
            })

            it('should display error message in input container', () => {
                cy.get('#container-artifact-title').should('contain', 'required')
            })

            testDisableStatus()
        })

        context('display error when artifact title is whitespace string', () => {
            beforeEach(() => {
                cy.get('#input-artifact-title').clear().type(' ')
            })

            it('should display error message in input container', () => {
                cy.get('#container-artifact-title').should('contain', 'empty string invalid')
            })

            testDisableStatus()
        })

        testSubmitInput('title', 'new title')
    })

    context('edit artifact description', () => {
        context('display error when artifact description is empty', () => {
            beforeEach(() => {
                cy.get('#input-artifact-description').clear()
            })

            it('should display error message in input container', () => {
                cy.get('#container-artifact-description').should('contain', 'required')
            })

            testDisableStatus()
        })

        context('display error when artifact description is whitespace string', () => {
            beforeEach(() => {
                cy.get('#input-artifact-description').clear().type(' ')
            })

            it('should display error message in input container', () => {
                cy.get('#container-artifact-description').should('contain', 'empty string invalid')
            })

            testDisableStatus()
        })

        testSubmitInput('description', 'new description')
    })

    context('edit artifact url', () => {
        context('display error when artifact url is empty', () => {
            beforeEach(() => {
                cy.get('#input-artifact-url').clear()
            })

            it('should display error message in input container', () => {
                cy.get('#container-artifact-url').should('contain', 'required')
            })

            testDisableStatus()
        })

        context('display error when artifact url is not a valid url', () => {
            beforeEach(() => {
                cy.get('#input-artifact-url').clear().type('   ')
            })

            it('should display error message in input container', () => {
                cy.get('#container-artifact-url').should('contain', 'Invalid URL')
            })

            testDisableStatus()
        })

        testSubmitInput('url', 'https://www.google.com')
    })

    it('should update artifact type when submit', () => {
        cy.get('#container-artifact-type .v-input__control').click()
        cy.get('.v-overlay:last-of-type .v-list-item').last().click({ force: true })
        cy.get('#select-artifact-type').should('have.value', 'other')
        cy.get('#btn-save-artifact').click()
        cy.get('@updateArtifact').its('request.body').should('deep.contain', {
            type: 'other'
        })
    })

    context('edit artifact keywords', () => {
        const keyword = 'new keyword'

        it(`should add new keywords`, function () {
            let p = { tag: keyword }
            cy.get(`#container-artifact-keywords button`).click()
            cy.get(`#container-artifact-keywords .v-input`).last().type(`${keyword}{enter}`)
            cy.get('#btn-save-artifact').click()
            cy.get('@updateArtifact').its('request.body.tags').then((fixture) => {
                expect(fixture.filter((e) => {
                    return Object.keys(p).every((key) => Cypress._.isEqual(e[key], p[key]))
                }).length).to.gte(1)
            })
        })

        it(`should remove keywords`, function () {
            cy.get(`#container-artifact-keywords .v-chip__close`).first().click()
            cy.get(`#container-artifact-keywords .v-chip`).should('have.length', this.fixture.artifact.tags.length - 1)
            cy.get('#btn-save-artifact').click()
            cy.get('@updateArtifact').its(`request.body.tags`).should('have.length', this.fixture.artifact.tags.length - 1)
        })
    })

    context('edit artifact programming languages', function () {
        const language = 'new language'

        it(`should add new programming-languages`, function () {
            cy.get(`#container-artifact-programming-languages button`).click()
            cy.get(`#container-artifact-programming-languages .v-input`).last().type(`${language}{enter}`)
            cy.get('#btn-save-artifact').click()
            cy.get('@updateArtifact').its(`request.body.meta`).then((fixture) => {
                expect(fixture.filter((meta) => meta.name === 'languages')[0].value)
                    .to.equal([...this.fixture.artifact.meta.filter((meta) => meta.name === 'languages')
                        .map(e => e.value), language]
                        .join(','))
            })
        })

        it(`should remove programming-languages`, function () {
            cy.get(`#container-artifact-programming-languages .v-chip__close`).first().click()
            cy.get(`#container-artifact-programming-languages .v-chip`).should('have.length', 0)
            cy.get('#btn-save-artifact').click()
            cy.get('@updateArtifact').its(`request.body.meta`).then((fixture) => {
                expect(fixture.filter((meta) => meta.name === 'languages')).to.have.length(0)
            })
        })
    })

    context('edit artifact badge', function () {
        it(`should add new badge`, function () {
            const index = 3
            cy.get(`#container-artifact-badges button`).click()
            cy.get(`#container-artifact-badges .v-field__input`).last().click()
            cy.get('.v-overlay:last-of-type .v-list-item').eq(index).click()
            cy.get('#btn-save-artifact').click()
            cy.get('@updateArtifact').its(`request.body.badges`).then((badgesReq) => {
                cy.get('@badgesFixture').then(({ badges }) => {
                    expect(badgesReq.filter((e) =>
                        e.badge.title === badges[index].title
                        && e.badge.organization === badges[index].organization).length
                    ).to.gte(1)
                })
            })
        })

        it(`should remove badge`, function () {
            cy.get(`#container-artifact-badges .mdi-close`).first().click()
            cy.get('#btn-save-artifact').click()
            cy.get('@updateArtifact').its(`request.body.badges`).should('have.length', this.fixture.artifact.badges.length - 1)
        })
    })

    context('edit artifact licenses', () => {
        it(`should add new license`, function () {
            const index = 0
            cy.get(`#container-artifact-licenses .mdi-close`).first().click()
            cy.get(`#container-artifact-licenses .v-field__input`).click({ force: true })
            cy.get('.v-overlay:last-of-type .v-list-item').eq(index).click()
            cy.get('#btn-save-artifact').click()
            cy.get('@updateArtifact').its(`request.body.license`).then((license) => {
                cy.get('@licensesFixture').then(({ licenses }) => {
                    expect(license).to.deep.equal(licenses[index])
                })
            })
        })

        it(`should remove license`, function () {
            cy.get(`#container-artifact-licenses .mdi-close`).first().click()
            cy.get('#btn-save-artifact').click()
            cy.get('@updateArtifact').its(`request.body.license`).should('be.null')
        })
    })

    context('edit artifact files', () => {
        context('display error when file url is empty', () => {
            beforeEach(() => {
                cy.get(`#container-artifact-files button`).last().click()
                cy.get('#container-artifact-files textarea').last().clear().blur()
            })

            it('should display error message in input container', () => {
                cy.get('#container-artifact-files').should('contain', 'required')
            })

            testDisableStatus()
        })

        context('display error when file url is not a valid url', () => {
            beforeEach(() => {
                cy.get(`#container-artifact-files button`).last().click()
                cy.get('#container-artifact-files textarea').last().clear().type('invalid url').blur()
            })

            it('should display error message in input container', () => {
                cy.get('#container-artifact-files').should('contain', 'Invalid URL')
            })

            testDisableStatus()
        })

        it('should submit successfully when file url is valid', () => {
            const url = 'https://www.google.com'
            cy.get(`#container-artifact-files button`).last().click()
            cy.get('#container-artifact-files textarea').last().clear().type(url).blur()

            cy.get('#btn-save-artifact').click()
            cy.get('@updateArtifact').its('request.body.files').then((files) => {
                expect(files.filter((e) => e.url === url).length).to.gte(1)
            })
        })
    })
})