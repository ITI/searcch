import VueSanitize from 'vue-sanitize'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueSanitize.default)
})