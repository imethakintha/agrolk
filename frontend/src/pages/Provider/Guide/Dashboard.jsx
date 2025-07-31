import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export default function GuideDashboard() {
  const qc = useQueryClient();
  const [blockedDates, setBlockedDates] = useState([]);

  // Profile
  const { data: profile } = useQuery({
    queryKey: ['guideProfile'],
    queryFn: () => api.get('/profile/me').then(r => r.data),
  });

  // Bookings
  const { data: bookings } = useQuery({
    queryKey: ['guideBookings'],
    queryFn: () => api.get('/bookings?role=guide').then(r => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => api.put('/profile', payload),
    onSuccess: () => qc.invalidateQueries(['guideProfile']),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Guide Dashboard</h2>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Profile</h3>
        <p>Name: {profile?.name}</p>
        <p>Languages: {profile?.languages?.join(', ')}</p>
        <label className="block mt-2">
          Service Fee (LKR)
          <input
            type="number"
            defaultValue={profile?.serviceFee}
            onBlur={(e) => updateMutation.mutate({ serviceFee: +e.target.value })}
            className="ml-2 border px-2 py-1"
          />
        </label>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Blocked Dates</h3>
        <input
          type="date"
          onChange={(e) => setBlockedDates([...blockedDates, e.target.value])}
          className="border px-2 py-1"
        />
        <button
          onClick={() => updateMutation.mutate({ blockedDates })}
          className="ml-2 bg-green-600 text-white px-3 py-1 rounded"
        >
          Save
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Upcoming Bookings</h3>
        {bookings?.length ? (
          <ul>
            {bookings.map((b) => (
              <li key={b._id} className="border-b py-2">
                <span>{b.date}</span> – <span>{b.farm.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings yet.</p>
        )}
      </div>
    </div>
  );
}