import { create } from 'zustand';
import { setAutoFreeze } from 'immer';
import { immer } from 'zustand/middleware/immer';
import axios from 'axios';
import calculateScore from '../util/calculateScore';
import { defaultCheckedConditions } from '../constants/config';
import { CoffeeShop } from '../types';

const { lunr } = window;
const indexSearch = lunr(function generateLunr() {
  this.field('name');
  this.field('address');
  this.field('strSocket');
  this.field('quietAways');
  this.field('wifiGood');
}) as any;

const search = async ({ coffeeShops, bounds, keyWord }: any) => {
  let finalResult = [];
  if (keyWord.toString().trim() !== '') {
    const results = await indexSearch.search(keyWord);
    if (results && results.length) {
      const searchResults = results.map((result: any) => result.ref);

      let tempShops = coffeeShops;

      tempShops = tempShops.filter((coffeeShop: CoffeeShop) => {
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

    tempShops = tempShops.filter((coffeeShop: CoffeeShop) => {
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
    .map((shop: CoffeeShop) => ({
      ...shop,
      strSocket: shop && shop.socket === 'yes' ? '插座' : '',
      quietAways: shop && shop.quiet > 3 ? '安靜' : '',
      wifiGood: shop && shop.wifi > 3 ? '網路' : '',
      score: calculateScore({ ...shop }),
    }))
    .sort((a: CoffeeShop, b: CoffeeShop) => b.score - a.score);
  return finalResult;
};

setAutoFreeze(false);
const useCafeShopsStore = create(
  immer(() => ({
    coffeeShops: [],
    filterCoffeeShops: [],
    checkedConditions: defaultCheckedConditions,
  })),
);

export const toggleConditions = (checkedConditions: any) => {
  useCafeShopsStore.setState((state) => {
    state.checkedConditions = checkedConditions;
  });
};

export const resetConditions = () => {
  useCafeShopsStore.setState((state) => {
    state.checkedConditions = [
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
    ];
  });
};

export const getShops = async () => {
  const res = await axios.get(`${import.meta.env.BASE_URL}cafedata/taiwan.json`);
  if (res.data) {
    res.data.forEach((shop: any) => {
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

export const searchWithKeyword = async ({ coffeeShops, keyWord, bounds }: any) => {
  const result = await search({
    coffeeShops,
    keyWord,
    bounds,
  });

  useCafeShopsStore.setState({
    filterCoffeeShops: result,
  });
};

export default useCafeShopsStore;
