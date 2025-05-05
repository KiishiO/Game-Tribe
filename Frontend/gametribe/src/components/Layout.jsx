// Layout.jsx - Main layout component with sidebar
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../assets/styles/Layout.css';

const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;