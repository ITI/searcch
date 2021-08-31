export default function({ $axios, store }) {
  $axios.onRequest(config => {
    if (store.state.user.user_token && config.url.startsWith('/kg/')) {
      // console.log('added header to url: ' + config.url)
      config.headers.common['Authorization'] = store.state.user.user_token
    }
  })
}
