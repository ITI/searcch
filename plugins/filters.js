import Vue from 'vue'

Vue.filter('titlecase', function(value) {
  if (!value) return ''
  return value.replace(
    /(\w)(\w*)/g,
    (_, firstChar, rest) => firstChar.toUpperCase() + rest.toLowerCase()
  )
})

Vue.filter('htmlbreak', function(value) {
  if (!value) return ''
  return value.replace(/(?:\r\n|\r|\n)/g, '<br>')
})
