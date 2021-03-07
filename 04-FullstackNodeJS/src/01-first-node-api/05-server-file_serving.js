// One of the most common uses of a web server is to serve html and other static files.
// Let's take a look at how we can serve up a directory of files with Node.js.
const fs = require('fs')
const http = require('http')
const querystring = require('querystring')

const port = process.env.PORT || 1337

const server = http.createServer(function (req, res) {
  if (req.url === '/') return respondText(req, res)
  if (req.url === '/json') return respondJson(req, res)
  if (req.url.match(/^\/echo/)) return respondEcho(req, res)
  // checks for paths that begin with /static and calls respondStatic()
  if (req.url.match(/^\/static/)) return respondStatic(req, res)

  respondNotFound(req, res)
})

server.listen(port)
console.log(`Server listening on port ${port}`)

function respondText (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.end('hi')
}

function respondJson (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ text: 'hi', numbers: [1, 2, 3] }))
}

function respondEcho (req, res) {
  const { input = '' } = querystring.parse(
    req.url
      .split('?')
      .slice(1)
      .join('')
  )

  res.setHeader('Content-Type', 'application/json')
  res.end(
    JSON.stringify({
      normal: input,
      shouty: input.toUpperCase(),
      characterCount: input.length,
      backwards: input
        .split('')
        .reverse()
        .join('')
    })
  )
}

function respondStatic (req, res) {
  // anything after `/static/` we interpret as a file name that we pass to `fs.createReadStream()`.
  const filename = `${__dirname}/public${req.url.split('/static')[1]}`
  fs.createReadStream(filename)
    .on('error', () => respondNotFound(req, res))
    .pipe(res)
}

function respondNotFound (req, res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('Not Found')
}
