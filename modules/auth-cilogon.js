var rewire = require('rewire')
var authRewire = rewire('@nuxtjs/auth-next')
var assignDefaults = authRewire.__get__('assignDefaults')
var addAuthorize = authRewire.__get__('addAuthorize')

export default function (nuxt, strategy) {
  const DEFAULTS = {
    scheme: "oauth2",
    endpoints: {
      authorization: 'https://cilogon.org/authorize/',
      token: 'https://cilogon.org/oauth2/token',
      userInfo: 'https://cilogon.org/oauth2/userinfo'
    },
    grantType: "authorization_code",
    //responseType: 'code',
    accessType: 'offline',
    scope: ['openid', 'profile', 'email']
  };
  if (typeof strategy !== 'undefined') {
    assignDefaults(strategy, DEFAULTS);
    addAuthorize(nuxt, strategy, true);
  }
}
