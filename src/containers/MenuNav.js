import React from 'react';
import { connect } from 'react-redux';
import '../styles/MenuNav.css';
import SelectPlace from '../components/SelectPlace';
import { toggleCheck } from '../actions';

const MenuNav = ({ stateChk, dispatch }) => (
  <nav className="navmenu">
    <ul id="nav_ul">
      <SelectPlace
        isSelected={stateChk.chkTaipei} place="台北" id="chkTaipei"
        onChange={() => { dispatch(toggleCheck({ chkTaipei: !stateChk.chkTaipei })); }}
      />
      <SelectPlace
        isSelected={stateChk.chkHsinchu} place="新竹" id="chkHsinchu"
        onChange={() => { dispatch(toggleCheck({ chkHsinchu: !stateChk.chkHsinchu })); }}
      />
      <SelectPlace
        isSelected={stateChk.chkTainan} place="台南" id="chkTainan"
        onChange={() => { dispatch(toggleCheck({ chkTainan: !stateChk.chkTainan })); }}
      />
    </ul>
  </nav>
);

function mapStateToProps(state) {
  return { stateChk: state.stateChk };
}

export default connect(mapStateToProps)(MenuNav);
