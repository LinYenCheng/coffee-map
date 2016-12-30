import React, {Component} from 'react';
import Map from './Map';
import Search from './Search';
import MenuBtn from './MenuBtn';
import MenuNav from './MenuNav';
import './Search.css';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {},
            isMenuOpen: false,
            stateChk: {
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
        var itemCoffee = this.state.item;
        const isMenuOpen = this.state.isMenuOpen;
        const strClassMenuOpen = isMenuOpen
            ? 'menu-open'
            : '';
        const stateChk = this.state.stateChk;
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
                <Map item={itemCoffee}/>
            </div>
        );
    }
}

Layout.defaultProps = {
    name: 'Gary'
};

export default Layout;
