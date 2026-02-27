// id - 一組UUID
// name - 店名
// wifi - wifi 穩定
// seat - 通常有位
// quiet - 安靜程度
// tasty - 咖啡好喝
// cheap - 價格便宜
// music - 裝潢音樂
// address - 地址
// latitude - 緯度
// longitude - 經度
// url - 官網
// limited_time - 有無限時
// socket - 插座多
// standing_desk - 可站立工作
// mrt - 捷運站
// open_time - 營業時間

export interface CoffeeShop {
  id: string;
  name: string;
  city: string;
  wifi: number;
  seat: number;
  quiet: number;
  tasty: number;
  cheap: number;
  music: number;
  url: string;
  address: string;
  latitude: string;
  longitude: string;
  limited_time: 'yes' | 'maybe' | 'no';
  socket: 'yes' | 'maybe' | 'no';
  standing_desk: 'yes' | 'no';
  mrt?: string;
  open_time?: string;
  score: number;
}

export interface Condition {
  name: string;
  displayName: string;
  checked: boolean;
}

export interface ICity {
  name: string;
  displayName: string;
  lng: number;
  lat: number;
  checked: boolean;
}

export interface IConditionMap {
  'no-limited-time': string;
  'remote-work': string;
}

export const NO_LIMITED_TIME = 'no-limited-time';
export const REMOTE_WORK = 'remote-work';

export type ConditionType = typeof NO_LIMITED_TIME | typeof REMOTE_WORK;
