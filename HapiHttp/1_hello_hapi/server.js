'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {

    // Initialize server with connection detail
    // you can provide a hostname, IP address, a Unix socket file,
    // or Windows named pipe to bind the server to.
    const server = Hapi.server({
        host: 'localhost',
        port: process.argv[2] || 8000,  // $ node server.js <port-number>
    });

    server.route({
        method: 'GET',
        path:'/',
        handler: (request, h) => {
            return 'Hello World!';
        }
    });

    await server.start();
    console.log('Server running on %ss', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();