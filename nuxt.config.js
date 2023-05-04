export default defineNuxtConfig({
  dir: {
    public: 'static',
  },
  /*
   ** Headers of the page
   */
  app: {
    head: {
      titleTemplate: '%s - SEARCCH Hub ',
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
        { property: 'twitter:card', content: 'summary' },
        { property: 'twitter:site', value: '@SEARCCH_HUB' },
        { property: 'twitter:creator', value: '@timyardley' },

        // OpenGraph Meta
        // Doc: http://ogp.me/
        {
          property: 'og:url',
          content: 'https://hub.cyberexperimentation.org/'
        },
        { property: 'og:type', content: 'website' },
        {
          property: 'og:title',
          content: 'SEARCCH Hub for Cyber Security Artifacts'
        },
        {
          property: 'og:description',
          content:
            'SEARCCH: Sharing Expertise and Artifacts for Reuse through a Cybersecurity Community Hub. SEARCCH is creating a collaborative, community-driven platform that lowers the barrier to sharing by aiding researchers in packaging, importing, locating, understanding, and reusing experiment artifacts. The artifacts organized by the platform, including tools, methodologies, documentation, and data, can be deployed to community testbeds for performing new experiments. Concurrently, SEARCCH engages in outreach activities to build an active, diverse, online community around the hub to enable direct sharing of expertise and crowdsourcing research ideas and experiment design. Through a process of continuous learning and improvement, the hub will grow over time to include collections of artifacts covering a broad range of cybersecurity research topics and add support for newly identified community needs. These activities together will transform the way cybersecurity research is conducted in the cybersecurity community, improving the overall scientific quality of cybersecurity research through validation, repeatable sharing and reuse, and a collective approach to building on research results.'
        },
        {
          property: 'og:image',
          content: 'https://hub.cyberexperimentation.org/images/horiz-tagline.png'
        },
        { property: 'og:image:width', content: 433 },
        { property: 'og:image:height', content: 138 },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:image:alt', content: 'SEARCCH Logo' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#000' },
  /*
   ** Global CSS
   */
  css: [
    '~/assets/main.css',
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css'
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
    'nuxt-lazy-hydrate',
    '@sidebase/nuxt-auth',
    '@pinia/nuxt',
    'nuxt-proxy',
    'nuxt-security',
    // [
    //   '@nuxtjs/google-analytics',
    //   {
    //     id: 'UA-165120903-1'
    //   }
    // ],
  ],

  security: {
    headers: {
      contentSecurityPolicy: {
        'connect-src': ["'self' https://api.github.com https://cilogon.org https://www.gravatar.com"],
        'default-src': ["'self'"],
        'font-src': ["'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net"],
        // asterisk here due to badge images
        'img-src': ["'self' https://avatars.githubusercontent.com https://*.gravatar.com *"],
        'object-src': ["'self'"],
        'script-src': ["'self' 'unsafe-eval' 'unsafe-inline' https://www.google-analytics.com"],
        'script-src-attr': ["'none'"],
        'style-src': ["'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net"],
      },
      referrerPolicy: 'same-origin',
      strictTransportSecurity: {
        maxAge: 15552000,
        includeSubdomains: true,
        preload: true,
      },
    },
  },  

  
  proxy: {
    options: [
      {
        pathFilter: '/kg/',
        target: process.env.BACKEND_URL
          ? process.env.BACKEND_URL
          : process.env.PRODUCTION == 'true'
          ? 'https://hub-api.cyberexperimentation.org/v1' // production backend
          : 'https://hub-dev-api.cyberexperimentation.org/v1', // development backend
        changeOrigin: true,
        pathRewrite: { '^/kg/': '/' },
        headers: {
          'X-Api-Key':
            process.env.PRODUCTION == 'true'
              ? process.env.KG_API_KEY
              : process.env.KG_DEV_API_KEY
        },
      },
      {
        pathFilter: '/avatar/',
        target: 'https://www.gravatar.com/',
      }
    ]
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  // vuetify: {
  //   customVariables: ['~/assets/variables.scss'],
  //   theme: {
  //     theme="dark": false,
  //     themes: {
  //       light: {
  //         primary: '#00476B',
  //         accent: '#6D6E71',
  //         secondary: '#395C23'
  //       }
  //     }
  //   }
  // },
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
    transpile: ['vuetify']
  },
  router: {
    mode: 'history'
  },
  cookie: {
    options: {
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax'
    }
  }
})
