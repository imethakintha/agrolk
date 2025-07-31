import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import FarmCard from '@/components/FarmCard';
import FarmForm from './FarmForm';

export default function FarmerDashboard() {
  const { data: farms, refetch } = useQuery({
    queryKey: ['my-farms'],
    queryFn: () => api.get('/farms?farmer=true').then((r) => r.data),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Farms</h1>
      <FarmForm onSuccess={refetch} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {farms?.map((f) => (
          <FarmCard farm={f} key={f._id} />
        ))}
      </div>
    </div>
  );
}