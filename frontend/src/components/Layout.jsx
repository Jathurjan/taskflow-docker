import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen lg:pl-64">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
