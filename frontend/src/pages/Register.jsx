import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Tourist',                // default
    // Farmer extras
    farmName: '',
    farmDesc: '',
    lat: 7.2914,
    lng: 80.6337,
    // Guide extras
    licenseNo: '',
    languages: '',
    serviceFee: 2000,
    // Driver extras
    vehicleType: '',
    vehicleNumber: '',
    ratePerKm: 1500,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Build payload dynamically
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        ...(form.role === 'Farmer' && {
          farmName: form.farmName,
          farmDesc: form.farmDesc,
          location: { type: 'Point', coordinates: [parseFloat(form.lng), parseFloat(form.lat)] },
        }),
        ...(form.role === 'Guide' && {
          licenseNo: form.licenseNo,
          languages: form.languages.split(',').map((l) => l.trim()),
          serviceFee: parseInt(form.serviceFee, 10),
        }),
        ...(form.role === 'Driver' && {
          vehicleType: form.vehicleType,
          vehicleNumber: form.vehicleNumber,
          ratePerKm: parseInt(form.ratePerKm, 10),
        }),
      };

      const { data } = await api.post('/auth/register', payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);

      // Redirect
      if (data.user.role === 'Admin') navigate('/admin/dashboard');
      else if (['Farmer', 'Guide', 'Driver'].includes(data.user.role))
        navigate('/provider/dashboard');
      else navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          minLength={6}
          className="w-full border px-3 py-2 rounded"
        />

        {/* Role selector */}
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Tourist">Tourist</option>
            <option value="Farmer">Farmer</option>
            <option value="Guide">Guide</option>
            <option value="Driver">Driver</option>
          </select>
        </div>

        {/* Farmer extras */}
        {form.role === 'Farmer' && (
          <>
            <input
              name="farmName"
              value={form.farmName}
              onChange={handleChange}
              placeholder="Farm Name"
              required
              className="w-full border px-3 py-2 rounded"
            />
            <textarea
              name="farmDesc"
              value={form.farmDesc}
              onChange={handleChange}
              placeholder="Farm Description"
              required
              className="w-full border px-3 py-2 rounded"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                name="lat"
                type="number"
                step="0.0001"
                value={form.lat}
                onChange={handleChange}
                placeholder="Latitude"
                className="border px-3 py-2 rounded"
              />
              <input
                name="lng"
                type="number"
                step="0.0001"
                value={form.lng}
                onChange={handleChange}
                placeholder="Longitude"
                className="border px-3 py-2 rounded"
              />
            </div>
          </>
        )}

        {/* Guide extras */}
        {form.role === 'Guide' && (
          <>
            <input
              name="licenseNo"
              value={form.licenseNo}
              onChange={handleChange}
              placeholder="License Number"
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              name="languages"
              value={form.languages}
              onChange={handleChange}
              placeholder="Languages (comma separated)"
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              name="serviceFee"
              type="number"
              value={form.serviceFee}
              onChange={handleChange}
              placeholder="Service Fee (LKR)"
              className="w-full border px-3 py-2 rounded"
            />
          </>
        )}

        {/* Driver extras */}
        {form.role === 'Driver' && (
          <>
            <input
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
              placeholder="Vehicle Type"
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              name="vehicleNumber"
              value={form.vehicleNumber}
              onChange={handleChange}
              placeholder="Vehicle Number"
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              name="ratePerKm"
              type="number"
              value={form.ratePerKm}
              onChange={handleChange}
              placeholder="Rate per Km (LKR)"
              className="w-full border px-3 py-2 rounded"
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded disabled:bg-gray-400"
        >
          {loading ? 'Registering…' : 'Register'}
        </button>
      </form>
    </div>
  );
}