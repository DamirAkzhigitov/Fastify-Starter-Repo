import { FastifyInstance } from 'fastify'
import { roomListProxy } from '../../state/room'

async function gameRoute(fastify: FastifyInstance) {
  fastify.get('/game', (req, reply) => {
    reply.send(roomListProxy)
  })
}

export default gameRoute
