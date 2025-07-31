import { Link } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';

export default function Home() {
  return (
    <div className="hero min-h-screen bg-green-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-green-700">Discover Sri Lankan Agro-Tourism</h1>
        <p className="mt-4 text-lg text-gray-600">Book authentic farm experiences directly with rural farmers.</p>
        <SearchBar className="mt-8 max-w-xl mx-auto" />
      </div>
    </div>
  );
}