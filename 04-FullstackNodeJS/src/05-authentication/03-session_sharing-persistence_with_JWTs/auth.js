// We no longer require express-session,
// and instead we require jsonwebtoken
const jwt = require('jsonwebtoken')
const passport = require('passport')
const Strategy = require('passport-local').Strategy

const autoCatch = require('./lib/auto-catch')

const jwtSecret = process.env.JWT_SECRET || 'mark it zero'
const adminPassword = process.env.ADMIN_PASSWORD || 'iamthewalrus'
const jwtOpts = { algorithm: 'HS256', expiresIn: '30d' }

// We've also removed calls to passport.serializeUser() and passport.deserializeUser()
// since we are no longer storing authentication information in the session object.
// ---
// Since we're not using the session, we don't need to use setMiddleware() anymore.
// The express-session, passport.initialize(), and passport.session() middleware can
// all be removed. We'll also be sure to remove the auth.setMiddleware() call
// from server.js. Our app is becoming much simpler.

passport.use(adminStrategy())

// when we configure our authenticate() function, we provide the option to disable using a session.
const authenticate = passport.authenticate('local', { session: false })

module.exports = {
  authenticate,
  login: autoCatch(login),
  ensureAdmin: autoCatch(ensureAdmin)
}

// this will only run if passport-local finds the user. If it does,
// this route handler will get called and information related to the
// authenticated user will be available on the req.user object.
async function login (req, res, next) {
  const token = await sign({ username: req.user.username })

  // By providing it in two places we make it easy for the client to
  // decide how it wants to use it. If the client is a browser, the
  // cookie can be handled automatically, and if the client prefers to
  // use authorization headers it's nice to provide it to them in in the body.
  res.cookie('jwt', token, { httpOnly: true })
  res.json({ success: true, token: token })
}

async function ensureAdmin (req, res, next) {
  // We give clients the option of providing the token
  // via cookies or authorization header, so we check for it in both places.
  const jwtString = req.headers.authorization || req.cookies.jwt
  const payload = await verify(jwtString)
  if (payload.username === 'admin') return next()

  const err = new Error('Unauthorized')
  err.statusCode = 401
  next(err)
}

async function sign (payload) {
  return await jwt.sign(payload, jwtSecret, jwtOpts)
}

async function verify (jwtString = '') {
  jwtString = jwtString.replace(/^Bearer /i, '')

  try {
    const payload = await jwt.verify(jwtString, jwtSecret)
    return payload
  } catch (err) {
    err.statusCode = 401
    throw err
  }
}

function adminStrategy () {
  return new Strategy(function (username, password, cb) {
    const isAdmin = username === 'admin' && password === adminPassword
    if (isAdmin) return cb(null, { username: 'admin' })

    cb(null, false)
  })
}
