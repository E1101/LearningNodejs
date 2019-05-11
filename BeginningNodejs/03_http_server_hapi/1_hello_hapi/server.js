const Hapi  = require('hapi');


const server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: process.argv[2] || 8000,  // $ node server.js <port-number>
});

// Add the route
server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        // we can reply by simple string
        // reply('hello, world');

        // or response json
        return reply({ message: 'hello, world' });
    }
});

// Start the server
server.start((err) => {
    if (err)
        throw err;

    // we have access to some server information like:
    // - host, port, created at, started at.
    console.log(`Server running at: ${server.info.uri}`);
});
