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
        if (item.url) {
          return {
            lat: parseFloat(item.latitude),
            lng: parseFloat(item.longitude),
            popup: `<div><span>${item.name}<br/>${item.address}<br/></span><a href=${item.url}>粉絲專頁</a><br/></div>`,
          };
        }
        return {
          lat: parseFloat(item.latitude),
          lng: parseFloat(item.longitude),
          popup: `<div><span>${item.name}<br/>${item.address}<br/></span></div>`,
        };
      });
    }
    return (
      <div className="app">
        <div className={strClassMenuOpen}>
          <div className="search-container">
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
