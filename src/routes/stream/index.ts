import { FastifyInstance } from 'fastify'

async function router(fastify: FastifyInstance) {
  fastify.get('/start-stream', (req, reply) => {
    reply.send({ result: true })
  })
}

export default router
