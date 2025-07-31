import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ className }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };
  return (
    <form onSubmit={handleSubmit} className={className}>
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search farms or activities..."
        className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700">
        Search
      </button>
    </form>
  );
}