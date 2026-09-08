import { useNavigate, Outlet } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { NO_LIMITED_TIME, REMOTE_WORK } from './types';
import { ROUTE_CAFE_LIST } from './constants/route';

export default function Root() {
  const navigate = useNavigate();
  const items = [
    {
      label: '無限時',
      command: () => {
        navigate(`/${ROUTE_CAFE_LIST}/${NO_LIMITED_TIME}`);
      },
    },
    {
      label: '工作咖啡廳',
      command: () => {
        navigate(`/${ROUTE_CAFE_LIST}/${REMOTE_WORK}`);
      },
    },
    {
      label: '地圖模式',
      command: () => {
        navigate('/');
      },
    },
  ];

  const start = (
    <button
      onClick={() => navigate('/')}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0 1rem 0 0',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.05rem',
        color: 'var(--crema)',
        letterSpacing: '0.02em',
        lineHeight: '1',
      }}
    >
      找咖啡
    </button>
  );

  return (
    <div className="app">
      <div className="header">
        <Menubar model={items} start={start} />
      </div>
      <Outlet />
    </div>
  );
}

