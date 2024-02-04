import {
  createHashRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import MapModePage from './pages/MapModePage';

export default function Root() {
  const router = createHashRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<MapModePage />} />
      </>,
    ),
  );
  return (
    <div className="app">
      <div className="header"></div>
      <RouterProvider router={router} />
    </div>
  );
}
