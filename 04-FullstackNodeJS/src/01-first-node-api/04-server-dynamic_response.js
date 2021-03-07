const http = require('http')
const querystring = require('querystring')

const port = process.env.PORT || 1337

const server = http.createServer(function (req, res) {
  if (req.url === '/') return respondText(req, res)
  if (req.url === '/json') return respondJson(req, res)
  if (req.url.match(/^\/echo/)) return respondEcho(req, res)

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

// will accept the request and response objects.
function respondEcho (req, res) {
  // we first need to use require() to load the `querystring` core module.
  // ---
  // querystring.parse() will return a simple JavaScript object
  // with query param key and value pairs.
  // Currently, we're only interested in the input key, so that's the only
  // value that we'll store. If the client doesn't provide an input parameter,
  // we'll set a default value of ''.
  // like: `/echo?input=someinput`
  const { input = '' } = querystring.parse(req.url
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

function respondNotFound (req, res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('Not Found')
}
