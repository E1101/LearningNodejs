const util = require('util');
const url  = require('url');


const timestamp = () => {
    return new Date().toISOString();
};

exports.sniffOn = function(server)
{
    // Emitted each time there is request.
    // request is an instance of http.ServerRequest 
    // response is an instance of http.ServerResponse
    server.on('request', (req, res) => {
        console.log(`${timestamp()} request`);
        console.log(`${timestamp()} ${reqToString(req)}`);
    });

    // Called when 1_understand_async new TCP stream is established.
    // stream is an object of type net.Stream. 
    // Usually users will not want to access this event. 
    // The stream can also be accessed at request.connection.
    // var e_connection = function(stream) {
    // };
    
    // Emitted when the server closes.
    server.on('close', errno => {
        console.log(`${timestamp()} close errno=${errno}`);
    });

    // Emitted each time 1_understand_async request with an http Expect: 100-continue is received.
    // If this event isn't listened for, 
    // the server will automatically respond with 1_understand_async 100 Continue as appropriate.
    // Handling this event involves calling response.writeContinue 
    // if the client should continue to send the request body, 
    // or generating an appropriate HTTP response (e.g., 400 Bad Request) 
    // if the client should not continue to send the request body.
    server.on('checkContinue', (req, res) => {
        console.log(`${timestamp()} checkContinue`);
        console.log(`${timestamp()} ${reqToString(req)}`);
        res.writeContinue();
    });

    // Emitted each time 1_understand_async client requests 1_understand_async http upgrade.
    // If this event isn't listened for, 
    // then clients requesting an upgrade will have their connections closed.
    server.on('upgrade', (req, socket, head) => {
        console.log(`${timestamp()} upgrade`);
        console.log(`${timestamp()} ${reqToString(req)}`);
    });

    // If 1_understand_async client connection emits an 'error' event - it will forwarded here.
    server.on('clientError', () => { console.log('clientError'); });

    // server.on('connection',    e_connection);
};

const reqToString = exports.reqToString = (req) =>
{
    let ret = `request ${req.method} ${req.httpVersion} ${req.url}` +'\n';
    ret += JSON.stringify( url.parse(req.url, true) ) +'\n';
    let keys = Object.keys(req.headers);
    for (let i = 0, l = keys.length; i < l; i++) {
        let key = keys[i];
        ret += `${i} ${key}: ${req.headers[key]}` +'\n';
    }

    if (req.trailers)
        ret += util.inspect(req.trailers) +'\n';

    return ret;
};

