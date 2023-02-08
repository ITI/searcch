export default {
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s',
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      // Twitter Card Meta
	// Doc: https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started.html
	
      // OpenGraph Meta
      // Doc: http://ogp.me/
      {
        property: 'og:url',
        content: 'https://ant.isi.edu/classnet/'
      },
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'CLASSNET Project'
      },
      {
        property: 'og:description',
        content:
          'Community Labeling and Sharing of Security and Networking Test datasets (CLASSNET) project supports network and security research with new, labeled, rich and diverse datasets to the research community. The project develops a framework for collaborative, community-driven enrichment and labeling of data, enabling use of our datasets for machine learning in networking and security. Second, the CLASSNET project will make data available to researchers through multiple methods, ensuring privacy of data while enabling flexible data computation. Finally, the project will also generate diverse continuous (constantly, automatically updated) and curated (selected by human) datasets for research use.'
      },
      {
        property: 'og:image',
        content: 'https://comunda.isi.edu/images/horiz-tagline.png'
      },
      { property: 'og:image:width', content: 433 },
      { property: 'og:image:height', content: 138 },
      { property: 'og:image:type', content: 'image/png' },
      { property: 'og:image:alt', content: 'COMUNDA Logo' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  serverMiddleware: ['~/servermiddleware/seo.js'],
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#000' },
  /*
   ** Global CSS
   */
  css: ['~/assets/main.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/filters',
    '~/plugins/vue2-filters',
    '~/plugins/repository',
    '~/plugins/base',
    '~/plugins/chartist',
    '~/plugins/components',
    '~/plugins/sanitize',
    '~/plugins/moment',
    '~/plugins/markdown'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/vuetify',
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-165120903-1'
      }
    ]
  ],
  /* uncomment this only for development testing
  googleAnalytics: {
    debug: {
      enabled: true,
      sendHitTask: true
    }
  },
  */
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '~modules/auth-cilogon',
    '~modules/auth-googlecustom',
    '@nuxtjs/proxy',
    [
      '@dansmaculotte/nuxt-security',
      {
        /* module options */
        dev: true,
        hsts: {
          maxAge: 15552000,
          includeSubDomains: true,
          preload: true
        },
        csp: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
              "'self' 'unsafe-eval' 'unsafe-inline' https://www.google-analytics.com"
            ],
            objectSrc: ["'self'"],
            styleSrc: [
              "'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net"
            ],
            fontSrc: [
              "'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net"
            ],
            connectSrc: [
              "'self' https://api.github.com https://cilogon.org https://www.gravatar.com"
            ],
            // asterisk here due to badge images
            imgSrc: [
              "'self' https://avatars.githubusercontent.com https://*.gravatar.com *"
            ]
          },
          reportOnly: false
        },
        referrer: 'same-origin',

        securityFile: {
          contacts: ['mailto:security@cyberexperimentation.org'],
          canonical:
            'https://hub.cyberexperimentation.org/.well-know/security.txt',
          preferredLanguages: ['en']
        },
        additionalHeaders: true
      }
    ]
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true,
    debug: process.env.AXIOS_DEBUG == 'true'
  },
  proxy: {
    '/kg/': {
      target: process.env.BACKEND_URL
        ? process.env.BACKEND_URL
        : process.env.PRODUCTION == 'true'
        ? 'https://searcch-backend-local-dev:8080/v1' // production backend
        : 'https://searcch-backend-local-dev:8080/v1', // development backend
      pathRewrite: { '^/kg/': '/' },
      headers: {
        'X-Api-Key':
          process.env.PRODUCTION == 'true'
            ? process.env.KG_API_KEY
            : process.env.KG_API_KEY
      },
      changeOrigin: true
    },
    '/avatar/': { target: 'https://www.gravatar.com/' }
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#00476B',
          accent: '#6D6E71',
          secondary: '#395C23'
        }
      }
    }
  },
  publicRuntimeConfig: {},
  privateRuntimeConfig: {
    gitHubClientID: process.env.GITHUB_CLIENT_ID || 'undefined',
    gitHubClientSecret: process.env.GITHUB_CLIENT_SECRET || 'undefined',
    googleClientID: process.env.GOOGLE_CLIENT_ID || 'undefined',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || 'undefined',
    cilogonClientID: process.env.CILOGON_CLIENT_ID || 'undefined',
    cilogonClientSecret: process.env.CILOGON_CLIENT_SECRET || 'undefined'
  },
  /*
   ** Build configuration
   */
  build: {
    extractCSS: true,
    extend(config, ctx) {},
    transpile: [/^vuetify/]
  },
  router: {
    // middleware: 'auth',
    mode: 'history'
  },
  auth: {
    strategies: {
      local: false,
      github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        // NB: workaround for v5 defu-based setDefaults that concats array
        // values *onto* defaults.  Surely this will change eventually; it
        // is not backwards-compat to v4.9.1 .
        scope: 'read:user user:email'
      },
      googlecustom: {
        provider: '~modules/auth-googlecustom.js',
        scheme: 'oauth2',
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        //accessType: 'offline',
      },
      cilogon: {
        provider: '~modules/auth-cilogon.js',
        scheme: 'oauth2',
        clientId: process.env.CILOGON_CLIENT_ID,
        clientSecret: process.env.CILOGON_CLIENT_SECRET
      }
    },
    plugins: ['~/plugins/auth.js', '~/plugins/axios.js'],
    localStorage: false
  },
  cookie: {
    options: {
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax'
    }
  }
}
