const getUniqueID = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4()
}

const roomList = []
const users = {}

const roomListProxy = new Proxy(roomList, {
  set: (target, key, value) => {
    console.log(`${key} set to ${value}`)
    target[key] = value
    return true
  },
})

async function routes(fastify, options) {
  fastify.get(
    '/',
    { websocket: true },
    (connection /* SocketStream */, req /* FastifyRequest */) => {
      connection.id = getUniqueID()

      if (!users[connection.id])
        users[connection.id] = { userId: connection.id }

      connection.socket.on('message', (message) => {
        console.log('message: ', message.toString())
        connection.socket.send(connection.id)
      })
    }
  )

  fastify.get('/newRoom', (req, reply) => {
    const newRoom = {
      id: getUniqueID(),
    }

    roomListProxy.push(newRoom)

    reply.send(newRoom)
  })

  fastify.get('/enter', (req, reply) => {})

  fastify.get('/rooms', (req, reply) => {
    console.log(req.headers.cookie)

    reply.send(roomList)
  })
}

module.exports = routes
