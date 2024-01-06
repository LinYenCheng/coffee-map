import { create } from 'zustand';
import axios from 'axios';
import calculateScore from '../util/calculateScore';
import { defaultCheckedConditions } from '../constants/config';

const { lunr } = window;
const indexSearch = lunr(function generateLunr() {
  this.field('name');
  this.field('address');
  this.field('strSocket');
  this.field('quietAways');
  this.field('wifiGood');
});

export const searchWithKeyWord = async ({ coffeeShops, bounds, keyWord }) => {
  let finalResult = [];
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

    tempShops = tempShops.filter((coffeeShop, index) => {
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
};

const useCafeShopsStore = create(() => ({
  coffeeShops: [],
  checkedConditions: defaultCheckedConditions,
}));

export const toggleConditions = (checkedConditions) => {
  useCafeShopsStore.setState({ checkedConditions });
};

export const resetConditions = () => {
  useCafeShopsStore.setState({ checkedConditions: defaultCheckedConditions });
};

export const getShops = async (city) => {
  const res = await axios.get(`${import.meta.env.BASE_URL}cafedata/taiwan.json`);
  if (res.data) {
    res.data.forEach((shop) => {
      indexSearch.add({
        ...shop,
        strSocket: shop && shop.socket === 'yes' ? '插座' : '',
        quietAways: shop && shop.quiet > 3 ? '安靜' : '',
        wifiGood: shop && shop.wifi > 3 ? '網路' : '',
        score: calculateScore({ ...shop }),
      });
    });
    useCafeShopsStore.setState({ coffeeShops: res.data });
    return res.data;
  }
  return [];
};

export default useCafeShopsStore;
