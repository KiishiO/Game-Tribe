import React from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="wrapper">
      <Sidebar />
      {children}
    </div>
  );
};

export default MainLayout;