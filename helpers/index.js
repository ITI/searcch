export const artifactIcon = type => {
  switch (type) {
    case 'publication':
      return 'mdi-newspaper-variant-outline'
    case 'dataset':
      return 'mdi-database'
    case 'code':
      return 'mdi-code-braces'
    default:
      return 'mdi-help'
  }
}

export const artifactColor = type => {
  switch (type) {
    case 'publication':
      return 'info'
    case 'dataset':
      return 'green white--text'
    case 'code':
      return 'purple white--text'
    default:
      return 'info'
  }
}

export const bytesToSize = bytes => {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes == 0) return '0 Bytes'
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

export const convertArrayToObject = (array, key) => {
  const initialValue = {}
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item
    }
  }, initialValue)
}

export const zipArray = (tag, input) => {
  let zip = [[tag]]
  input.map(e => zip.push([e]))
  const mapWith = keys => values =>
      Object.fromEntries(keys.map((k, i) => [k, values[i]])),
    getArray = ([keys, ...zip]) => zip.map(mapWith(keys)),
    array = getArray(zip)
  return array
}
