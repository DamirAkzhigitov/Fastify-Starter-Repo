'use strict'
// Require the framework and instantiate it
const Fastify = require('fastify')
const mainRoute = require('./routes/index')

const fastify = Fastify({ logger: true })

if (fastify.websocketServer === undefined) {
  fastify.register(require('fastify-websocket'), {
    options: {
      maxPayload: 1048576,
    },
  })
}
fastify.register(require('fastify-cors'), {
  origin: ['http://localhost:3000'],
  credentials: true,
})
// Declare a route
fastify.register(mainRoute)
// Run the server!
const start = async () => {
  try {
    await fastify.listen(8080)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
