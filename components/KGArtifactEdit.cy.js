import KGArtifactEdit from './KGArtifactEdit.vue'

describe('<KGArtifactEdit />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(KGArtifactEdit)
  })
})