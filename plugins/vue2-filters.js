import Vue2Filters from "vue2-filters"

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Vue2Filters.default)
})