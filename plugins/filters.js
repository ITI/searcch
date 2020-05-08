import Vue from 'vue'

Vue.filter('titlecase', function(value) {
  if (!value) return ''
  return value.replace(
    /(\w)(\w*)/g,
    (_, firstChar, rest) => firstChar + rest.toLowerCase()
  )
})
