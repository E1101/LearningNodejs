const express = require('express')
const passport = require('passport')
const Strategy = require('passport-local').Strategy
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')

const api = require('./api')
const middleware = require('./middleware')

const port = process.env.PORT || 1337

// which secret we'll use to sign our session cookies
// and what our admin password will be
const sessionSecret = process.env.SESSION_SECRET || 'mark it zero'
const adminPassword = process.env.ADMIN_PASSWORD || 'iamthewalrus'

// we configure passport to use our `passport-local` strategy
// ---
// we can use many different passport strategies to modify how
// we authenticate users. Depending on the strategy, configuration
// will be a little different. Ultimately, the purpose of a strategy
// is to take some input (e.g. a username and password) and if valid,
// return a user object.
passport.use(
  new Strategy(function (username, password, cb) {
    const isAdmin = (username === 'admin') && (password === adminPassword)
    if (isAdmin) cb(null, { username: 'admin' })

    cb(null, false)
  })
)

// we need to provide passport methods for serializing the user object to and
// deserializing the user object from session storage. Since we're keeping things simple,
// we'll store the user object in our session as is, and therefore our serialize/deserialize
// methods will both be identity functions.
// ---
// If we kept a lot of user details in the database, we may just want to store the username
// string when we serialize, and do a database lookup to get the latest, full data when deserializing.
passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((user, cb) => cb(null, user))

const app = express()

app.use(middleware.cors)
app.use(bodyParser.json())

// express won't automatically parse cookies,
// nor will it maintain a session store for us.
app.use(cookieParser())
app.use(
  expressSession({
    secret: sessionSecret,
    // set resave and saveUninitialized to false as both
    // are recommended by express-session documentation.
    resave: false,
    saveUninitialized: false
  })
)

app.use(passport.initialize())
app.use(passport.session())

// Here's how we have passport handle the login
// ---
// when defining route handlers, we can also use
// middleware specific to that route.
// ---
// passport.authenticate() method will act as a
// filter or gatekeeper. Only if authentication
// is successful will we respond with success.
app.post('/login',
    passport.authenticate('local'),
    (req, res) => res.json({ success: true })
)

app.get('/products', api.listProducts)
app.get('/products/:id', api.getProduct)

// If a user has used the login route successfully, they would have been
// given a signed cookie with their session ID. Any subsequent requests will
// send that cookie to the server allowing route handlers to see that user object.
// This means that we can create our own middleware that looks for that
// user object, before allowing a route handler to run.
app.post('/products', ensureAdmin, api.createProduct)
app.put('/products/:id', ensureAdmin, api.editProduct)
app.delete('/products/:id', ensureAdmin, api.deleteProduct)
app.get('/orders', ensureAdmin, api.listOrders)
app.post('/orders', ensureAdmin, api.createOrder)

app.use(middleware.handleValidationError)
app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
)

function ensureAdmin (req, res, next) {
  // req.user is available to us thanks to passport and express-session.
  // If the user has previously authenticated, we'll be able to access
  // their user object here.
  const isAdmin = req.user && req.user.username === 'admin'
  if (isAdmin) return next()

  res.status(401).json({ error: 'Unauthorized' })
}

if (require.main !== module) {
  module.exports = server
}
