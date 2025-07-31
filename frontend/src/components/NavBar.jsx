import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function NavBar() {
  const [token] = useState(localStorage.getItem('token'));
  const role = localStorage.getItem('role');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  return (
    <nav className="bg-green-600 text-white px-4 py-3 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold">AgroLK</Link>

      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/search" className="hover:underline">Search</Link>

        {!token ? (
          <Link to="/login" className="hover:underline">Login</Link>
        ) : (
          <>
            {role === 'Admin' && (
              <Link to="/admin/dashboard" className="hover:underline">Admin</Link>
            )}
            {['Farmer', 'Guide', 'Driver'].includes(role) && (
              <Link to="/provider/dashboard" className="hover:underline">Dashboard</Link>
            )}
            <button onClick={logout} className="hover:underline">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}