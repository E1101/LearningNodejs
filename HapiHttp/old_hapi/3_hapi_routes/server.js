const Hapi = require('hapi');
const good = require('good');


const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: process.argv[2] || 8000,
});


// routes
const routes = {};
routes.todo = require('./routes/todo');

// Add the route
server.route({
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    return reply({ message: 'hello, world' });
  }
});

// load other routes
server.route(routes.todo);


// set up logging
const options = {
  ops: {
    interval: 100000,
  },
  reporters: {
    consoleReporters: [
      { module: 'good-console' },
      'stdout',
    ],
  },
};

server.register({
  register: good,
  options,
}, (err) => {
  if (err) return console.error(err);

  // Start the server
  server.start((err) => {
    if (err) throw err;
    console.log(`Server running at: ${server.info.uri}`);
  });
});
