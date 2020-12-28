export default function({ $loginEndpoint, store, $auth }) {
  var validUsers = [
    'timyardley',
    'jelenamirkovic',
    'eeide',
    'lauratinnel',
    'inderdeepsingh',
    'teesh',
    'hardiksurana',
    'imneedham',
    'carboxylman'
  ]
  if (!$auth.loggedIn) {
    return
  } else {
    if (!validUsers.includes($auth.user.login.toLowerCase())) {
      $auth.logout('github')
    } else {
      let payload = {
        strategy: 'github',
        token: $auth.getToken('github'),
      }
      $loginEndpoint.create(payload).then(response => {
        console.log(response)
        if (response.userid) {
          store.commit('user/SET_USER_ID', response.userid)
          store.dispatch('artifacts/fetchFavorites', response.userid)
        }
      }).catch(error => {
        console.log("Login error", error)
      })
    }
  }
}
