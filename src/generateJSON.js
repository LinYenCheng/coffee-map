const fs = require('fs');
const axios = require('axios');

function writeResToJOSON(res, fileName) {
  const data = JSON.stringify(res.data);
  fs.writeFileSync(`./public/cafedata/${fileName}.json`, data);
}

const instance = axios.create({
  baseURL: 'https://cafenomad.tw/api/v1.2',
  timeout: 10000,
  headers: { 'X-Custom-Header': 'foobar' },
});

instance.get(`/cafes`).then((res) => {
  writeResToJOSON(res, 'taiwan');
});
