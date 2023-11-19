import { combineReducers } from 'redux';

import item from './item';
import items from './items';

import checkedConditions from './checkedConditions';

const mapApp = combineReducers({
  checkedConditions,
  item,
  items,
});

export default mapApp;
