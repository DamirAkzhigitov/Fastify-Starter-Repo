export interface RoomMember {
  id: string
  creator: boolean
  vip: boolean
}

export interface RoomItem {
  [key: string]: string | RoomMember[] | number
  id: string
  members: RoomMember[]
  max: number
  name: string
}
