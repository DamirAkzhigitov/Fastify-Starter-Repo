import { CallbackFunctionVariadic, RoomItem, UserItem } from 'src/models'

const roomList: RoomItem[] = []
const users: UserItem[] = []

let cachedFn: CallbackFunctionVariadic | null = null

const getUserList = () => {
  return users
}

const setUserToList = (user: UserItem) => {
  users.push(user)
}

const onRoomChanged = (fn: CallbackFunctionVariadic | null) => {
  // console.log('onRoomChanged:  fn = ', fn)
  if (!fn) {
    // console.log('without fn')
    if (cachedFn) {
      // console.log('cachedFn:', cachedFn)
      // console.log('run cached fn')
      cachedFn()
    }
    return
  }
  // console.log('set cached fn ')
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
      // console.log('prop: ', prop)
      /*
       * Important and interesting things done here
       */
    }
    onRoomChanged(null)

    return (obj[prop] = value)
  },
})

const addUserToRoom = (roomId: string, userId: string) => {
  const targetRoom: RoomItem = roomListProxy[roomId]

  // console.log('targetRoom:', targetRoom)
  //
  // console.log('list users: ', users)

  const user = users.find((userItem) => userItem.id === userId)

  if (!user) {
    console.info('addUserToRoom, cant find user')
  }

  // console.log('user:', user)

  if (targetRoom && user) {
    if (targetRoom.members.length < targetRoom.max) {
      const isAlreadyInRoom = targetRoom.members.find(
        (member) => member.id === userId
      )

      if (isAlreadyInRoom || !!user.roomId) {
        return { error: true, text: 'User already in room' }
      } else {
        const isCreator = targetRoom.members.length === 0

        targetRoom.members.push({ id: userId, creator: isCreator, vip: false })

        user.roomId = roomId

        onRoomChanged(null)

        return { error: false, text: 'Done' }
      }
    }
    return { error: true, text: 'Room is full' }
  }
  return { error: true, text: 'Room not found' }
}

const addNewRoom = (id: string) => {
  const numberOfRooms = roomListProxy.length

  // console.log('numberOfRooms: ', numberOfRooms)

  const newRoom: RoomItem = {
    id,
    members: [],
    max: 6,
    name: `MyRoom${numberOfRooms}`,
  }

  // console.log('newRoom: ', newRoom)

  roomListProxy.push(newRoom)

  // console.log('roomListProxy after: ', roomListProxy)

  return newRoom
}

export {
  roomListProxy,
  users,
  addUserToRoom,
  addNewRoom,
  onRoomChanged,
  getUserList,
  setUserToList,
}
