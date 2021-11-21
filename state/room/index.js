const roomList = []

let cachedFn = null

const onRoomChanged = (fn = null) => {
  if (!fn) {
    if (cachedFn) {
      cachedFn()
    }
    return
  }
  cachedFn = fn
}

const roomListProxy = new Proxy(roomList, {
  get(obj, prop) {
    let result,
      types = {}

    for (let product of obj) {
      if (product.id === prop) {
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

    return obj[prop]
  },
  set(obj, prop, value) {
    if (prop !== 'length') {
      /*
       * Important and interesting things done here
       */
    }
    onRoomChanged()

    console.log('roomChanged')

    return (obj[prop] = value)
  },
})

const addUserToRoom = (roomId, user) => {
  const targetRoom = roomListProxy[roomId]

  if (targetRoom) {
    if (targetRoom.members.length < targetRoom.max) {
      const isAlreadyInRoom = targetRoom.members.find(
        (member) => member === user
      )

      if (isAlreadyInRoom) {
        return { error: true, text: 'User already in room' }
      } else {
        console.log('push user: ', user)

        targetRoom.members.push(user)

        onRoomChanged()

        return { error: false, text: 'Done' }
      }
    }
    return { error: true, text: 'Room is full' }
  }
  return { error: true, text: 'Room not found' }
}

const addNewRoom = (id) => {
  const numberOfRooms = roomListProxy.length

  const newRoom = { id, members: [], max: 6, name: `MyRoom${numberOfRooms}` }

  roomListProxy.push(newRoom)

  return newRoom
}

module.exports = { roomListProxy, addUserToRoom, addNewRoom, onRoomChanged }
