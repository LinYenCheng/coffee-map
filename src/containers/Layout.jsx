import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Map from '../components/Map';
// import Search from '../components/Search';
import MenuBtn from '../components/MenuBtn';
import MenuNav from './MenuNav';

import '../styles/search.scss';
import { toggleMenu, toggleCondition } from '../actions';
import APICoffee from '../api/APICoffee';
import SearchElastic from '../components/SearchElastic';

// eslint-disable-next-line no-shadow
function Layout({ isMenuOpen, checkedCities, checkedConditions, toggleMenu, toggleCondition }) {
  const [item, setItem] = useState({
    name: '搜尋想去的咖啡店~',
    address: '顯示地址及粉專',
  });
  const [position, setPosition] = useState({ lng: 121.5598, lat: 25.08 });
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemCoffee = item;
  let itemsCoffee = items;
  const strClassMenuOpen = isMenuOpen ? 'menu-open' : '';

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

  function handleHover(_item) {
    if (item && _item && item.id !== _item.id) {
      setItem(_item);
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
    itemsCoffee = items.map((nowItemCoffee) => {
      const { latitude, longitude, name, address, wifi, seat, quiet, tasty, cheap, music } =
        nowItemCoffee;
      return {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
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
      <div className={strClassMenuOpen}>
        <MenuNav toggleMenu={toggleMenu} setPosition={setPosition} />
        <MenuBtn toggleMenu={toggleMenu} />
      </div>
      <div className="container-fluid pt-2 ">
        <div className="row">
          <div className="col-md-5 col-sm-12 result__container">
            {/* <Search items={items} onChange={handleSelect} /> */}
            <SearchElastic
              nowItem={item}
              toggleCondition={toggleCondition}
              checkedConditions={checkedConditions}
              onChange={handleSelect}
              onHover={handleHover}
            />
          </div>
          <div className="pb-1 col-md-7 col-sm-12 map__container">
            <Map
              position={position}
              item={itemCoffee}
              items={itemsCoffee}
              isMenuOpen={isMenuOpen}
              toggleMenu={toggleMenu}
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
