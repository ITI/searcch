export default defineNuxtPlugin(({ $userStore }) => {
  return {
    provide: {
      // provide a wrapper for $fetch
      fetch: async (url, options) => {
        if ($userStore.user_token && url.startsWith('kg/')) {
          const headers = new Headers()
          headers.append('Authorization', $userStore.user_token)
          options = { ...options, headers }
        }
        // $fetch is globally accessible as a nuxt built-in plugin
        return $fetch(url, options)
      }
    }
  }
})