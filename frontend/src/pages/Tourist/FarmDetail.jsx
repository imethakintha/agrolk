import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { StarIcon } from '@heroicons/react/20/solid';

export default function FarmDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [date, setDate] = useState('');
  const [participants, setParticipants] = useState(1);
  const [guide, setGuide] = useState('');
  const [driver, setDriver] = useState('');

  const {
    data: farm,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['farm', slug],
    queryFn: () => api.get(`/farms/${slug}`).then((r) => r.data),
  });

  const { data: guides } = useQuery({
    queryKey: ['guides'],
    queryFn: () => api.get('/search?role=Guide').then((r) => r.data),
  });

  const { data: drivers } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => api.get('/search?role=Driver').then((r) => r.data),
  });

  if (isLoading) return <div className="p-8">Loading farm...</div>;
  if (error) return <div className="p-8 text-red-600">Farm not found.</div>;

  const handleBook = async () => {
    if (!selectedActivity || !date) return alert('Please pick an activity & date.');
    const payload = {
      farmId: farm._id,
      activityId: selectedActivity.id,
      date,
      participants,
      guideId: guide || undefined,
      driverId: driver || undefined,
    };
    const { data } = await api.post('/bookings', payload);
    navigate(`/checkout/${data.booking._id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* HEADER */}
      <div className="grid md:grid-cols-3 gap-6">
        <img
          src={farm.images[0] || '/placeholder.jpg'}
          alt={farm.name}
          className="w-full h-64 object-cover rounded"
        />
        <div className="md:col-span-2 space-y-2">
          <h1 className="text-3xl font-bold">{farm.name}</h1>
          <p className="text-gray-700">{farm.description}</p>
          <div className="flex items-center space-x-1">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <span>{farm.averageRating ?? 'N/A'} ({farm.reviewCount ?? 0} reviews)</span>
          </div>
        </div>
      </div>

      {/* ACTIVITIES */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Activities</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {farm.activities.map((act) => (
            <div
              key={act.id}
              className={`border rounded p-4 cursor-pointer ${
                selectedActivity?.id === act.id ? 'ring-2 ring-green-500' : ''
              }`}
              onClick={() => setSelectedActivity(act)}
            >
              <h3 className="font-bold">{act.name}</h3>
              <p className="text-sm text-gray-600">{act.description}</p>
              <p className="mt-1">
                <span className="font-semibold">LKR {act.price}</span> / person &bull;{' '}
                {act.duration} min &bull; Capacity {act.capacity}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* BOOKING FORM */}
      <div className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">Book Experience</h2>

        <label className="block">
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </label>

        <label className="block">
          Participants
          <input
            type="number"
            min="1"
            max={selectedActivity?.capacity || 1}
            value={participants}
            onChange={(e) => setParticipants(+e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </label>

        <label className="block">
          Add Guide (optional)
          <select
            value={guide}
            onChange={(e) => setGuide(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">None</option>
            {guides?.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name} – LKR {g.serviceFee ?? 2000}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          Add Driver (optional)
          <select
            value={driver}
            onChange={(e) => setDriver(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">None</option>
            {drivers?.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} – LKR {d.ratePerKm ?? 1500}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={handleBook}
          disabled={!selectedActivity || !date}
          className="w-full bg-green-600 text-white py-2 rounded disabled:bg-gray-400"
        >
          Proceed to Checkout
        </button>
      </div>

      {/* REVIEWS */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Reviews</h2>
        {farm.reviews?.length ? (
          farm.reviews.map((r) => (
            <div key={r._id} className="border-b pb-2">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${i < r.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-800">{r.comment}</p>
              {r.reply && <p className="text-xs text-blue-600 mt-1">Reply: {r.reply}</p>}
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}