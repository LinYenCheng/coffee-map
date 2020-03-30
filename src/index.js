/* eslint-disable  */
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
// Logger with default options
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import Layout from './containers/Layout';

import './styles/index.scss';

import reducer from './reducers';

const loggerMiddleware = createLogger();
const middlewares =
  process.env.NODE_ENV === 'development' ? [loggerMiddleware, thunkMiddleware] : [thunkMiddleware];
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares)
  // other store enhancers if any
);
const store = createStore(reducer, enhancer);

render(
  <Provider store={store}>
    <Layout />
  </Provider>,
  document.getElementById('root')
);

// dynamic User by Hux
var _gaId = 'UA-106834789-1';
var _gaDomain = 'linyencheng.github.io';

if (window.location.host === _gaDomain) {
  // Originial
  (function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    (i[r] =
      i[r] ||
      function() {
        (i[r].q = i[r].q || []).push(arguments);
      }),
      (i[r].l = 1 * new Date());
    (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

  if (window.ga) {
    const { ga } = window;
    ga('create', _gaId, _gaDomain);
    ga('send', 'pageview');
  }
}
