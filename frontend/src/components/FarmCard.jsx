import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid';

export default function FarmCard({ farm }) {
  return (
    <Link to={`/farm/${farm.slug}`} className="block rounded-lg shadow hover:shadow-lg">
      <img
        src={farm.images[0] || '/placeholder.jpg'}
        alt={farm.name}
        className="w-full h-40 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg">{farm.name}</h3>
        <p className="text-sm text-gray-600">{farm.description.slice(0, 60)}...</p>
        <div className="flex items-center mt-2">
          <StarIcon className="h-4 w-4 text-yellow-400" />
          <span className="ml-1 text-sm">{farm.averageRating || 'N/A'}</span>
        </div>
      </div>
    </Link>
  );
}