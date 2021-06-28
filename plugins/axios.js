export default function({ $axios, store }) {
  $axios.onRequest(config => {
    if (store.state.user.user_token) {
      config.headers.common['Authorization'] = store.state.user.user_token
    }
  })
}
