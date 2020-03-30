const fs = require('fs');
const axios = require('axios');

const cities = [
  {
    name: 'taipei',
    displayName: '台北',
    checked: false
  },
  {
    name: 'keelung',
    displayName: '基隆',
    checked: false
  },
  {
    name: 'taoyuan',
    displayName: '桃園',
    checked: false
  },
  {
    name: 'hsinchu',
    displayName: '新竹',
    checked: true
  },
  {
    name: 'miaoli',
    displayName: '苗栗',
    checked: false
  },
  {
    name: 'taichung',
    displayName: '台中',
    checked: false
  },
  {
    name: 'changhua',
    displayName: '彰化',
    checked: false
  },
  {
    name: 'nantou',
    displayName: '南投',
    checked: false
  },
  {
    name: 'yunlin',
    displayName: '雲林',
    checked: false
  },
  {
    name: 'chiayi',
    displayName: '嘉義',
    checked: false
  },
  {
    name: 'tainan',
    displayName: '台南',
    checked: false
  },
  {
    name: 'kaohsiung',
    displayName: '高雄',
    checked: false
  },
  {
    name: 'pingtung',
    displayName: '屏東',
    checked: false
  },
  {
    name: 'yilan',
    displayName: '宜蘭',
    checked: false
  },
  {
    name: 'hualien',
    displayName: '花蓮',
    checked: false
  },
  {
    name: 'taitung',
    displayName: '台東',
    checked: false
  },
  {
    name: 'penghu',
    displayName: '澎湖',
    checked: false
  }
];

function writeResToJOSON(res, fileName) {
  const data = JSON.stringify(res.data);
  fs.writeFileSync(`./public/cafedata/${fileName}.json`, data);
}

const instance = axios.create({
  baseURL: 'https://cafenomad.tw/api/v1.2',
  timeout: 10000,
  headers: { 'X-Custom-Header': 'foobar' }
});

cities.forEach(city => {
  instance.get(`/cafes/${city.name}`).then(res => {
    writeResToJOSON(res, city.name);
  });
});
