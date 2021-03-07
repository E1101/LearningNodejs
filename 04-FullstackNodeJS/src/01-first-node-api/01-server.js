// http is a core module, which means that it is always
// available to be loaded via require().
const http = require('http')

// If you're wondering how we can access process without using
// require() it's because process is a global object with information
// about the currently running process.
// ---
// If we were to run the server with `PORT=3000 node 01-passport-server.js` instead,
// process.env.PORT would be set to 3000.
const port = process.env.PORT || 1337

const server = http.createServer(function (req, res) {
  // We can both send the string and end the connection
  // to the browser with a single method call
  res.end('hi')
})

server.listen(port)

// Finally, for convenience, we print a message telling us
// that our server is running and which port it's listening on
console.log(`Server listening on port ${port}`)
