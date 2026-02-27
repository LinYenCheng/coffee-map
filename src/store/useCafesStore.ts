import { ICity, Condition, CoffeeShop, NO_LIMITED_TIME, REMOTE_WORK } from './../types';
import { create } from 'zustand';
import { setAutoFreeze } from 'immer';
import { immer } from 'zustand/middleware/immer';
import axios from 'axios';
import calculateScore from '../util/calculateScore';
import { calculateDistance } from '../util/calculateDistance';
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

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface CafeShopsState {
  bounds: Bounds;
  coffeeShops: CoffeeShop[];
  filterCoffeeShops: CoffeeShop[];
  filterConditions: Condition[];
  cityConditions: ICity[];
  sortConditions: Condition[];
  userLocation: UserLocation | null;
}

const useCafeShopsStore = create<CafeShopsState>()(
  immer(() => ({
    bounds: defaultBounds as Bounds,
    coffeeShops: [],
    filterCoffeeShops: [] as CoffeeShop[],
    filterConditions: defaultFilterConditions,
    cityConditions: cities,
    sortConditions: defaultSortConditions,
    userLocation: null as UserLocation | null,
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

export const checkBounds = ({ bounds, coffeeShop }: { bounds: Bounds; coffeeShop: CoffeeShop }) => {
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
  const results = keyWord !== '' ? await indexSearch.search(keyWord || '') : [];
  const searchResults = results.map((result: any) => result.ref);

  useCafeShopsStore.setState((state) => {
    let filteredCoffeeShops: CoffeeShop[] = coffeeShops
      .filter((coffeeShop: CoffeeShop) => {
        const checkedCities = cityConditions.filter((city) => city.checked);
        const city = checkedCities.find((city) => city.name === coffeeShop.city);

        if (keyWord !== '') {
          const matchesKeyword = searchResults.includes(coffeeShop.id);
          return matchesKeyword;
        }

        if (checkedCities.length > 0) {
          if (!city || !city.checked) return false;
        }

        if (filterConditions) {
          return checkFilterCondtion({
            filterConditions,
            coffeeShop,
          });
        }

        return true;
      });

    // 依照當前排序條件進行排序，預設已經在 state 裡
    const currentSortConditions = useCafeShopsStore.getState().sortConditions;
    const userLocation = useCafeShopsStore.getState().userLocation;
    const activeSortCondition = currentSortConditions.find((sort) => sort.checked);

    const getFallbackLocation = (): UserLocation | null => {
      const stored = localStorage.getItem('lastCenter');
      if (stored) {
        try {
          const obj = JSON.parse(stored);
          return { latitude: obj.lat, longitude: obj.lng };
        } catch {
          return null;
        }
      }
      return null;
    };

    if (activeSortCondition) {
      switch (activeSortCondition.name) {
        case 'distance':
          {
            let loc = userLocation;
            if (!loc) {
              loc = getFallbackLocation();
            }
            if (loc) {
              filteredCoffeeShops = sortByDistance(filteredCoffeeShops, loc);
            }
          }
          break;
        case 'score':
          filteredCoffeeShops = filteredCoffeeShops.sort(
            (a: CoffeeShop, b: CoffeeShop) => b.score - a.score,
          );
          break;
        case 'cheap':
          filteredCoffeeShops = filteredCoffeeShops.sort(
            (a: CoffeeShop, b: CoffeeShop) => b.cheap - a.cheap,
          );
          break;
        case 'wifi':
          filteredCoffeeShops = filteredCoffeeShops.sort(
            (a: CoffeeShop, b: CoffeeShop) => b.wifi - a.wifi,
          );
          break;
        default:
          break;
      }
    }

    state.cityConditions = cityConditions;
    state.filterConditions = filterConditions;
    state.filterCoffeeShops = filteredCoffeeShops;
  });
};

export const toggleSortConditions = (sortConditions: any) => {
  // Get the first active sort condition
  const activeSortCondition = sortConditions.find((sort: Condition) => sort.checked);
  const filterCoffeeShops = useCafeShopsStore.getState().filterCoffeeShops;
  const userLocation = useCafeShopsStore.getState().userLocation;

  const getFallbackLocation = (): UserLocation | null => {
    const stored = localStorage.getItem('lastCenter');
    if (stored) {
      try {
        const obj = JSON.parse(stored);
        return { latitude: obj.lat, longitude: obj.lng };
      } catch {
        return null;
      }
    }
    return null;
  };

  useCafeShopsStore.setState((state) => {
    state.sortConditions = sortConditions;

    if (activeSortCondition) {
      let sortedShops = [...filterCoffeeShops];
      const { name } = activeSortCondition;
      switch (name) {
        case 'score':
          sortedShops.sort((a: CoffeeShop, b: CoffeeShop) => b.score - a.score);
          break;
        case 'cheap':
          sortedShops.sort((a: CoffeeShop, b: CoffeeShop) => b.cheap - a.cheap);
          break;
        case 'wifi':
          sortedShops.sort((a: CoffeeShop, b: CoffeeShop) => b.wifi - a.wifi);
          break;
        case 'distance':
          let loc = userLocation;
          if (!loc) {
            loc = getFallbackLocation();
          }
          if (loc) {
            sortedShops = sortByDistance(sortedShops, loc);
          }
          break;
        default:
          // No matching field or condition
          break;
      }
      state.filterCoffeeShops = sortedShops;
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

export const setUserLocation = (location: UserLocation | null) => {
  useCafeShopsStore.setState((state) => {
    state.userLocation = location;
  });
};

/**
 * 根據用戶位置找到最近的城市
 * @param userLat 用戶的緯度
 * @param userLng 用戶的經度
 * @returns 最近的城市
 */
export const findNearestCity = (userLat: number, userLng: number): ICity | null => {
  const citiesToCheck = useCafeShopsStore.getState().cityConditions;
  let nearestCity: ICity | null = null;
  let minDistance = Infinity;

  citiesToCheck.forEach((city) => {
    const distance = calculateDistance(userLat, userLng, city.lat, city.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  });

  return nearestCity;
};

/**
 * 根據用戶位置和城市設置自動選擇最近的城市
 * @param userLocation 用戶位置
 */
export const autoSelectCityByLocation = (userLocation: UserLocation) => {
  const nearestCity = findNearestCity(userLocation.latitude, userLocation.longitude);
  if (nearestCity) {
    const updatedCityConditions = useCafeShopsStore.getState().cityConditions.map((city) => ({
      ...city,
      checked: city.name === nearestCity.name,
    }));
    useCafeShopsStore.setState((state) => {
      state.cityConditions = updatedCityConditions;
    });
  }
};

/**
 * 根據用戶位置排序咖啡店（從近到遠）
 * @param coffeeShops 咖啡店列表
 * @param userLocation 用戶位置
 * @returns 排序後的咖啡店列表
 */
export const sortByDistance = (
  coffeeShops: CoffeeShop[],
  userLocation: UserLocation,
): CoffeeShop[] => {
  return coffeeShops.sort((a: CoffeeShop, b: CoffeeShop) => {
    const distanceA = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      parseFloat(a.latitude),
      parseFloat(a.longitude),
    );
    const distanceB = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      parseFloat(b.latitude),
      parseFloat(b.longitude),
    );
    return distanceA - distanceB; // 從近到遠
  });
};

export default useCafeShopsStore;
