import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export default function FarmForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: { type: 'Point', coordinates: [0, 0] },
    activities: [],
  });
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload) =>
      api.post('/farms', payload, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => {
      qc.invalidateQueries(['my-farms']);
      onSuccess();
      setForm({ name: '', description: '', location: { type: 'Point', coordinates: [0, 0] }, activities: [] });
    },
  });

  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    mutation.mutate({ ...form, images: files, data: JSON.stringify(form) });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Add New Farm</h2>
      <input
        placeholder="Farm name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border px-3 py-2 mb-2"
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full border px-3 py-2 mb-2"
      />
      <input
        type="file"
        multiple
        onChange={handleFile}
        className="mb-2"
      />
    </div>
  );
}