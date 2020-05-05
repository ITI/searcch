import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - SEARCCH Portal ',
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
      { property: 'twitter:site', value: '@timyardley' },
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
        content: 'SEARCCH Portal for Cyber Security Artifacts'
      },
      {
        property: 'og:description',
        content:
          'SEARCCH: Sharing Expertise and Artifacts for Reuse through a Cybersecurity Community Hub. SEARCCH is creating a collaborative, community-driven platform that lowers the barrier to sharing by aiding researchers in packaging, importing, locating, understanding, and reusing experiment artifacts. The artifacts organized by the platform, including tools, methodologies, documentation, and data, can be deployed to community testbeds for performing new experiments. Concurrently, SEARCCH engages in outreach activities to build an active, diverse, online community around the hub to enable direct sharing of expertise and crowdsourcing research ideas and experiment design. Through a process of continuous learning and improvement, the hub will grow over time to include collections of artifacts covering a broad range of cybersecurity research topics and add support for newly identified community needs. These activities together will transform the way cybersecurity research is conducted in the cybersecurity community, improving the overall scientific quality of cybersecurity research through validation, repeatable sharing and reuse, and a collective approach to building on research results.'
      },
      // FIXME: change this to something more appropriate in the future
      { property: 'og:image', content: 'https://nuxtjs.org/meta_640.png' },
      { property: 'og:image:height', content: 640 },
      { property: 'og:image:width', content: 640 },
      { property: 'og:image:type', content: 'image/png' },
      { property: 'og:image:alt', content: 'Nuxt.js Logo' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  serverMiddleware: ['~/servermiddleware/seo.js'],
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/assets/main.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv',
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
    '@nuxtjs/axios'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
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
  dotenv: {
    /* module options */
    path: '.env',
    filename: '.env.' + process.env.NODE_ENV
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
