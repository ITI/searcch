var qs = require('qs')
// Provide nuxt-axios instance to use same configuration across the whole project
// I've used typical CRUD method names and actions here
export default $axios => resource => ({
  index(payload) {
    return $axios.$get(`${resource}`, {
      params: payload,
      paramsSerializer: function (params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
    })
  },

  show(id) {
    return $axios.$get(`${resource}/${id}`)
  },

  create(payload) {
    return $axios.$post(`${resource}`, payload)
  },

  update(id, payload) {
    return $axios.$post(`${resource}/${id}`, payload)
  },

  put(id, payload) {
    return $axios.$put(`${resource}/${id}`, payload)
  },

  delete(id) {
    return $axios.$delete(`${resource}/${id}`)
  },

  remove(id, payload) {
    return $axios.$delete(`${resource}/${id}`, {
      params: payload
    })
  }
})
