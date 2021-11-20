async function routes(fastify, options) {
  fastify.get(
    '/',
    { websocket: true },
    (connection /* SocketStream */, req /* FastifyRequest */) => {
      connection.socket.on('message', (message) => {
        console.log('message: ', message.toString())
        // message.toString() === 'hi from client'
        connection.socket.send('hi from server')
      })
    }
  )
}

module.exports = routes
