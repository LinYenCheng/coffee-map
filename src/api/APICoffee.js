/* eslint-disable no-param-reassign */
import axios from 'axios';

import { cities } from '../config';

const { lunr } = window;
const indexSearch = lunr(function generateLunr() {
  this.field('name');
  this.field('address');
  this.field('strSocket');
  this.field('quietAways');
  this.field('wifiGood');
});

const arrResultCities = cities.map((city) => {
  if (city.coffeeShops) {
    return city;
  }
  return { ...city, coffeeShops: [] };
});

const getShops = async (city) => {
  const res = await axios.get(`${import.meta.env.BASE_URL}/cafedata/${city.name}.json`);
  if (res.data) {
    res.data.forEach((shop) => {
      indexSearch.add({
        ...shop,
        strSocket: shop && shop.socket === 'yes' ? '插座' : '',
        quietAways: shop && shop.quiet > 3 ? '安靜' : '',
        wifiGood: shop && shop.wifi > 3 ? '網路' : '',
      });
      // console.log({
      //   ...shop,
      //   strSocket: shop && shop.socket === 'yes' ? '插座' : '',
      //   quietAways: shop && shop.quiet > 3 ? '安靜' : '',
      //   wifiGood: shop && shop.wifi > 3 ? '網路' : '',
      // });
      // indexSearch.add(shop);
    });
    city.coffeeShops = res.data;
    city.checked = true;
    return city;
  }
  return city;
};

async function getCoffee(checkedCities) {
  const coffeeShops = await Promise.all(
    checkedCities.map((isChecked, index) => {
      if (isChecked && !arrResultCities[index].coffeeShops.length) {
        // console.log('get', arrResultCities[index].name);
        const res = getShops(arrResultCities[index]);
        return res;
      }
      if (!isChecked) arrResultCities[index].checked = false;
      if (isChecked) arrResultCities[index].checked = true;
      return arrResultCities[index];
    }),
  );
  let tempShops = [];
  // console.log(coffeeShops);
  coffeeShops.forEach((coffeeShop) => {
    if (coffeeShop.checked) tempShops = tempShops.concat(coffeeShop.coffeeShops);
  });
  return tempShops;
}

async function searchWithKeyWord(keyWord) {
  let finalResult = [];
  if (keyWord.toString().trim() !== '') {
    const results = await indexSearch.search(keyWord);
    if (results && results.length) {
      const searchResults = results.map((result) => result.ref);
      let tempShops = [];
      arrResultCities
        .filter((city) => city.checked)
        .forEach((city) => {
          tempShops = tempShops.concat(city.coffeeShops);
        });
      tempShops = tempShops.filter((coffeeShop) => searchResults.indexOf(coffeeShop.id) !== -1);

      finalResult = tempShops;
    }
  }
  return finalResult;
}

const APICoffee = {
  getCoffee,
  searchWithKeyWord,
};

export default APICoffee;
