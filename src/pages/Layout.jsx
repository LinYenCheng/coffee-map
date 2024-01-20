import React, { useRef, useState, useEffect, useCallback } from 'react';

import Map from '../containers/CafeMap';

import '../styles/search.scss';
import SearchElastic from '../containers/SearchElastic';
import calculateScore from '../util/calculateScore';
import { getShops, resetConditions } from '../store/useCafesStore';
import ConditionalRenderer from '../components/ConditionalRenderer';

// eslint-disable-next-line no-shadow
function Layout() {
  const searchRef = useRef(null);
  const [itemCoffee, setItem] = useState({
    name: '搜尋想去的咖啡店~',
    address: '顯示地址及粉專',
  });
  const [position, setPosition] = useState({ lng: 121.5598, lat: 25.08 });
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let itemsCoffee = items;
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

  const handleSelect = useCallback(
    (_item) => {
      // // console.log(_item);
      if (itemCoffee && _item && itemCoffee.id !== _item.id) {
        console.log(_item);

        setItem(_item);
      }
      // resetConditions();
    },
    [itemCoffee],
  );

  const search = () => {
    searchRef.current.search();
  };

  const resetItem = () => {
    setItem({
      name: '搜尋想去的咖啡店~',
      address: '顯示地址及粉專',
    });
  };

  useEffect(() => {
    async function getCoffee() {
      setIsLoading(true);
      // console.log('loading');
      const coffeeShops = await getShops();
      // console.log('loading done');
      setIsLoading(false);
      setItems(coffeeShops);
      search();
    }
    getCoffee();
  }, []);

  if (items.length === 0) {
    itemsCoffee = [
      {
        lat: 24.8,
        lng: 121.023,
        popup: '<div><span>目前尚未選擇任何地點<br/>請按左方功能鍵進入選單選擇XD<br/></span></div>',
      },
    ];
  } else {
    itemsCoffee = items
      .filter((nowItemCoffee) => {
        if (nowItemCoffee) {
          const { latitude, longitude } = nowItemCoffee;
          return (
            latitude > bounds?.southWest.lat &&
            longitude > bounds?.southWest.lng &&
            latitude < bounds?.northEast.lat &&
            longitude < bounds?.northEast.lng
          );
        }
        return false;
      })
      .map((nowItemCoffee) => {
        const {
          latitude,
          longitude,
          name,
          address,
          wifi,
          seat,
          quiet,
          tasty,
          cheap,
          music,
          socket,
          url,
          limited_time,
          standing_desk,
        } = nowItemCoffee;
        const score = calculateScore(nowItemCoffee);
        return {
          name,
          score,
          lat: parseFloat(latitude),
          lng: parseFloat(longitude),
          wifi: wifi > 0,
          socket: socket !== 'no',
          quiet: quiet > 3,
          renderChild: () => <span>{name}</span>,
          popup: `
          <div class="card border-none">
            <div class="card__title mb-2">
              <a
                class="h6"
                href=${url}
                target="_blank"
              >
                ${name}
              </a>
              <span class="ms-2 score">${score}</span>
              <i class="pi pi-star-fill score ms-1"></i>
            </div>
            <ul>
              <li>
                 <ol class="mb-2">
                  ${wifi > 3 ? `<li>WIFI</li>` : ''}
                  ${socket !== 'no' ? `<li>插座</li>` : ''}
                  ${limited_time !== 'yes' ? `<li>無限時</li>` : ''}
                  ${standing_desk === 'yes' ? `<li>站位</li>` : ''}
                 </ol>
              </li>
              <li class="mb-2">
                <i class="pi pi-map-marker me-2"></i>
                <span>${address}</span>
              </li>
            </ul>
          </div>`,
        };
      });
  }

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
            {/* <Search items={items} onChange={handleSelect} /> */}
            <SearchElastic forwardedRef={searchRef} onChange={handleSelect} bounds={bounds} />
          </div>
          <div className="pb-1 col-md-8 col-sm-12 map__container p-0">
            <Map
              position={position}
              item={itemCoffee}
              items={itemsCoffee}
              setBounds={setBounds}
              search={search}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

Layout.defaultProps = {
  name: 'Gary',
};

export default Layout;
