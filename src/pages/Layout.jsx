import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Map from '../components/Map';

import '../styles/search.scss';
import { toggleCondition } from '../actions';
import SearchElastic from '../components/SearchElastic';
import calculateScore from '../util/calculateScore';
import { getShops } from '../store/useCafesStore';

// eslint-disable-next-line no-shadow
function Layout({ checkedConditions, toggleCondition }) {
  const searchRef = useRef(null);
  const [item, setItem] = useState({
    name: '搜尋想去的咖啡店~',
    address: '顯示地址及粉專',
  });
  const [position, setPosition] = useState({ lng: 121.5598, lat: 25.08 });
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemCoffee = item;
  let itemsCoffee = items;
  const [bounds, setBounds] = useState(null);

  let blockLoading = '';

  function handleSelect(_item) {
    // console.log(_item);
    if (item && _item && item.id !== _item.id) {
      setItem(_item);
    }
    toggleCondition();
  }

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
    const { northEast, southWest } = bounds;
    itemsCoffee = items
      .filter((nowItemCoffee) => {
        const { latitude, longitude } = nowItemCoffee;
        return (
          latitude > southWest.lat &&
          longitude > southWest.lng &&
          latitude < northEast.lat &&
          longitude < northEast.lng
        );
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

  if (isLoading) {
    blockLoading = (
      <div className="loading__overlay">
        <div className="loading__content">
          <div className="loader">Loading...</div>
        </div>
      </div>
    );
  }
  return (
    <div className="app">
      {blockLoading}
      <div className="header"></div>
      <div className="container-fluid p-0 ">
        <div className="row">
          <div className="col-md-4 col-sm-12 result__container p-0">
            {/* <Search items={items} onChange={handleSelect} /> */}
            <SearchElastic
              forwardedRef={searchRef}
              nowItem={item}
              toggleCondition={toggleCondition}
              checkedConditions={checkedConditions}
              onChange={handleSelect}
              onHover={handleSelect}
              bounds={bounds}
            />
          </div>
          <div className="pb-1 col-md-8 col-sm-12 map__container p-0">
            <Map
              checkedConditions={checkedConditions}
              position={position}
              item={itemCoffee}
              items={itemsCoffee}
              setBounds={setBounds}
              search={search}
              resetItem={resetItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    checkedConditions: state.checkedConditions,
  };
}

const mapDispatchToProps = (dispatch) => ({
  toggleCondition: () => dispatch(toggleCondition()),
});

Layout.defaultProps = {
  name: 'Gary',
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
