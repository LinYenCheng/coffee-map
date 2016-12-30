import React, {Component} from 'react';
import './MenuNav.css';

class MenuNav extends Component {
    constructor(props) {
        super(props);
        this.handleChangeChkHsinchu = this.handleChangeChkHsinchu.bind(this);
        this.handleChangeChkTainan = this.handleChangeChkTainan.bind(this);
    }

    handleChangeChkHsinchu(e) {
        console.log(e.target);
        this.props.onChange(e.target);
    }

    handleChangeChkTainan(e) {
        console.log(e.target);
        this.props.onChange(e.target);
    }

    render() {
        const stateChk = this.props.stateChk;        
        return (
            <nav className="navmenu">
                <ul id="nav_ul">
                    <li>
                        <div className="wrap">
                            <div className="li-word">新竹</div>
                            <input type="checkbox" checked={stateChk.chkHsinchu} onChange={this.handleChangeChkHsinchu} id="chkHsinchu"/>
                            <label className="slider-v3" htmlFor="chkHsinchu"></label>
                        </div>
                    </li>
                    <li>
                        <div className="wrap">
                            <div className="li-word">台南</div>
                            <input type="checkbox" checked={stateChk.chkTainan} onChange={this.handleChangeChkTainan} id="chkTainan"/>
                            <label className="slider-v3" htmlFor="chkTainan"></label>
                        </div>
                    </li>
                </ul>
            </nav>
        )
    }
}

export default MenuNav;
