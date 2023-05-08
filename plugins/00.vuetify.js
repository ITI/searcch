// plugins/vuetify.js
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
  })

  nuxtApp.vueApp.use(vuetify)
})
