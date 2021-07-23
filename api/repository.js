var qs = require('qs')
// Provide nuxt-axios instance to use same configuration across the whole project
// I've used typical CRUD method names and actions here
export default $axios => (resource, error) => ({
  index(payload) {
    return $axios
      .$get(`${resource}`, {
        params: payload,
        paramsSerializer: function(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' })
        }
      })
      .catch(function(e) {
        if (e.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(e.response.data)
          console.log(e.response.status)
          console.log(e.response.headers)
        } else if (e.request) {
          // The request was made but no response was received
          // `e.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(e.request)
        } else {
          // Something happened in setting up the request that triggered an e
          console.log('e', e.message)
        }
        console.log(e.config)
        $nuxt.error(e)
      })
  },

  show(id) {
    return $axios.$get(`${resource}/${id}`).catch(function(e) {
      if (e.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(e.response.data)
        console.log(e.response.status)
        console.log(e.response.headers)
      } else if (e.request) {
        // The request was made but no response was received
        // `e.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(e.request)
      } else {
        // Something happened in setting up the request that triggered an e
        console.log('e', e.message)
      }
      console.log(e.config)
      $nuxt.error(e)
    })
  },

  create(payload) {
    return $axios.$post(`${resource}`, payload).catch(function(e) {
      if (e.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(e.response.data)
        console.log(e.response.status)
        console.log(e.response.headers)
      } else if (e.request) {
        // The request was made but no response was received
        // `e.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(e.request)
      } else {
        // Something happened in setting up the request that triggered an e
        console.log('e', e.message)
      }
      console.log(e.config)
      $nuxt.error(e)
    })
  },

  update(id, payload) {
    return $axios.$put(`${resource}/${id}`, payload).catch(function(e) {
      if (e.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(e.response.data)
        console.log(e.response.status)
        console.log(e.response.headers)
      } else if (e.request) {
        // The request was made but no response was received
        // `e.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(e.request)
      } else {
        // Something happened in setting up the request that triggered an e
        console.log('e', e.message)
      }
      console.log(e.config)
      $nuxt.error(e)
    })
  },
  put(payload) {
    return $axios.$put(`${resource}`, payload).catch(function(e) {
      if (e.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(e.response.data)
        console.log(e.response.status)
        console.log(e.response.headers)
      } else if (e.request) {
        // The request was made but no response was received
        // `e.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(e.request)
      } else {
        // Something happened in setting up the request that triggered an e
        console.log('e', e.message)
      }
      console.log(e.config)
      $nuxt.error(e)
    })
  },
  // FIXME: backend API
  post(id, payload) {
    return $axios.$post(`${resource}/${id}`, payload).catch(function(e) {
      if (e.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(e.response.data)
        console.log(e.response.status)
        console.log(e.response.headers)
      } else if (e.request) {
        // The request was made but no response was received
        // `e.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(e.request)
      } else {
        // Something happened in setting up the request that triggered an e
        console.log('e', e.message)
      }
      console.log(e.config)
      $nuxt.error(e)
    })
  },
  delete(id) {
    return $axios.$delete(`${resource}/${id}`).catch(function(e) {
      if (e.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(e.response.data)
        console.log(e.response.status)
        console.log(e.response.headers)
      } else if (e.request) {
        // The request was made but no response was received
        // `e.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(e.request)
      } else {
        // Something happened in setting up the request that triggered an e
        console.log('e', e.message)
      }
      console.log(e.config)
      $nuxt.error(e)
    })
  },
  // FIXME: backend API
  remove(id, payload) {
    return $axios
      .$delete(`${resource}/${id}`, {
        params: payload
      })
      .catch(function(e) {
        if (e.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(e.response.data)
          console.log(e.response.status)
          console.log(e.response.headers)
        } else if (e.request) {
          // The request was made but no response was received
          // `e.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(e.request)
        } else {
          // Something happened in setting up the request that triggered an e
          console.log('e', e.message)
        }
        console.log(e.config)
        $nuxt.error(e)
      })
  }
})
