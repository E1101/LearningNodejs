const express = require('express')

const api = require('./api')
const middleware = require('./middleware')

const port = process.env.PORT || 1337

const app = express()

// we call app.use(middleware.cors) before we call app.get() for each of our route handlers.
// This means that our middleware function, middleware.cors() will run before either of those
// route handlers have a chance to.
app.use(middleware.cors)

app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)

app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
)

if (require.main !== module) {
  module.exports = server
}
