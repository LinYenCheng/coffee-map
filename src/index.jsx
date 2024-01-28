import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createHashRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import Layout from './pages/Layout';

import './styles/index.scss';

const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />} />
    </>,
  ),
);

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<RouterProvider router={router} />);
