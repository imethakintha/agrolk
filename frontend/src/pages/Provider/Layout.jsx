import { NavLink, Outlet } from 'react-router-dom';

export default function ProviderLayout() {
  const role = localStorage.getItem('role');
  return (
    <div className="flex h-screen">
      <nav className="w-56 bg-gray-100 p-4 space-y-2">
        <h2 className="font-bold">{role} Dashboard</h2>
        <NavLink
          to="/provider/dashboard"
          className={({ isActive }) =>
            `block px-2 py-1 rounded ${isActive ? 'bg-green-500 text-white' : ''}`
          }
        >
          Overview
        </NavLink>
      </nav>
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}