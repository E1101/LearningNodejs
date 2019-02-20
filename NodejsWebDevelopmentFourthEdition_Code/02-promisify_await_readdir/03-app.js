/*
 * A question to ponder is why this script did not exit?!
 *
 * The reason is the presence of active event listeners.
 * Node.js always starts up an event loop, the listen function creates an event
 * listener that implements the HTTP protocol. This event listener keeps program
 * running until you do something such as typing Ctrl + C in the Terminal window.
 */
const http = require('http');

http.createServer(function (req, res)
{
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello, World!\n');

}).listen(8124, '127.0.0.1');

console.log('Server running at http://127.0.0.1:8124');
