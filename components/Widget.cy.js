import Widget from './Widget.vue'

describe('<Widget />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(Widget)
  })
})