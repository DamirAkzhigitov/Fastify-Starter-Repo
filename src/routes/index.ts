import { FastifyInstance } from 'fastify'
import {
  roomListProxy,
  addUserToRoom,
  addNewRoom,
  onRoomChanged,
} from '../state/room'
import { getUser, getUniqueID } from '../utils/helpers'
import CreateError from 'http-errors'

const userDidNotProvided = CreateError(500, 'User id not set')

const users = []

async function routes(fastify: FastifyInstance) {
  onRoomChanged(() => {
    fastify.websocketServer.clients.forEach((client: any) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(roomListProxy))
      }
    })
    console.log('onRoomChanged')
    // connection.socket.send()
  })

  fastify.get('/', { websocket: true }, () => {
    //
  })

  fastify.get('/auth', (req, reply) => {
    const id = getUniqueID()

    users.push({
      id,
    })

    reply.send(id)
  })

  fastify.get('/newRoom', (req, reply) => {
    const newRoom = addNewRoom(getUniqueID())

    reply.send(newRoom)
  })

  const options = {}

  fastify.post('/enter', options, (req, reply) => {
    const user = getUser(req.headers.cookie)

    if (!user) {
      reply.send(userDidNotProvided)

      return
    }

    if (typeof req.body === 'string') {
      const room = req.body ? JSON.parse(req.body) : null

      console.log('room: ', room)

      const result = addUserToRoom(room.id, user)

      if (result.error) {
        reply.send(result)
        return
      }

      reply.send(result)
    }
    return
  })

  fastify.get('/rooms', (req, reply) => {
    reply.send(roomListProxy)
  })
}

export default routes
