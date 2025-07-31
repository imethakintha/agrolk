import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Tourist');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const { data } = await api.post(endpoint, { email, password, role });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      if (data.user.role === 'Admin') navigate('/admin/dashboard');
      else if (['Farmer', 'Guide', 'Driver'].includes(data.user.role))
        navigate('/provider/dashboard');
      else navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Tourist">Tourist</option>
          <option value="Farmer">Farmer</option>
          <option value="Guide">Guide</option>
          <option value="Driver">Driver</option>
        </select>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="text-green-600 underline"
        >
          {isRegister ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  );
}