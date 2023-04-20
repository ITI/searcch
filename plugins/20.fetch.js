export default defineNuxtPlugin(({ $userStore }) => {
  return {
    provide: {
      // provide a wrapper for $fetch
      fetch: async (url, options) => {
        if ($userStore.user_token && url.startsWith('/kg/')) {
          // console.log('added header to url: ' + url)
          options.headers.Authorization = $userStore.user_token
        }
        // $fetch is globally accessible as a nuxt built-in plugin
        return $fetch(url, options)
      }
    }
  }
})