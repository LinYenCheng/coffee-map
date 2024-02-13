import { useNavigate, Outlet } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { NO_LIMITED_TIME, REMOTE_WORK } from './types';
import { ROUTE_CAFE_LIST } from './router';

export default function Root() {
  const navigate = useNavigate();
  const items = [
    {
      label: '無限時咖啡廳',
      // icon: 'pi pi-home',
      command: () => {
        navigate(`/${ROUTE_CAFE_LIST}/${NO_LIMITED_TIME}`);
      },
    },
    {
      label: '工作咖啡廳',
      // icon: 'pi pi-star',
      command: () => {
        navigate(`/${ROUTE_CAFE_LIST}/${REMOTE_WORK}`);
      },
    },
    {
      label: '地圖模式',
      // icon: 'pi pi-envelope',
      command: () => {
        navigate('/');
      },
    },
  ];

  return (
    <div className="app">
      <div className="header">
        <Menubar model={items} />
      </div>
      <Outlet />
    </div>
  );
}
