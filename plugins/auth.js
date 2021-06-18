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
        // console.log(response)
        if (response.userid) {
          store.commit('user/SET_USER_ID', response.userid)
          store.commit('user/SET_USERNAME', response.person.name)
          store.dispatch('artifacts/fetchFavorites', response.userid)
        }
      })
      .catch(error => {
        console.log('Login error', error)
      })
    // }
  }
}
