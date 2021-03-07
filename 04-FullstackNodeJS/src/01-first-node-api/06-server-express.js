const fs = require('fs')
// To install express, all we need to do is to run npm install express from
// our application directory. npm will go fetch express from its repository
// and place the express module in a folder called `node_modules` in your current directory.
// ---
// Node.js will also look in other places for modules such as parent directories and
// the global npm installation directory.
const express = require('express')

const port = process.env.PORT || 1337

const app = express()

// Leverage express router
// --
// Under the covers, express is using core http.
// This means that if you understand core http,
// For example, we don't need to change our respondText() function at all
app.get('/', respondText)
app.get('/json', respondJson)
app.get('/echo', respondEcho)
// express routing is that we can add regex wildcards like * to our routes
// our server will call respondStatic() for any path that begins with `/static/`
app.get('/static/*', respondStatic)

app.listen(port, () => console.log(`Server listening on port ${port}`))

// ...

function respondText (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.end('hi')
}

function respondJson (req, res) {
  // By calling `res.json()`, express will automatically send the correct
  // `Content-Type` header and stringify our response body for us.
  res.json({ text: 'hi', numbers: [1, 2, 3] })
}

function respondEcho (req, res) {
  // express will automatically parse search query parameters (e.g. ?input=hi)
  // and make them available for us as an object.
  const { input = '' } = req.query

  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    characterCount: input.length,
    backwards: input
      .split('')
      .reverse()
      .join('')
  })
}

function respondStatic (req, res) {
  // In our `/static/*` route, the star will match anything that comes after `/static/`.
  // That match will be available for us at req.params[0].
  const filename = `${__dirname}/public/${req.params[0]}`
  fs.createReadStream(filename)
    .on('error', () => respondNotFound(req, res))
    .pipe(res)
}

function respondNotFound (req, res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('Not Found')
}
