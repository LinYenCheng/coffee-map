import React from 'react';
import {render} from 'react-dom';
import Layout from './containers/Layout';
import './index.css';
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import reducer from './reducers'

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

render(
    <Provider store={store}>
    <Layout/>
</Provider>, document.getElementById('root'));
