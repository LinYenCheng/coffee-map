import { Route, Routes, createHashRouter, createRoutesFromElements } from 'react-router-dom';

import Root from './Root';

import MapModePage from './pages/MapModePage';
import ListModePage from './pages/ListModePage';

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="" element={<MapModePage />} />
      <Route path="cafe-list/:condition" element={<ListModePage />} />
    </Route>,
  ),
);

export default router;
