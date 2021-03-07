const http = require('http')
const readline = require('readline')
const querystring = require('querystring')

const rl = readline.createInterface({ input: process.stdin })

rl.on('line', line => {
  http.get(
    `http://localhost:1337/chat?${querystring.stringify({ message: line })}`
  )
})

http.get('http://localhost:1337/sse', res => {
  // You'll notice that we call data.toString() to log our chat messages.
  // If we don't do that, we would see the raw bytes in hex.
  // For efficiency, Node.js often defaults to a data type called Buffer.
  res.on('data', data => console.log(data.toString()))
})
