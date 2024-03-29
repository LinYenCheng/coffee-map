import { ICity } from '../types';

export interface Condition {
  name: string;
  displayName: string;
  checked: boolean;
}

export const cities: ICity[] = [
  {
    name: 'taipei',
    displayName: '雙北',
    lng: 121.5598,
    lat: 25.08,
    checked: false,
  },
  {
    name: 'keelung',
    displayName: '基隆',
    lng: 121.7081,
    lat: 25.10898,
    checked: false,
  },
  {
    name: 'taoyuan',
    displayName: '桃園',
    lng: 121.300974,
    lat: 24.993312,
    checked: false,
  },
  {
    name: 'hsinchu',
    displayName: '新竹',
    lng: 120.9647,
    lat: 24.80395,
    checked: false,
  },
  {
    name: 'miaoli',
    displayName: '苗栗',
    lng: 120.820793,
    lat: 24.565031,
    checked: false,
  },
  {
    name: 'taichung',
    displayName: '台中',
    lng: 120.645756,
    lat: 24.176912,
    checked: false,
  },
  {
    name: 'changhua',
    displayName: '彰化',
    lng: 120.4818,
    lat: 23.99297,
    checked: false,
  },
  {
    name: 'nantou',
    displayName: '南投',
    lng: 120.9876,
    lat: 23.83876,
    checked: false,
  },
  {
    name: 'yunlin',
    displayName: '雲林',
    lng: 120.3897,
    lat: 23.75585,
    checked: false,
  },
  {
    name: 'chiayi',
    displayName: '嘉義',
    lng: 120.574,
    lat: 23.45889,
    checked: false,
  },
  {
    name: 'tainan',
    displayName: '台南',
    lng: 120.1851,
    lat: 23.005181,
    checked: false,
  },
  {
    name: 'kaohsiung',
    displayName: '高雄',
    lng: 120.312019,
    lat: 22.623045,
    checked: false,
  },
  {
    name: 'pingtung',
    displayName: '屏東',
    lng: 120.62,
    lat: 22.54951,
    checked: false,
  },
  {
    name: 'yilan',
    displayName: '宜蘭',
    lng: 121.7195,
    lat: 24.69295,
    checked: false,
  },
  {
    name: 'hualien',
    displayName: '花蓮',
    lng: 121.3542,
    lat: 23.7569,
    checked: false,
  },
  {
    name: 'taitung',
    displayName: '台東',
    lng: 120.9876,
    lat: 22.98461,
    checked: false,
  },
  {
    name: 'penghu',
    displayName: '澎湖',
    lng: 119.6151,
    lat: 23.56548,
    checked: false,
  },
];

export const defaultFilterConditions: Condition[] = [
  {
    name: 'socket',
    displayName: '插座',
    checked: false,
  },
  {
    name: 'quiet',
    displayName: '安靜',
    checked: false,
  },
  {
    name: 'wifi',
    displayName: '網路',
    checked: false,
  },
  {
    name: 'standing_desk',
    displayName: '站位',
    checked: false,
  },
  {
    name: 'limited_time',
    displayName: '無限時',
    checked: false,
  },
];

export const jobFilterConditions: Condition[] = [
  {
    name: 'socket',
    displayName: '插座',
    checked: true,
  },
  {
    name: 'quiet',
    displayName: '安靜',
    checked: false,
  },
  {
    name: 'wifi',
    displayName: '網路',
    checked: true,
  },
  {
    name: 'standing_desk',
    displayName: '站位',
    checked: false,
  },
  {
    name: 'limited_time',
    displayName: '無限時',
    checked: false,
  },
];

export const noLimitTimeFilterConditions: Condition[] = [
  {
    name: 'socket',
    displayName: '插座',
    checked: false,
  },
  {
    name: 'quiet',
    displayName: '安靜',
    checked: false,
  },
  {
    name: 'wifi',
    displayName: '網路',
    checked: false,
  },
  {
    name: 'standing_desk',
    displayName: '站位',
    checked: false,
  },
  {
    name: 'limited_time',
    displayName: '無限時',
    checked: true,
  },
];

export const defaultSortConditions: Condition[] = [
  {
    name: 'score',
    displayName: '好咖啡',
    checked: true,
  },
  {
    name: 'cheap',
    displayName: '低價',
    checked: false,
  },
  {
    name: 'wifi',
    displayName: 'WIFI',
    checked: false,
  },
];

export const DISABLE_CLUSTER_LEVEL = 18;
