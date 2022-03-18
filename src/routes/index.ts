import { FastifyInstance } from 'fastify'
import {
  roomListProxy,
  getUserList,
  setUserToList,
  addUserToRoom,
  addNewRoom,
  onRoomChanged,
} from '../state/room'
import { getUser, getUniqueID } from '../utils/helpers'
import CreateError from 'http-errors'

const userDidNotProvided = CreateError(500, 'User id not set')

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
    const id: string = getUser(req.headers) || getUniqueID()
    const storedUser = getUserList().find((user) => user.id === id)

    if (!storedUser) {
      setUserToList({
        id,
        roomId: null,
      })
    }

    reply.send(id)
  })

  fastify.get('/newRoom', (req, reply) => {
    const newRoom = addNewRoom(getUniqueID())

    reply.send(newRoom)
  })

  const options = {}

  fastify.post('/enter', options, (req, reply) => {
    const getUserId = getUser(req.headers)

    const room = req.body as { id: string }

    if (!getUserId) {
      reply.send(userDidNotProvided)

      return
    }

    console.log('room: ', room)
    console.log('user id: ', getUserId)
    const result = addUserToRoom(room.id, getUserId)

    if (result.error) {
      reply.send(result)
      return
    }

    reply.send(result)
    // }
    return
  })

  fastify.get('/rooms', (req, reply) => {
    reply.send(roomListProxy)
  })
}

export default routes
