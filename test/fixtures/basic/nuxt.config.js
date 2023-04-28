import config from '../../../nuxt.config.js'

export default defineNuxtConfig({
  modules: [ 'nuxt-security' ],
  security: config.security
})