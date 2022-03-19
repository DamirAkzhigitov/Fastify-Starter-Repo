import { FastifyInstance } from 'fastify'

const getRandom = () => {
  return Math.random()
}

async function router(fastify: FastifyInstance) {
  const wsFunction = () => {
    fastify.websocketServer.clients.forEach((client: any) => {
      if (client.readyState === 1) {
        const value = getRandom()

        const payload = JSON.stringify([{ type: 'stream', value: value }])

        setInterval(() => {
          client.send(payload)
        }, Math.round(Math.random() * 300))
      }
    })
    // console.log('onRoomChanged')
    // connection.socket.send()
  }

  fastify.get('/start-stream', (req, reply) => {
    wsFunction()

    reply.send({ result: true })
  })
}

export default router
