import { Route, createHashRouter, createRoutesFromElements } from 'react-router-dom';
import Root from './Root';

import MapModePage from './pages/MapModePage';
import ListModePage from './pages/ListModePage';
import { ROUTE_CAFE_LIST } from './constants/route';

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="" element={<MapModePage />} />
      <Route path={`${ROUTE_CAFE_LIST}/:condition`} element={<ListModePage />} />
    </Route>,
  ),
);

export default router;
