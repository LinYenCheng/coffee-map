import { useRef, useState, useEffect, useMemo } from 'react';

import Map from '../containers/CafeMap';

import '../styles/search.scss';
import SearchElastic from '../containers/SearchElastic';
import useCafeShopsStore, { getShops } from '../store/useCafesStore';
import ConditionalRenderer from '../components/ConditionalRenderer';

function Layout() {
  const searchRef = useRef(null);
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bounds, setBounds] = useState({
    northEast: {
      lat: 25.19872829288669,
      lng: 121.66603088378908,
    },
    southWest: {
      lat: 24.927228790288993,
      lng: 121.38519287109376,
    },
  });
  const { checkedConditions } = useCafeShopsStore();

  const boundedCoffeeShops = useMemo(() => {
    return coffeeShops.filter((nowItemCoffee) => {
      const { latitude, longitude } = nowItemCoffee;
      const isSocketFilterEnable = checkedConditions[0].checked === true;
      const isQuietFilterEnable = checkedConditions[1].checked === true;
      const isNetWorkFilterEnable = checkedConditions[2].checked === true;

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
        latitude > bounds?.southWest.lat &&
        longitude > bounds?.southWest.lng &&
        latitude < bounds?.northEast.lat &&
        longitude < bounds?.northEast.lng
      );
    });
  }, [checkedConditions, bounds, coffeeShops]);

  const handleSelect = () => {};

  const search = () => {
    searchRef.current.search();
  };

  useEffect(() => {
    async function getCoffee() {
      setIsLoading(true);
      const coffeeShops = await getShops();
      setCoffeeShops(coffeeShops);
      search();
      setIsLoading(false);
    }
    getCoffee();
  }, []);

  return (
    <div className="app">
      <ConditionalRenderer isShowContent={isLoading}>
        <div className="loading__overlay d-flex align-items-center align-content-center justify-content-center">
          <div className="spinner-grow" role="status" />
        </div>
      </ConditionalRenderer>
      <div className="header"></div>
      <div className="container-fluid p-0 ">
        <div className="row">
          <div className="col-md-4 col-sm-12 result__container p-0">
            <SearchElastic forwardedRef={searchRef} onChange={handleSelect} bounds={bounds} />
          </div>
          <div className="pb-1 col-md-8 col-sm-12 map__container p-0">
            <ConditionalRenderer isShowContent={coffeeShops.length}>
              <Map
                position={{ lng: 121.5598, lat: 25.08 }}
                coffeeShops={boundedCoffeeShops}
                setBounds={setBounds}
                search={search}
              />
            </ConditionalRenderer>
          </div>
        </div>
      </div>
    </div>
  );
}

Layout.defaultProps = {};

export default Layout;
