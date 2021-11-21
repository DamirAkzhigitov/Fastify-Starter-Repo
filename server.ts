'use strict'
// Require the framework and instantiate it
import Fastify from 'fastify'
import FastifyCors from 'fastify-cors'
import FastifyWebsockets from 'fastify-websocket'

import mainRoute from './src/routes/index'
import gameRoute from './src/routes/Game/index'

const fastify = Fastify({ logger: true })

if (fastify.websocketServer === undefined) {
  fastify.register(FastifyWebsockets, {
    options: {
      maxPayload: 1048576,
    },
  })
}
fastify.register(FastifyCors, {
  origin: ['http://localhost:3000', 'http://192.168.1.68:3000'],
  credentials: true,
})
// Declare a route
fastify.register(mainRoute)
fastify.register(gameRoute)
// Run the server!
const start = async () => {
  try {
    await fastify.listen(8080, '192.168.1.68')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
