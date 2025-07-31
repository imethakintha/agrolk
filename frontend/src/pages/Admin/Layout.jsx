import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      <nav className="w-64 bg-gray-800 text-white p-4 space-y-2">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `block px-2 py-1 rounded ${isActive ? 'bg-green-600' : ''}`
          }
        >
          Dashboard
        </NavLink>
      </nav>
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}