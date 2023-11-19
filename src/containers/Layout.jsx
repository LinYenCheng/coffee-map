import React, { useRef, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';

import Map from '../components/Map';

import '../styles/search.scss';
import { toggleMenu, toggleCondition } from '../actions';
import APICoffee from '../api/APICoffee';
import SearchElastic from '../components/SearchElastic';

// eslint-disable-next-line no-shadow
function Layout({ isMenuOpen, checkedCities, checkedConditions, toggleMenu, toggleCondition }) {
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

  function getStars(num) {
    switch (num) {
      case 5:
        return '★★★★★';
      case 4:
        return '★★★★';
      case 3:
        return '★★★';
      case 2:
        return '★★';
      default:
        return '★';
    }
  }

  function handleSelect(_item) {
    // console.log(_item);
    if (item && _item && item.id !== _item.id) {
      setItem(_item);
    }
    toggleCondition();
  }

  async function getCoffee(nowCheckedCities) {
    setIsLoading(true);
    // console.log('loading');
    const arrResult = await APICoffee.getCoffee(nowCheckedCities);
    // console.log('loading done');
    setIsLoading(false);
    setItems(arrResult);
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
    getCoffee(checkedCities);
  }, [checkedCities]);

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
        } = nowItemCoffee;
        return {
          lat: parseFloat(latitude),
          lng: parseFloat(longitude),
          wifi: wifi > 0,
          socket: socket !== 'no',
          quiet: quiet > 3,
          popup: `<div>
            <span style=${{ fontWeight: 800, fontSize: '16px' }}>${name}</span><br /> 
            <span>
            ${address}<br />
            ${wifi > 0 ? `WIFI穩定: ${getStars(wifi)}` : ''} ${wifi > 0 ? '<br />' : ''}
            ${seat > 0 ? `通常有位:  ${getStars(seat)}` : ''} ${seat > 0 ? '<br />' : ''}
            ${quiet > 0 ? `安靜程度:  ${getStars(quiet)}` : ''} ${quiet > 0 ? '<br />' : ''}
            ${tasty > 0 ? `咖啡好喝:  ${getStars(tasty)}` : ''} ${tasty > 0 ? '<br />' : ''}
            ${cheap > 0 ? `價格便宜:  ${getStars(cheap)}` : ''} ${cheap > 0 ? '<br />' : ''}
            ${music > 0 ? `裝潢音樂:  ${getStars(music)}` : ''} ${music > 0 ? '<br />' : ''}
            </span>
            ${item.url ? `<a href=${item.url}>粉絲專頁</a>` : ''}
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
    isMenuOpen: state.isMenuOpen,
    checkedCities: state.checkedCities,
    checkedConditions: state.checkedConditions,
  };
}

const mapDispatchToProps = (dispatch) => ({
  //
  toggleCondition: () => dispatch(toggleCondition()),
  toggleMenu: () => dispatch(toggleMenu()),
});

Layout.defaultProps = {
  name: 'Gary',
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
