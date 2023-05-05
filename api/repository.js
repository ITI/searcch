import * as qs from 'qs'
// Provide nuxt-axios instance to use same configuration across the whole project
// I've used typical CRUD method names and actions here
export default $fetch => (resource, error) => ({
  index(payload) {
    return $fetch(`/${resource}`, {
      params: payload,
      method: 'GET',
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    })
      .catch(function (e) {
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
        createError(e)
      })
  },

  show(id, params = null) {
    var rparams = {}
    if (params) {
      rparams = {
        params: params,
        paramsSerializer: function (params) {
          return qs.stringify(params, { arrayFormat: 'repeat' })
        }
      }
    }
    console.log('show: ', resource)
    return $fetch(`/${resource}/${Array.isArray(id) ? id.join('/') : id}`, {
      method: 'GET',
      ...rparams
    }).catch(function (e) {
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
      createError(e)
    })
  },

  create(data) {
    return $fetch(`/${resource}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }).catch(function (e) {
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
      createError(e)
    })
  },

  update(id, data) {
    return $fetch(`/${resource}/${Array.isArray(id) ? id.join('/') : id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }).catch(function (e) {
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
      createError(e)
    })
  },

  put(data, ...args) {
    let complete_path = [resource, ...args].join('/');
    return $fetch(`/${complete_path}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }).catch(function (e) {
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
      createError(e)
    })
  },
  // FIXME: backend API
  post(id, data) {
    return $fetch(`/${resource}/${Array.isArray(id) ? id.join('/') : id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }).catch(function (e) {
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
      createError(e)
    })
  },
  delete(id) {
    return $fetch(`/${resource}/${Array.isArray(id) ? id.join('/') : id}`, {
      method: 'DELETE',
    }).catch(function (e) {
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
      createError(e)
    })
  },
  // FIXME: backend API
  remove(id, params) {
    return $fetch(`/${resource}/${id}`, {
      method: 'DELETE',
      params
    })
      .catch(function (e) {
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
        createError(e)
      })
  }
})
