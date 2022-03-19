'use strict'
// Require the framework and instantiate it
import Fastify from 'fastify'
import FastifyCors from 'fastify-cors'
import FastifyWebsockets from 'fastify-websocket'

import mainRoute from './src/routes/index'
import steamRoute from './src/routes/stream/index'

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
fastify.register(steamRoute)
// Run the server!
const start = async () => {
  try {
    await fastify.listen(8080, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
