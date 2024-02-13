import { ICity, Condition, CoffeeShop, NO_LIMITED_TIME, REMOTE_WORK } from './../types';
import { create } from 'zustand';
import { setAutoFreeze } from 'immer';
import { immer } from 'zustand/middleware/immer';
import axios from 'axios';
import calculateScore from '../util/calculateScore';
import {
  cities,
  defaultFilterConditions,
  defaultSortConditions,
  jobFilterConditions,
  noLimitTimeFilterConditions,
} from '../constants/config';

setAutoFreeze(false);
const { lunr } = window;
const indexSearch = lunr(function generateLunr() {
  this.field('name');
  this.field('address');
  this.field('keyword');
}) as any;

interface Bounds {
  northEast: {
    lat: number;
    lng: number;
  };
  southWest: {
    lat: number;
    lng: number;
  };
}

const defaultBounds: Bounds = {
  northEast: {
    lat: 25.19872829288669,
    lng: 121.66603088378908,
  },
  southWest: {
    lat: 24.927228790288993,
    lng: 121.38519287109376,
  },
};

const useCafeShopsStore = create(
  immer(() => ({
    bounds: defaultBounds as Bounds,
    coffeeShops: [],
    filterCoffeeShops: [] as CoffeeShop[],
    filterConditions: defaultFilterConditions,
    cityConditions: cities,
    sortConditions: defaultSortConditions,
  })),
);

export const getShops = async () => {
  const res = await axios.get(`${import.meta.env.BASE_URL}cafedata/taiwan.json`);
  if (res.data) {
    const results = res.data.map((shop: CoffeeShop) => {
      let keyword = '';
      if (shop) {
        if (shop.socket === 'yes') {
          keyword += ' 插座 插頭';
        }

        if (shop.limited_time === 'no') {
          keyword += ' 不限時';
        }

        if (shop.quiet > 3) {
          keyword += ' 安靜';
        }

        if (shop.wifi > 3) {
          keyword += ' 網路 WIFI wifi';
        }
      }

      const revisedCoffeeShop = {
        ...shop,
        // TODO 改掉
        keyword,
        score: calculateScore({ ...shop }),
      };
      indexSearch.add(revisedCoffeeShop);

      return revisedCoffeeShop;
    });
    useCafeShopsStore.setState({ coffeeShops: results });
    return results;
  }
  return [];
};

const checkBounds = ({ bounds, coffeeShop }: { bounds: Bounds; coffeeShop: CoffeeShop }) => {
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
};

const checkItemIsChecked = ({ items, name }: { items: Condition[]; name: string }) => {
  const item = items.find((elm: Condition) => elm.name === name);
  return item?.checked === true;
};

const checkFilterCondtion = ({
  filterConditions,
  coffeeShop,
}: {
  filterConditions: Condition[];
  coffeeShop: CoffeeShop;
}) => {
  if (
    checkItemIsChecked({ items: filterConditions, name: 'socket' }) &&
    coffeeShop.socket === 'no'
  ) {
    return false;
  }

  if (checkItemIsChecked({ items: filterConditions, name: 'quiet' }) && coffeeShop.quiet < 3) {
    return false;
  }

  if (checkItemIsChecked({ items: filterConditions, name: 'wifi' }) && coffeeShop.wifi < 3) {
    return false;
  }

  if (
    checkItemIsChecked({ items: filterConditions, name: 'limited_time' }) &&
    coffeeShop.limited_time !== 'yes'
  ) {
    return false;
  }

  if (
    checkItemIsChecked({ items: filterConditions, name: 'standing_desk' }) &&
    coffeeShop.standing_desk !== 'yes'
  ) {
    return false;
  }

  return true;
};

export const searchWithKeyword = async (keyWord = '', condition = '') => {
  const cityConditions = useCafeShopsStore.getState().cityConditions;
  let filterConditions;

  if (condition === REMOTE_WORK) {
    filterConditions = jobFilterConditions;
  } else if (condition === NO_LIMITED_TIME) {
    filterConditions = noLimitTimeFilterConditions;
  } else {
    filterConditions = useCafeShopsStore.getState().filterConditions;
  }

  await toggleConditions({
    keyWord,
    cityConditions,
    filterConditions,
  });
};

export const toggleConditions = async ({
  keyWord = '',
  cityConditions,
  filterConditions,
  condition,
}: {
  keyWord?: string;
  cityConditions: ICity[];
  filterConditions: Condition[];
  condition?: string;
}) => {
  const coffeeShops = useCafeShopsStore.getState().coffeeShops;
  const bounds = useCafeShopsStore.getState().bounds;
  const results = keyWord !== '' ? await indexSearch.search(keyWord || '') : [];
  const searchResults = results.map((result: any) => result.ref);

  useCafeShopsStore.setState((state) => {
    const filteredCoffeeShops = coffeeShops
      .filter((coffeeShop: CoffeeShop) => {
        const checkedCities = cityConditions.filter((city) => city.checked);
        const city = checkedCities.find((city) => city.name === coffeeShop.city);

        if (keyWord !== '') {
          const matchesKeyword = searchResults.includes(coffeeShop.id);
          return matchesKeyword;
        }

        if (!condition && bounds) {
          return checkBounds({ bounds, coffeeShop });
        }

        if (!!condition && checkedCities.length > 0) {
          if (!city || !city.checked) return false;
        }

        if (filterConditions) {
          return checkFilterCondtion({
            filterConditions,
            coffeeShop,
          });
        }

        return true;
      })
      .sort((a: CoffeeShop, b: CoffeeShop) => b.score - a.score);

    state.cityConditions = cityConditions;
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
    state.filterConditions = defaultFilterConditions;
  });
};

export const setBounds = (bounds: Bounds) => {
  useCafeShopsStore.setState((state) => {
    state.bounds = bounds;
  });
};

export default useCafeShopsStore;
