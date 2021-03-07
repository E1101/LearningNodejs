const http = require('http')

const port = process.env.PORT || 1337

const server = http.createServer(function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  // Json string representing the given object
  res.end(JSON.stringify({ text: 'hi', numbers: [1, 2, 3] }))
})

server.listen(port)
console.log(`Server listening on port ${port}`)
