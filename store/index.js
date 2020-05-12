export const state = () => ({
  ZENODO_API_URL: process.env.ZENODO_API_URL || 'https://zenodo.org/api/',
  ZENODO_API_KEY: process.env.ZENODO_API_KEY || '',
  sidebar: false
})
