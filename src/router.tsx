import { Route, Routes, createHashRouter, createRoutesFromElements } from 'react-router-dom';

import Root from './Root';

import MapModePage from './pages/MapModePage';
import ListModePage from './pages/ListModePage';

export const ROUTE_CAFE_LIST = 'cafe-list';

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="" element={<MapModePage />} />
      <Route path={`${ROUTE_CAFE_LIST}/:condition`} element={<ListModePage />} />
    </Route>,
  ),
);

export default router;
