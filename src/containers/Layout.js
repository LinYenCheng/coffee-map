import React, { Component } from 'react';
import { connect } from 'react-redux';
import Map from '../components/Map';
import Search from '../components/Search';
import MenuBtn from '../components/MenuBtn';
import MenuNav from './MenuNav';
import '../styles/Search.css';
import dataMockTaipei from '../api/MockTaipei';
import dataMockHsinchu from '../api/MockHsinchu';
import dataMockTainan from '../api/MockTainan';
import { toggleMenu } from '../actions';

function getStars(num) {
  switch (num) {
    case 5:
      return '★★★★★';
      break;
    case 4:
      return '★★★★';
      break;
    case 3:
      return '★★★';
      break;
    case 2:
      return '★★';
      break;
    default:
      return '★';
      break;
  }
 
}

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {
        name: '搜尋想去的咖啡店~',
        address: '顯示地址及粉專',
      },
      items: [],
      isMenuOpen: false,
      stateChk: {
        chkTaipei: false,
        chkHsinchu: true,
        chkTainan: false,
      },
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(_item) {
    this.setState(prevState => ({ item: _item, isMenuOpen: prevState.isMenuOpen }));
  }

  render() {
    const { isMenuOpen, stateChk, toggleMenu } = this.props;
    const itemCoffee = this.state.item;
    let itemsCoffee = [];
    const strClassMenuOpen = isMenuOpen
      ? 'menu-open'
      : '';
    let arrResult = [];
    arrResult.length = 0;
    if (stateChk.chkTaipei) {
      arrResult = arrResult.concat(dataMockTaipei);
    }
    if (stateChk.chkHsinchu) {
      arrResult = arrResult.concat(dataMockHsinchu);
    }
    if (stateChk.chkTainan) {
      arrResult = arrResult.concat(dataMockTainan);
    }

    if (arrResult.length === 0) {
      itemsCoffee = [
        {
          lat: 24.8,
          lng: 121.023,
          popup: '<div><span>目前尚未選擇任何地點<br/>請按左方功能鍵進入選單選擇XD<br/></span></div>',
        },
      ];
    } else {
      itemsCoffee = arrResult.map((item) => {
          return {
            lat: parseFloat(item.latitude),
            lng: parseFloat(item.longitude),
            popup: `<div>
            <span style=${{fontWeight:800, fontSize:'16px'}}>${item.name}</span><br /> 
            <span>
            ${item.address}<br />
            ${item.wifi > 0?  `WIFI穩定: ${getStars(item.wifi)}`  : ''} ${item.wifi > 0?  '<br />'  : ''}
            ${item.seat > 0?  `通常有位:  ${getStars(item.seat)}`  : ''} ${item.seat > 0?  '<br />'  : ''}
            ${item.quiet > 0? `安靜程度:  ${getStars(item.quiet)}`  : ''} ${item.quiet > 0?  '<br />'  : ''}
            ${item.tasty > 0? `咖啡好喝:  ${getStars(item.tasty)}`  : ''} ${item.tasty > 0?  '<br />'  : ''}
            ${item.cheap > 0? `價格便宜:  ${getStars(item.cheap)}`  : ''} ${item.cheap > 0?  '<br />'  : ''}
            ${item.music > 0? `裝潢音樂:  ${getStars(item.music)}`  : ''} ${item.music > 0?  '<br />'  : ''}
            </span>
            ${item.url?`<a href=${item.url}>粉絲專頁</a>`:''}
          </div>`
          };
      });
    }
    return (
      <div className="app">
        <div className={strClassMenuOpen}>
          <div className="search-container search__result">
            <Search stateChk={stateChk} onChange={this.handleSelect} />
            <button className="btn btnSearch">
              <svg viewBox="0 0 100 100">
                <circle id="circle" cx="45" cy="45" r="30" />
                <path id="line" d="M45,45 L100,100" />
              </svg>
            </button>
          </div>
          <MenuNav />
          <MenuBtn toggleMenu={toggleMenu} />
        </div>
        <Map
          item={itemCoffee} items={itemsCoffee}
          isMenuOpen={isMenuOpen} toggleMenu={toggleMenu}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { isMenuOpen: state.isMenuOpen, stateChk: state.stateChk };
}

const mapDispatchToProps = dispatch => ({
  //
  toggleMenu: () => (
    dispatch(toggleMenu())
  ),
});

Layout.defaultProps = {
  name: 'Gary',
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
