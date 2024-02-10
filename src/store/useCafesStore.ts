import { create } from 'zustand';
import { setAutoFreeze } from 'immer';
import { immer } from 'zustand/middleware/immer';
import axios from 'axios';
import calculateScore from '../util/calculateScore';
import { defaultCheckedConditions, defaultSortConditions } from '../constants/config';
import { CoffeeShop, Condition } from '../types';

setAutoFreeze(false);
const { lunr } = window;
const indexSearch = lunr(function generateLunr() {
  this.field('name');
  this.field('address');
  this.field('strSocket');
  this.field('quietAways');
  this.field('wifiGood');
  this.field('noLimitedTime');
}) as any;

const useCafeShopsStore = create(
  immer(() => ({
    coffeeShops: [],
    filterCoffeeShops: [] as CoffeeShop[],
    filterConditions: defaultCheckedConditions,
    sortConditions: defaultSortConditions,
  })),
);

type TSearchConidtion = {
  coffeeShops: CoffeeShop[];
  keyWord: any;
  bounds: any;
  filterConditions: Condition[];
};

export const getShops = async () => {
  const res = await axios.get(`${import.meta.env.BASE_URL}cafedata/taiwan.json`);
  if (res.data) {
    res.data.forEach((shop: CoffeeShop) => {
      indexSearch.add({
        ...shop,
        // TODO 改掉
        strSocket: shop && shop.socket !== 'no' ? '插座' : '',
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

const search = async (searchCondition: TSearchConidtion) => {
  const { coffeeShops, bounds = false, keyWord = '', filterConditions } = searchCondition;
  const results = keyWord !== '' ? await indexSearch.search(keyWord || '') : [];
  const searchResults = results.map((result: any) => result.ref);
  const filteredShops: CoffeeShop[] = coffeeShops
    .filter((coffeeShop: CoffeeShop) => {
      const isSocketFilterEnable = filterConditions[0].checked === true;
      const isQuietFilterEnable = filterConditions[1].checked === true;
      const isNetWorkFilterEnable = filterConditions[2].checked === true;

      if (keyWord !== '') {
        const matchesKeyword = searchResults.includes(coffeeShop.id);
        return matchesKeyword;
      }

      if (bounds) {
        const { southWest, northEast } = bounds;
        const { latitude, longitude } = coffeeShop;
        const withinBounds =
          parseFloat(latitude) > southWest.lat &&
          parseFloat(longitude) > southWest.lng &&
          parseFloat(latitude) < northEast.lat &&
          parseFloat(longitude) < northEast.lng;
        return withinBounds;
      }

      if (isSocketFilterEnable && coffeeShop.socket === 'no') {
        return false;
      }

      if (isQuietFilterEnable && coffeeShop.quiet < 3) {
        return false;
      }

      if (isNetWorkFilterEnable && coffeeShop.wifi < 3) {
        return false;
      }

      return true;
    })
    .map((shop: CoffeeShop) => ({
      ...shop,
      score: calculateScore({ ...shop }),
    }))
    .sort((a: CoffeeShop, b: CoffeeShop) => b.score - a.score);

  return filteredShops;
};

export const searchWithCondition = async ({
  coffeeShops,
  keyWord,
  bounds,
  filterConditions,
}: TSearchConidtion) => {
  const result = await search({
    coffeeShops,
    keyWord,
    bounds,
    filterConditions,
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

export const toggleConditions = (filterConditions: any) => {
  const coffeeShops = useCafeShopsStore.getState().coffeeShops;
  useCafeShopsStore.setState((state) => {
    const filteredCoffeeShops = coffeeShops.filter((nowItemCoffee: CoffeeShop) => {
      const isSocketFilterEnable = filterConditions[0].checked === true;
      const isQuietFilterEnable = filterConditions[1].checked === true;
      const isNetWorkFilterEnable = filterConditions[2].checked === true;

      if (!nowItemCoffee) return false;

      if (isSocketFilterEnable && nowItemCoffee.socket !== 'yes') {
        return false;
      }

      if (isQuietFilterEnable && nowItemCoffee.quiet < 3) {
        return false;
      }

      if (isNetWorkFilterEnable && nowItemCoffee.wifi < 3) {
        return false;
      }

      return true;
    });

    state.filterConditions = filterConditions;
    state.filterCoffeeShops = filteredCoffeeShops;
  });
};

export const toggleSortConditions = (sortConditions: any) => {
  // Get the first active sort condition
  const activeSortCondition = sortConditions.find((sort: Condition) => sort.checked);
  const filterCoffeeShops = useCafeShopsStore.getState().filterCoffeeShops;

  useCafeShopsStore.setState((state) => {
    state.sortConditions = sortConditions;

    if (activeSortCondition) {
      state.filterCoffeeShops = filterCoffeeShops.sort((a: CoffeeShop, b: CoffeeShop) => {
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
    state.filterConditions = [
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

export default useCafeShopsStore;
