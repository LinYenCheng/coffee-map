import { create } from 'zustand';
import { setAutoFreeze } from 'immer';
import { immer } from 'zustand/middleware/immer';
import axios from 'axios';
import calculateScore from '../util/calculateScore';
import { defaultCheckedConditions, defaultSortConditions } from '../constants/config';
import { CoffeeShop, Condition } from '../types';

const { lunr } = window;
const indexSearch = lunr(function generateLunr() {
  this.field('name');
  this.field('address');
  this.field('strSocket');
  this.field('quietAways');
  this.field('wifiGood');
  this.field('noLimitedTime');
}) as any;

const search = async ({ coffeeShops, bounds = false, keyWord }: any) => {
  const searchQuery = keyWord.toString().trim();
  const results = searchQuery !== '' ? await indexSearch.search(keyWord) : [];
  const searchResults = results.map((result: any) => result.ref);

  const filteredShops = coffeeShops.filter((coffeeShop: CoffeeShop) => {
    const matchesKeyword = searchQuery === '' || searchResults.includes(coffeeShop.id);

    if (bounds) {
      const { southWest, northEast } = bounds;
      const { latitude, longitude } = coffeeShop;
      const withinBounds =
        parseFloat(latitude) > southWest.lat &&
        parseFloat(longitude) > southWest.lng &&
        parseFloat(latitude) < northEast.lat &&
        parseFloat(longitude) < northEast.lng;
      return withinBounds && matchesKeyword;
    }
    return matchesKeyword;
  });

  const finalResult = filteredShops
    .map((shop: CoffeeShop) => ({
      ...shop,
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
    sortConditions: defaultSortConditions,
  })),
);

export const toggleConditions = (checkedConditions: any) => {
  useCafeShopsStore.setState((state) => {
    state.checkedConditions = checkedConditions;
  });
};

export const toggleSortConditions = (sortConditions: any) => {
  // Get the first active sort condition
  const activeSortCondition = sortConditions.find((sort: Condition) => sort.checked);

  useCafeShopsStore.setState((state) => {
    state.sortConditions = sortConditions;

    if (activeSortCondition) {
      state.filterCoffeeShops = state.filterCoffeeShops.sort((a: CoffeeShop, b: CoffeeShop) => {
        const { name } = activeSortCondition;
        switch (name) {
          case 'score':
            return b.score - a.score;
          case 'cheap':
            return b.cheap - a.cheap;
          case 'wifi':
            return b.wifi - a.wifi;
          // Add more cases for other fields
          default:
            return 0; // No matching field or condition
        }
      });
    }
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
    res.data.forEach((shop: CoffeeShop) => {
      indexSearch.add({
        ...shop,
        strSocket: shop && shop.socket === 'yes' ? '插座' : '',
        quietAways: shop && shop.quiet > 3 ? '安靜' : '',
        wifiGood: shop && shop.wifi > 3 ? '網路' : '',
        noLimitedTime: shop && shop.limited_time === 'no' ? '不限時' : '',
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

  return result;
};

export const clearFilterCoffeeShops = () => {
  useCafeShopsStore.setState({
    filterCoffeeShops: [],
  });
};

export default useCafeShopsStore;
