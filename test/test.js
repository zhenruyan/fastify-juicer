// Require the framework and instantiate it
const fastify = require('fastify')()
fastify.register(require('../app'));
// Declare a route
fastify.get('/', function (request, reply) {
  reply.view("test",{"a":"bbbbbbb"})
})
// Run the server!
fastify.listen(3000,function () {
  console.log(`server`)
})