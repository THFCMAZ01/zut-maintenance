import { useState } from 'react';
import { login } from '../api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ navigate }) {
  const { loginUser } = useAuth();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data);
      navigate('dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#f3f4f6',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'white', padding: '40px', borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', color: '#1e3a5f', marginBottom: '8px' }}>
          ZUT Maintenance Reporter
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '28px' }}>
          Sign in to your account
        </p>

        {error && (
          <div style={{
            background: '#fee2e2', color: '#991b1b', padding: '10px 14px',
            borderRadius: '6px', marginBottom: '16px', fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Email</label>
          <input
            style={inputStyle}
            type="email"
            placeholder="you@zut.ac.zm"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <label style={labelStyle}>Password</label>
          <input
            style={inputStyle}
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
          No account?{' '}
          <span
            onClick={() => navigate('register')}
            style={{ color: '#1e3a5f', cursor: 'pointer', fontWeight: '600' }}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', marginBottom: '6px',
  fontSize: '14px', fontWeight: '600', color: '#374151'
};
const inputStyle = {
  width: '100%', padding: '10px 12px', marginBottom: '16px',
  border: '1px solid #d1d5db', borderRadius: '6px',
  fontSize: '14px', boxSizing: 'border-box', outline: 'none'
};
const btnStyle = {
  width: '100%', padding: '11px', background: '#1e3a5f',
  color: 'white', border: 'none', borderRadius: '6px',
  fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '4px'
};