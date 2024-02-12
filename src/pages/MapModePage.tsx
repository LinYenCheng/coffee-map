import { useState, useEffect, useMemo, useCallback } from 'react';

import Map from '../containers/CafeMap';
import SearchElastic from '../containers/SearchElastic';
import SearchForm from '../components/Search/SearchForm';
import ConditionalRenderer from '../components/ConditionalRenderer';

import useCafeShopsStore, { getShops, searchWithKeyword } from '../store/useCafesStore';

import { CoffeeShop } from '../types';
import ConditionFilters from '../components/Search/ConditionFilters';

function MapModePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { bounds, filterConditions, coffeeShops } = useCafeShopsStore();

  const boundedCoffeeShops = useMemo(() => {
    return coffeeShops.filter((nowItemCoffee: CoffeeShop) => {
      const { latitude, longitude } = nowItemCoffee;
      const isSocketFilterEnable = filterConditions[0].checked === true;
      const isQuietFilterEnable = filterConditions[1].checked === true;
      const isNetWorkFilterEnable = filterConditions[2].checked === true;

      if (!nowItemCoffee) return false;

      if (isSocketFilterEnable && !nowItemCoffee.socket) {
        return false;
      }

      if (isQuietFilterEnable && !nowItemCoffee.quiet) {
        return false;
      }

      if (isNetWorkFilterEnable && !nowItemCoffee.wifi) {
        return false;
      }

      return (
        parseFloat(latitude) > bounds?.southWest.lat &&
        parseFloat(longitude) > bounds?.southWest.lng &&
        parseFloat(latitude) < bounds?.northEast.lat &&
        parseFloat(longitude) < bounds?.northEast.lng
      );
    });
  }, [filterConditions, bounds, coffeeShops]);

  const handleSelect = () => {};

  useEffect(() => {
    async function getCoffee() {
      setIsLoading(true);
      await getShops();
      setIsLoading(false);
    }
    getCoffee();
  }, []);

  useEffect(() => {
    searchWithKeyword('');
  }, [coffeeShops]);

  return (
    <>
      <ConditionalRenderer isShowContent={isLoading}>
        <div className="loading__overlay d-flex align-items-center align-content-center justify-content-center">
          <div className="spinner-grow" role="status" />
        </div>
      </ConditionalRenderer>
      <div className="container-fluid p-0 map-mode">
        <div className="row">
          <div className="col-md-4 col-sm-12 result__container p-0">
            <div className="search-container search-container--absolute">
              <SearchForm />
            </div>
            <div className="desktop-hide p-2 w-100 d-flex  align-items-center align-content-center justify-content-center border-bottom">
              <ConditionFilters />
            </div>
            <SearchElastic onChange={handleSelect} />
          </div>
          <div className="col-md-8 col-sm-12 map__container p-0">
            <ConditionalRenderer isShowContent={coffeeShops.length > 0}>
              <Map position={{ lng: 121.5598, lat: 25.08 }} coffeeShops={boundedCoffeeShops} />
            </ConditionalRenderer>
          </div>
        </div>
      </div>
    </>
  );
}

export default MapModePage;
