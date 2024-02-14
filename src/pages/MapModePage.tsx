import { useState, useEffect, useRef } from 'react';

import Map from '../containers/CafeMap';
import SearchElastic from '../containers/SearchElastic';
import SearchForm from '../components/Search/SearchForm';
import ConditionalRenderer from '../components/ConditionalRenderer';

import useCafeShopsStore, { getShops, searchWithKeyword } from '../store/useCafesStore';

import ConditionFilters from '../components/Search/ConditionFilters';
import { CoffeeShop } from '../types';
import { DISABLE_CLUSTER_LEVEL } from '../constants/config';
import ErrorBoundary from '../components/ErrorBoundary';

function MapModePage() {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectItem, setSelectItem] = useState<any>(null);
  const { coffeeShops } = useCafeShopsStore();

  const handleSelect = (item: CoffeeShop) => {
    const map = mapRef.current as any;

    if (!map) {
      return;
    }

    if (item) {
      map.setView(
        { lng: parseFloat(item.longitude), lat: parseFloat(item.latitude) },
        map.getZoom() >= DISABLE_CLUSTER_LEVEL ? map.getZoom() : DISABLE_CLUSTER_LEVEL,
      );
    }
    setTimeout(() => {
      setSelectItem(item);
    }, 250);
  };

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
      <div className="container-fluid map-mode">
        <div className="row">
          <div className="col-md-4 col-sm-12 result__container p-0">
            <div className="search-container search-container--absolute">
              <SearchForm />
            </div>
            <div className="desktop-hide p-2 w-100 d-flex  align-items-center align-content-center justify-content-center border-bottom">
              <ConditionFilters />
            </div>
            <ErrorBoundary>
              <SearchElastic onChange={handleSelect} />
            </ErrorBoundary>
          </div>
          <ConditionalRenderer isShowContent={window.innerWidth > 768}>
            <div className="col-md-8 col-sm-12 map__container p-0">
              <ConditionalRenderer isShowContent={coffeeShops.length > 0}>
                <ErrorBoundary>
                  <Map
                    position={{ lng: 121.5598, lat: 25.08 }}
                    selectItem={selectItem}
                    setSelectItem={handleSelect}
                    ref={mapRef}
                  />
                </ErrorBoundary>
              </ConditionalRenderer>
            </div>
          </ConditionalRenderer>
        </div>
      </div>
    </>
  );
}

export default MapModePage;
