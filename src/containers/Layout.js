import React, {Component} from 'react';
import Map from '../components/Map';
import Search from '../components/Search';
import MenuBtn from '../components/MenuBtn';
import MenuNav from '../components/MenuNav';
import '../components/Search.css';
import dataMockTaipei from '../api/MockTaipei';
import dataMockHsinchu from '../api/MockHsinchu';
import dataMockTainan from '../api/MockTainan';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {
                name: '搜尋想去的咖啡店~',
                address:'顯示地址及粉專'
            },
            items: [],
            isMenuOpen: false,
            stateChk: {
                chkTaipei: false,
                chkHsinchu: true,
                chkTainan: false
            }
        };
        this.handleSelect = this.handleSelect.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleChkbox = this.handleChkbox.bind(this);
    }

    handleSelect(_item) {
        this.setState((prevState, props) => {
            return {item: _item, isMenuOpen: prevState.isMenuOpen};
        });
    }

    handleMenuClick() {
        this.setState((prevState, props) => {
            return {
                item: prevState.item,
                isMenuOpen: !prevState.isMenuOpen
            };
        });
    }

    handleChkbox(target) {
        var _stateChk = this.state.stateChk;
        _stateChk[target.id] = !_stateChk[target.id];
        this.setState(_stateChk);
    }

    render() {
        let itemCoffee = this.state.item;
        let itemsCoffee = [];
        const isMenuOpen = this.state.isMenuOpen;
        const strClassMenuOpen = isMenuOpen
            ? 'menu-open'
            : '';
        const stateChk = this.state.stateChk;
        let arrResult = [];
        if (stateChk.chkTaipei) {
            arrResult = arrResult.concat(dataMockTaipei);
        }
        if (stateChk.chkHsinchu) {
            arrResult = arrResult.concat(dataMockHsinchu);
        }
        if (stateChk.chkTainan) {
            arrResult = arrResult.concat(dataMockTainan);
        }
        itemsCoffee = arrResult.map(function(item) {
          if(item.url){
            return {
                lat: parseFloat(item.latitude),
                lng: parseFloat(item.longitude),
                popup: "<div><span>" + item.name + "<br/>" + item.address + "<br/></span><a href="+item.url+">粉絲專頁</a><br/></div>"
            };
          }else{
            return {
                lat: parseFloat(item.latitude),
                lng: parseFloat(item.longitude),
                popup: "<div><span>" + item.name + "<br/>" + item.address + "<br/></span></div>"
            };
          }

        });
        return (
            <div className="app">
                <div className={strClassMenuOpen}>
                    <div className="search-container">
                        <Search stateChk={stateChk} onChange={this.handleSelect}/>
                        <button className="btn btnSearch">
                            <svg viewBox="0 0 100 100">
                                <circle id="circle" cx="45" cy="45" r="30"></circle>
                                <path id="line" d="M45,45 L100,100"></path>
                            </svg>
                        </button>
                    </div>
                    <MenuNav stateChk={stateChk} onChange={this.handleChkbox}/>
                    <MenuBtn onChange={this.handleMenuClick}/>
                </div>
                <Map item={itemCoffee} items={itemsCoffee}/>
            </div>
        );
    }
}

Layout.defaultProps = {
    name: 'Gary'
};

export default Layout;
