// To clean things up we created a new module `auth.js`
// to house our authentication and authorization related logic.
const passport = require('passport')
const Strategy = require('passport-local').Strategy
const expressSession = require('express-session')

const sessionSecret = process.env.SESSION_SECRET || 'mark it zero'
const adminPassword = process.env.ADMIN_PASSWORD || 'iamthewalrus'

passport.use(adminStrategy())
passport.serializeUser((user, cb) => cb(null, user))
passport.deserializeUser((user, cb) => cb(null, user))
const authenticate = passport.authenticate('local')

module.exports = {
  setMiddleware,
  authenticate,
  login,
  ensureAdmin
}

function setMiddleware (app) {
  app.use(session())
  app.use(passport.initialize())
  app.use(passport.session())
}

function login (req, res, next) {
  res.json({ success: true })
}

// We're now going to rely on the built-in error handling of express by using next()
// to pass the error to middleware. By setting the statusCode property of the error,
// our error-handling middleware can send the appropriate response to the client
// @see middleware.js ::handleError
function ensureAdmin (req, res, next) {
  const isAdmin = req.user && req.user.username === 'admin'
  if (isAdmin) return next()

  const err = new Error('Unauthorized')
  err.statusCode = 401
  next(err)
}

function adminStrategy () {
  return new Strategy(function (username, password, cb) {
    const isAdmin = username === 'admin' && password === adminPassword
    if (isAdmin) return cb(null, { username: 'admin' })

    cb(null, false)
  })
}

function session () {
  return expressSession({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false
  })
}
