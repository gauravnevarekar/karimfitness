import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithPhoneAndPassword } from '../lib/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await loginWithPhoneAndPassword(form.phone, form.password);
      if (result.profile.force_password_change) {
        navigate('/change-password');
        return;
      }
      navigate(result.profile.role === 'owner' ? '/owner' : '/member');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <main className="mx-auto max-w-md p-4">
      <h1 className="mb-6 mt-12 text-2xl font-bold">Smart Gym Control</h1>
      <form onSubmit={submit} className="card space-y-4">
        <label className="block text-sm font-medium">
          Phone
          <input
            className="mt-1 w-full rounded-xl border p-3"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            className="mt-1 w-full rounded-xl border p-3"
            type="password"
            value={form.password}
            onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
            required
          />
        </label>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button className="w-full rounded-xl bg-slate-900 p-3 font-semibold text-white" type="submit">
          Login
        </button>
      </form>
    </main>
  );
}
