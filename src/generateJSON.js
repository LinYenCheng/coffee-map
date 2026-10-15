/* eslint-disable no-undef */
/* eslint-env node */
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const outputPath = path.join(__dirname, '../public/cafedata/taiwan.json');

function writeResponseToJSON(data) {
  const temporaryPath = `${outputPath}.tmp`;
  fs.writeFileSync(temporaryPath, JSON.stringify(data));
  fs.renameSync(temporaryPath, outputPath);
}

async function generateJSON() {
  const instance = axios.create({
    baseURL: 'https://cafenomad.tw/api/v1.2',
    timeout: 10000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    },
  });

  try {
    const response = await instance.get('/cafes');
    writeResponseToJSON(response.data);
    console.log(`已更新咖啡店資料：${outputPath}`);
  } catch (error) {
    if (fs.existsSync(outputPath)) {
      console.warn('無法連線至 Cafe Nomad API，將保留並使用本地快取資料。');
      console.warn(error.message);
      return;
    }

    console.error('無法連線至 Cafe Nomad API，且找不到本地快取資料。');
    throw error;
  }
}

generateJSON().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
