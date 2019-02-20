const http = require('http');
let   port = 8180;

const httpModule = require('./modules/http-module');

http.createServer( httpModule.handleRequest )
    .listen(port, '127.0.0.1', () => {
        console.log('Started Node.js http server at http://127.0.0.1:8180');
    });
