export default () => ({
  drawer: null,
  color: 'success',
  image:
    'https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg',
  ZENODO_API_URL: process.env.ZENODO_API_URL || 'https://zenodo.org/api/',
  ZENODO_API_KEY: process.env.ZENODO_API_KEY || ''
})
