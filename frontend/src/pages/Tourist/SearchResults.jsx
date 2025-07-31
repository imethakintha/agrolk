import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import FarmCard from '@/components/FarmCard';

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const lat = params.get('lat');
  const lng = params.get('lng');

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', q, lat, lng],
    queryFn: () =>
      api.get('/search', { params: { q, lat, lng, limit: 12 } }).then((r) => r.data),
  });

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error loading results.</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.farms.map((farm) => (
          <FarmCard key={farm._id} farm={farm} />
        ))}
      </div>
    </div>
  );
}