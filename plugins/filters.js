export default defineNuxtPlugin(() => {
  return {
    provide: {
      filters: {
        titlecase: function(value) {
          if (!value) return ''
          return value.replace(
            /(\w)(\w*)/g,
            (_, firstChar, rest) => firstChar.toUpperCase() + rest.toLowerCase()
          )
        },
        htmlbreak: function(value) {
          if (!value) return ''
          return value.replace(/(?:\r\n|\r|\n)/g, '<br>')
        },
      }
    }
  }
});