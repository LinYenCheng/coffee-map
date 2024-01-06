/* eslint-disable no-param-reassign */
import axios from 'axios';

import calculateScore from '../util/calculateScore';

const { lunr } = window;
const indexSearch = lunr(function generateLunr() {
  this.field('name');
  this.field('address');
  this.field('strSocket');
  this.field('quietAways');
  this.field('wifiGood');
});

const getShops = async (city) => {
  const res = await axios.get(`${import.meta.env.BASE_URL}/cafedata/taiwan.json`);
  if (res.data) {
    res.data.forEach((shop) => {
      indexSearch.add({
        ...shop,
        strSocket: shop && shop.socket === 'yes' ? '插座' : '',
        quietAways: shop && shop.quiet > 3 ? '安靜' : '',
        wifiGood: shop && shop.wifi > 3 ? '網路' : '',
        score: calculateScore({ ...shop }),
      });
      // console.log({
      //   ...shop,
      //   strSocket: shop && shop.socket === 'yes' ? '插座' : '',
      //   quietAways: shop && shop.quiet > 3 ? '安靜' : '',
      //   wifiGood: shop && shop.wifi > 3 ? '網路' : '',
      // });
      // indexSearch.add(shop);
    });
    return res.data;
  }
  return [];
};

async function getCoffee() {
  const coffeeShops = await getShops();
  return coffeeShops;
}

async function searchWithKeyWord({ bounds, keyWord }) {
  let finalResult = [];
  const coffeeShops = await getShops();
  if (keyWord.toString().trim() !== '') {
    const results = await indexSearch.search(keyWord);
    if (results && results.length) {
      const searchResults = results.map((result) => result.ref);

      let tempShops = coffeeShops;

      tempShops = tempShops.filter((coffeeShop) => {
        if (bounds) {
          const { southWest, northEast } = bounds;
          const { latitude, longitude } = coffeeShop;
          return (
            parseFloat(latitude) > southWest.lat &&
            parseFloat(longitude) > southWest.lng &&
            parseFloat(latitude) < northEast.lat &&
            parseFloat(longitude) < northEast.lng &&
            searchResults.indexOf(coffeeShop.id) !== -1
          );
        }
        return searchResults.indexOf(coffeeShop.id) !== -1;
      });
      finalResult = tempShops;
    }
  } else {
    let tempShops = coffeeShops;

    tempShops = tempShops.filter((coffeeShop) => {
      if (bounds) {
        const { southWest, northEast } = bounds;
        const { latitude, longitude } = coffeeShop;
        return (
          parseFloat(latitude) > southWest.lat &&
          parseFloat(longitude) > southWest.lng &&
          parseFloat(latitude) < northEast.lat &&
          parseFloat(longitude) < northEast.lng
        );
      }
    });
    finalResult = tempShops;
  }

  finalResult = finalResult
    .map((shop) => ({
      ...shop,
      strSocket: shop && shop.socket === 'yes' ? '插座' : '',
      quietAways: shop && shop.quiet > 3 ? '安靜' : '',
      wifiGood: shop && shop.wifi > 3 ? '網路' : '',
      score: calculateScore({ ...shop }),
    }))
    .sort((a, b) => b.score - a.score);
  return finalResult;
}

const APICoffee = {
  getCoffee,
  searchWithKeyWord,
};

export default APICoffee;
