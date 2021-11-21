import { CallbackFunctionVariadic, RoomItem } from 'src/models'

const roomList: RoomItem[] = [
  {
    id: '0',
    members: [],
    max: 6,
    name: `MyRoom0`,
  },
]

let cachedFn: CallbackFunctionVariadic | null = null

const onRoomChanged = (fn: CallbackFunctionVariadic | null) => {
  if (!fn) {
    if (cachedFn) {
      cachedFn()
    }
    return
  }
  cachedFn = fn
}

const roomListProxy = new Proxy(roomList, {
  get(target, key: string) {
    let result
    const types: { [key: string]: RoomItem[] } = {}

    for (const product of target) {
      if (product.id === key) {
        result = product
      }
      if (types[product.id]) {
        types[product.id].push(product)
      } else {
        types[product.id] = [product]
      }
    }

    if (result) {
      return result
    }

    return target[key]
  },
  set(obj, prop, value) {
    if (prop !== 'length') {
      /*
       * Important and interesting things done here
       */
    }
    onRoomChanged(null)

    console.log('roomChanged')

    return (obj[prop] = value)
  },
})

const addUserToRoom = (roomId: string, user: string) => {
  const targetRoom: RoomItem = roomListProxy[roomId]

  if (targetRoom) {
    if (targetRoom.members.length < targetRoom.max) {
      const isAlreadyInRoom = targetRoom.members.find(
        (member) => member.id === user
      )

      if (isAlreadyInRoom) {
        return { error: true, text: 'User already in room' }
      } else {
        const isCreator = targetRoom.members.length === 0

        targetRoom.members.push({ id: user, creator: isCreator, vip: false })

        onRoomChanged(null)

        return { error: false, text: 'Done' }
      }
    }
    return { error: true, text: 'Room is full' }
  }
  return { error: true, text: 'Room not found' }
}

const addNewRoom = (id: string) => {
  console.log('roomListProxy: ', roomListProxy)

  const numberOfRooms = roomListProxy.length

  console.log('numberOfRooms: ', numberOfRooms)

  const newRoom: RoomItem = {
    id,
    members: [],
    max: 6,
    name: `MyRoom${numberOfRooms}`,
  }

  console.log('newRoom: ', newRoom)

  roomListProxy.push(newRoom)

  return newRoom
}

export { roomListProxy, addUserToRoom, addNewRoom, onRoomChanged }
