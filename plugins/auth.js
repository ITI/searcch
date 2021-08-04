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
    // TODO: Note, this is validusers for development
    // if (!validUsers.includes($auth.user.login.toLowerCase())) {
    //   $auth.logout('github')
    // } else {
    let payload = {
      strategy: 'github',
      token: $auth.getToken('github')
    }
    $loginEndpoint
      .create(payload)
      .then(response => {
        if (response.userid) {
          store.commit('user/SET_USER_TOKEN', payload.token)
          store.commit('user/SET_USER', response.person)
          store.commit('user/SET_USERID', response.userid)
          store.commit('user/SET_USER_IS_ADMIN', response.is_admin)
          store.commit('user/SET_USER_CAN_ADMIN', response.can_admin)
          store.dispatch('artifacts/fetchFavorites', response.userid)
        }
      })
      .catch(error => {
        console.log('Login error', error)
      })
    // }
  }
}
