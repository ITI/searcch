var rewire = require('rewire')
var authRewire = rewire('@nuxtjs/auth-next')
var assignDefaults = authRewire.__get__('assignDefaults')
var addAuthorize = authRewire.__get__('addAuthorize')

export default function (nuxt, strategy) {
  const DEFAULTS = {
    scheme: "oauth2",
    endpoints: {
      authorization: "https://accounts.google.com/o/oauth2/auth",
      userInfo: "https://www.googleapis.com/oauth2/v3/userinfo",
      token: "https://oauth2.googleapis.com/token"
    },
    codeChallengeMethod: '',
    grantType: "authorization_code",
    responseType: 'code',
    scope: ['openid', 'profile', 'email']
  };
  if (typeof strategy !== 'undefined') {
    assignDefaults(strategy, DEFAULTS);
    addAuthorize(nuxt, strategy);
  }
}
