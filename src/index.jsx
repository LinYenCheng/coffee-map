import React from 'react';
import { render } from 'react-dom';
import {
  createHashRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import Layout from './pages/Layout';

import './styles/index.scss';

// FIXME: WORKAROUND
if (!window.process) window.process = {};

const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />} />
    </>,
  ),
);

render(<RouterProvider router={router} />, document.getElementById('root'));
