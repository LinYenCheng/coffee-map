export interface CoffeeShop {
  id: string
  name: string
  city: string
  wifi: number
  seat: number
  quiet: number
  tasty: number
  cheap: number
  music: number
  url: string
  address: string
  latitude: string
  longitude: string
  limited_time: 'yes' | 'maybe' | 'no'
  socket: 'yes' | 'maybe' | 'no'
  standing_desk: 'yes' | 'no'
  mrt?: string
  open_time?: string
  score: number
}

export interface Condition {
    name: string,
    displayName?: string,
    checked: boolean
}
