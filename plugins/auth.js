export default function({ $loginEndpoint, store, $auth }) {
  var validUsers = [
    'timyardley',
    'jelenamirkovic',
    'eeide',
    'lauratinnel',
    'hardiksurana',
    'imneedham',
    'carboxylman',
    'vivekkarne'
  ]
  if (!$auth.loggedIn) {
    return
  } else {
      $auth.onError(function(error, payload) { console.log("auth error: ", error, payload) })
    // TODO: Note, this is validusers for development
    // if (!validUsers.includes($auth.user.login.toLowerCase())) {
    //   $auth.logout('github')
    // } else {
    let strategy = $auth.$storage.getUniversal('strategy')
    if (strategy === "googlecustom") {
      strategy = "google"
    }
    let payload = {
      strategy: strategy,
      token: $auth.strategy.token.get()
    }
    $loginEndpoint
      .create(payload)
      .then(response => {
        if (typeof response !== 'undefined' && response.userid >= 0) {
          store.commit('user/SET_USER_TOKEN', payload.token)
          store.commit('user/SET_USER', response.person)
          store.commit('user/SET_USERID', response.userid)
          store.commit('user/SET_USER_IS_ADMIN', response.is_admin)
          store.commit('user/SET_USER_CAN_ADMIN', response.can_admin)
          store.dispatch('artifacts/fetchFavorites', response.userid)
          document.cookie = `session_id=${payload.token}`;
        }
      })
      .catch(error => {
        console.log('Login error', error)
      })
    // }
  }
}
