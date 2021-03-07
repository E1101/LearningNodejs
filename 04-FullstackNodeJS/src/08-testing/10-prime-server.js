const URL = require('url')
const http = require('http')

const isPrime = require('./04-is-prime-sqrt')
const findPrimes = require('./05-find-primes-sync')

// if we run the server script from the command line (e.g. node 10-prime-server.js),
// the server will start up and listen on a port like usual. However, if we
// require('./10-prime-server') from another file, the server will not automatically start up.
if (require.main === module) {
  const port = process.env.PORT || 1337
  http.createServer(onRequest).listen(port)
  console.log(`Prime Server listening on port ${port}`)
}

// We export a function that creates and returns a server instance,
// but this instance does not listen for requests.
module.exports = () => http.createServer(onRequest)

function onRequest (req, res) {
  const opts = URL.parse(req.url, true)

  const handlers = {
    '/is-prime': handleIsPrime,
    '/find-primes': handleFindPrimes
  }

  const handler = handlers[opts.pathname] || handleNotFound
  handler(req, res, opts)
}

function handleIsPrime (req, res, opts) {
  const n = parseFloat(opts.query.n)

  if (!isFinite(n)) return sendJSON(res, 400, { error: 'Bad Request' })

  sendJSON(res, 200, isPrime(n))
}

function handleFindPrimes (req, res, opts) {
  const nStart = parseFloat(opts.query.nStart)
  const count = parseFloat(opts.query.count)

  if (!isFinite(nStart) || !isFinite(count)) {
    return sendJSON(res, 400, { error: 'Bad Request' })
  }

  sendJSON(res, 200, findPrimes(nStart, count))
}

function handleNotFound (req, res, opts) {
  sendJSON(res, 404, { error: 'Not Found' })
}

function sendJSON (res, status, message) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(message))
}
