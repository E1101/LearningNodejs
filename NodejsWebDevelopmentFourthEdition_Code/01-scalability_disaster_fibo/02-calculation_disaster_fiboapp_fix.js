/* -----------------------------------------------------------------------------------------
 * A simple rewrite dispatches the computations through the event loop, letting the server
 * continue to handle requests on the event loop. Using callbacks and closures
 * (anonymous functions), we're able to maintain asynchronous I/O and concurrency promises.
 *
 */

var http = require('http');
var url  = require('url');

const fibonacciAsync = function(n, done)
{
    if (n === 0) return 0;
    else if (n === 1 || n === 2) done(1);
    else if (n === 3) return 2;
    else {
        process.nextTick(function()
        {
            fibonacciAsync(n-1, function(val1) {
                process.nextTick(function() {
                    fibonacciAsync(n-2, function(val2) {
                        done(val1+val2);
                    });
                });
            });
        });
    }
};

http.createServer(function (req, res)
{
  var urlP = url.parse(req.url, true);

  res.writeHead(200, {'Content-Type': 'text/plain'});
  if (urlP.query['n'])
  {
    fibonacciAsync(urlP.query['n'], fibo => {
        res.end('Fibonacci '+ urlP.query['n'] +'='+ fibo);
    });
  }
  else
  {
    res.end('USAGE: http://127.0.0.1:8124?n=## where ## is the Fibonacci number desired');
  }
}).listen(8124, '127.0.0.1');

console.log('Server running at http://127.0.0.1:8124');
