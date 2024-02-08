import { useNavigate, Outlet } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';

export default function Root() {
  const navigate = useNavigate();
  const items = [
    {
      label: '無限時咖啡廳',
      // icon: 'pi pi-home',
      command: () => {
        navigate('/cafe-list/no-limited-time');
      },
    },
    {
      label: '工作咖啡廳',
      // icon: 'pi pi-star',
      command: () => {
        navigate('/cafe-list/remote-work');
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
