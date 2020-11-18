export default function({ $auth }) {
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
    }
  }
}
