const {
  roomListProxy,
  addUserToRoom,
  addNewRoom,
  onRoomChanged,
} = require('../state/room/index')
const { getUser, getUniqueID } = require('../utils/helpers')
const createError = require('http-errors')

const userDontProvided = createError(500, 'User id not set')

const users = {}

async function routes(fastify, options) {
  onRoomChanged(() => {
    fastify.websocketServer.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(roomListProxy))
      }
    })
    console.log('onRoomChanged')
    // connection.socket.send()
  })

  fastify.get('/', { websocket: true }, (connection) => {})

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

    if (!user) {
      reply.send(userDontProvided)

      return
    }

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
