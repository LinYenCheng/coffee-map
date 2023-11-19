import React from 'react';
import { render } from 'react-dom';
import {
  createHashRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
// Logger with default options
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import Layout from './pages/Layout';

import './styles/index.scss';

import reducer from './reducers';

// FIXME: WORKAROUND
if (!window.process) window.process = {};

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
  applyMiddleware(...middlewares),
  // other store enhancers if any
);
const store = createStore(reducer, enhancer);

const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />} />
    </>,
  ),
);

render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
  document.getElementById('root'),
);
