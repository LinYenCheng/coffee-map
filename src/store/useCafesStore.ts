import { ICity, Condition, CoffeeShop } from './../types';
import { create } from 'zustand';
import { setAutoFreeze } from 'immer';
import { immer } from 'zustand/middleware/immer';
import axios from 'axios';
import calculateScore from '../util/calculateScore';
import { cities, defaultFilterConditions, defaultSortConditions } from '../constants/config';

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

type TSearchConidtion = {
  coffeeShops: CoffeeShop[];
  keyWord: any;
  filterConditions: Condition[];
};

export const getShops = async () => {
  const res = await axios.get(`${import.meta.env.BASE_URL}cafedata/taiwan.json`);
  if (res.data) {
    const results = res.data.map((shop: CoffeeShop) => {
      const revisedCoffeeShop = {
        ...shop,
        // TODO 改掉
        strSocket: shop && shop.socket !== 'no' ? '插座' : '',
        quietAways: shop && shop.quiet > 3 ? '安靜' : '',
        wifiGood: shop && shop.wifi > 3 ? '網路' : '',
        noLimitedTime: shop && shop.limited_time === 'no' ? '不限時' : '',
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

const checkFilterCondtion = ({
  filterConditions,
  coffeeShop,
}: {
  filterConditions: Condition[];
  coffeeShop: CoffeeShop;
}) => {
  const isSocketFilterEnable = filterConditions[0].checked === true;
  const isQuietFilterEnable = filterConditions[1].checked === true;
  const isNetWorkFilterEnable = filterConditions[2].checked === true;
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
};

const search = async (searchCondition: any) => {
  const { coffeeShops, bounds = false, keyWord = '', filterConditions } = searchCondition;
  const results = keyWord !== '' ? await indexSearch.search(keyWord || '') : [];
  const searchResults = results.map((result: any) => result.ref);
  const filteredShops: CoffeeShop[] = coffeeShops
    .filter((coffeeShop: CoffeeShop) => {
      if (keyWord !== '') {
        const matchesKeyword = searchResults.includes(coffeeShop.id);
        return matchesKeyword;
      }

      if (bounds) {
        return checkBounds({ bounds, coffeeShop });
      }

      if (filterConditions) {
        return checkFilterCondtion({
          filterConditions,
          coffeeShop,
        });
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
  filterConditions,
}: TSearchConidtion) => {
  const bounds = useCafeShopsStore.getState().bounds;
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

export const toggleConditions = ({
  cityConditions,
  filterConditions,
  condition,
}: {
  cityConditions: ICity[];
  filterConditions: Condition[];
  condition?: string;
}) => {
  const coffeeShops = useCafeShopsStore.getState().coffeeShops;
  const bounds = useCafeShopsStore.getState().bounds;

  useCafeShopsStore.setState((state) => {
    const filteredCoffeeShops = coffeeShops
      .filter((coffeeShop: CoffeeShop) => {
        const checkedCities = cityConditions.filter((city) => city.checked);
        const city = checkedCities.find((city) => city.name === coffeeShop.city);

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
