const redirects = require('../static/301.json')
module.exports = function(req, res, next) {
  const redirect = redirects.find(r => r.from === req.url)
  if (redirect) {
    console.log(`redirect: ${redirect.from} => ${redirect.to}`)
    res.writeHead(301, { Location: redirect.to })
    res.end()
  } else {
    next()
  }
}
