const {
  roomListProxy,
  addUserToRoom,
  addNewRoom,
  onRoomChanged,
} = require('../state/room/index')
const { getUser, getUniqueID } = require('../utils/helpers')

const users = {}

async function routes(fastify, options) {
  fastify.get('/', { websocket: true }, (connection) => {
    onRoomChanged(() => {
      console.log('onRoomChanged')
      connection.socket.send(JSON.stringify(roomListProxy))
    })
  })

  fastify.get('/auth', (req, reply) => {
    const id = getUniqueID()

    if (!users[id]) users[id] = { userId: id }

    reply.send(id)
  })

  fastify.get('/newRoom', (req, reply) => {
    const newRoom = addNewRoom(getUniqueID())

    reply.send(newRoom)
  })

  fastify.post('/enter', (req, reply) => {
    const user = getUser(req.headers.cookie)

    const room = JSON.parse(req.body)

    const result = addUserToRoom(room.id, user)

    if (result.error) {
      reply.send(result)
      return
    }

    return reply.send(result)
  })

  fastify.get('/rooms', (req, reply) => {
    reply.send(roomListProxy)
  })
}

module.exports = routes
