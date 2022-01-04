import { combineReducers } from 'redux';

import isMenuOpen from './isMenuOpen';
import item from './item';
import items from './items';

import checkedCities from './checkedCities';
import checkedConditions from './checkedConditions';

const mapApp = combineReducers({
  checkedCities,
  checkedConditions,
  isMenuOpen,
  item,
  items,
});

export default mapApp;
