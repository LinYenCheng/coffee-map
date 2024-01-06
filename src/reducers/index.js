import { combineReducers } from 'redux';

import item from './item';

import checkedConditions from './checkedConditions';

const mapApp = combineReducers({
  checkedConditions,
  item,
});

export default mapApp;
