/*
files involved:
  |
  - public/chat.html
  - public/chat.js
 */
const fs = require('fs')
const express = require('express')
// The EventEmitter class is available through the core events module
const EventEmitter = require('events')

const chatEmitter = new EventEmitter()
// chatEmitter.on('message', console.log)

const port = process.env.PORT || 1337

const app = express()

app.get('/', respondText)
app.get('/json', respondJson)
app.get('/echo', respondEcho)
app.get('/static/*', respondStatic)
// `/chat` route that will receive chat messages from a client
app.get('/chat', respondChat)
// `/sse` route that will send those messages to all connected clients.
app.get('/sse', respondSSE)

app.listen(port, () => console.log(`Server listening on port ${port}`))

// ...

function respondText (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.end('hi')
}

function respondJson (req, res) {
  res.json({ text: 'hi', numbers: [1, 2, 3] })
}

function respondEcho (req, res) {
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
  const filename = `${__dirname}/public/${req.params[0]}`
  fs.createReadStream(filename)
    .on('error', () => respondNotFound(req, res))
    .pipe(res)
}

function respondChat (req, res) {
  const { message } = req.query

  chatEmitter.emit('message', message)

  // our server will send a 200 "OK" HTTP status code by default,
  // this will act as a sufficient signal to our client that the
  // message was received and correctly handled.
  res.end()
}

function respondSSE (req, res) {
  // We establish the connection by sending a 200 OK status code,
  // appropriate HTTP headers according to the SSE specification
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  })

  // We listen for message events from our chatEmitter object,
  // and when we receive them, we write them to the response body using res.write().
  // We use res.write() instead of res.end() because we want to keep the connection open,
  // and we use the data format from the SSE specification.
  const onMessage = msg => res.write(`data: ${msg}\n\n`)
  chatEmitter.on('message', onMessage)

  // We listen for when the connection to the client has been closed,
  // and when it happens we disconnect our onMessage() function from
  // our chatEmitter object.
  // This prevents us from writing messages to a closed connection.
  res.on('close', function () {
    chatEmitter.off('message', onMessage)
  })
}

function respondNotFound (req, res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('Not Found')
}
