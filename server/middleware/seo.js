import * as redirects from '../../static/301.json'

export default fromNodeMiddleware((req, res, next) => {
  const redirect = redirects.default.find(r => r.from === req.url)
  if (redirect) {
    console.log(`redirect: ${redirect.from} => ${redirect.to}`)
    res.writeHead(301, { Location: redirect.to })
    res.end()
  } else {
    next()
  }
})