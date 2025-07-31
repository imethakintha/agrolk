import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useState } from 'react';

export default function AdminDashboard() {
  const qc = useQueryClient();

  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => api.get('/admin/analytics').then(r => r.data),
  });

  const { data: pendingUsers } = useQuery({
    queryKey: ['pendingUsers'],
    queryFn: () => api.get('/admin/users?role=Guide&status=pending').then(r => r.data),
  });

  const verifyMutation = useMutation({
    mutationFn: (id) => api.patch(`/admin/users/${id}/verify`),
    onSuccess: () => qc.invalidateQueries(['pendingUsers', 'analytics']),
  });

  const toggleFarmMutation = useMutation({
    mutationFn: ({ id, active }) => api.patch(`/admin/farms/${id}/visibility`, { isActive: active }),
    onSuccess: () => qc.invalidateQueries(['analytics']),
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/reviews/${id}`),
    onSuccess: () => qc.invalidateQueries(['analytics']),
  });

  const pieData = [
    { name: 'Farmers', value: analytics?.totalUsers - analytics?.pendingVerifications || 0 },
    { name: 'Pending Verifications', value: analytics?.pendingVerifications || 0 },
  ];
  const pieColors = ['#10b981', '#f87171'];

  if (!analytics) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: analytics.totalUsers },
          { label: 'Farms', value: analytics.totalFarms },
          { label: 'Bookings', value: analytics.totalBookings },
          { label: 'Revenue (LKR)', value: analytics.totalRevenue },
        ].map((k) => (
          <div key={k.label} className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600">{k.label}</p>
            <p className="text-2xl font-bold">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Users Distribution</h3>
          <PieChart width={200} height={200}>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Pending Verifications</h3>
        {pendingUsers?.length ? (
          pendingUsers.map((u) => (
            <div key={u._id} className="flex justify-between items-center border-b py-2">
              <span>{u.name} - {u.licenseNo || u.vehicleNumber}</span>
              <button
                onClick={() => verifyMutation.mutate(u._id)}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                Verify
              </button>
            </div>
          ))
        ) : (
          <p>None</p>
        )}
      </div>
    </div>
  );
}