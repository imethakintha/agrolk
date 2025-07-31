import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export default function DriverDashboard() {
  const qc = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['driverProfile'],
    queryFn: () => api.get('/profile/me').then(r => r.data),
  });

  const { data: bookings } = useQuery({
    queryKey: ['driverBookings'],
    queryFn: () => api.get('/bookings?role=driver').then(r => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => api.put('/profile', payload),
    onSuccess: () => qc.invalidateQueries(['driverProfile']),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Driver Dashboard</h2>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Vehicle Info</h3>
        <label>
          Vehicle Type
          <input
            defaultValue={profile?.vehicleType}
            onBlur={(e) => updateMutation.mutate({ vehicleType: e.target.value })}
            className="ml-2 border px-2 py-1"
          />
        </label>
        <label className="block mt-2">
          Rate per km (LKR)
          <input
            type="number"
            defaultValue={profile?.ratePerKm}
            onBlur={(e) => updateMutation.mutate({ ratePerKm: +e.target.value })}
            className="ml-2 border px-2 py-1"
          />
        </label>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Blocked Dates</h3>
        <input
          type="date"
          onChange={(e) => {
            const list = profile?.blockedDates || [];
            updateMutation.mutate({ blockedDates: [...list, e.target.value] });
          }}
          className="border px-2 py-1"
        />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Bookings</h3>
        {bookings?.length ? (
          bookings.map((b) => (
            <div key={b._id} className="border-b py-1">
              {b.date} – {b.farm.name}
            </div>
          ))
        ) : (
          <p>No bookings yet.</p>
        )}
      </div>
    </div>
  );
}