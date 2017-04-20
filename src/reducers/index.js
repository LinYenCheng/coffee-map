import { combineReducers } from 'redux';
import stateChk from './stateChk';
import isMenuOpen from './isMenuOpen';
import item from './item';
import items from './items';

const mapApp = combineReducers({ stateChk, isMenuOpen, item, items });

export default mapApp;
