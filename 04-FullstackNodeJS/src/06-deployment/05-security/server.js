const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const api = require('./api')
const auth = require('./auth')
const middleware = require('./middleware')

const port = process.env.PORT || 1337

const app = express()

// We gain no advantage by telling the world that we're running on express.
// It's nice to give some publicity to projects we like, but from a security
// point of view, it's not a good idea.
// ---
// Another name for this is Internal Implementation Disclosure.
app.disable('x-powered-by')

//  if we were to get this url:
//
// http://localhost:1337/products?tag=dog&tag=cat
//
// req.query.tag is now equal to [ 'dog', 'cat' ]. Instead of getting a string, we get an array.
// Sometimes this can be helpful, but if our route handler and model aren't prepared, this can lead to errors or security problems.
//
// If we wanted to ensure that parameters can't be coerced into arrays, we could use the `hpp` middleware module.

app.use(middleware.logger)
app.use(middleware.cors)
app.use(bodyParser.json())
app.use(cookieParser())

app.get('/health', api.checkHealth)

app.post('/login', auth.authenticate, auth.login)
app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)
app.post('/products', auth.ensureUser, api.createProduct)
app.put('/products/:id', auth.ensureUser, api.editProduct)
app.delete('/products/:id', auth.ensureUser, api.deleteProduct)

app.get('/orders', auth.ensureUser, api.listOrders)
app.post('/orders', auth.ensureUser, api.createOrder)

app.post('/users', api.createUser)

app.use(middleware.handleValidationError)
app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
)

if (require.main !== module) {
  module.exports = server
}
