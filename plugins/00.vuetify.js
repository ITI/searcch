import { createVuetify } from 'vuetify'
import { VDataTable, VDataTableServer } from 'vuetify/labs/VDataTable'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components: {
      ...components,
      VDataTable,
      VDataTableServer,
    },
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: '#00476B',
            accent: '#6D6E71',
            secondary: '#395C23'
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
