import { useAuth } from '../context/AuthContext';

export default function Navbar({ navigate }) {
  const { user, logoutUser } = useAuth();

  return (
    <nav style={{
      background: '#1e3a5f', color: 'white',
      padding: '0 24px', height: '60px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <span
        onClick={() => navigate('dashboard')}
        style={{ fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}
      >
        ZUT Maintenance Reporter
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '14px' }}>
          {user?.name} ({user?.role})
        </span>
        {user?.role === 'student' && (
          <button onClick={() => navigate('new-report')} style={{
            background: '#f59e0b', color: 'white', border: 'none',
            padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            + New Report
          </button>
        )}
        <button onClick={logoutUser} style={{
          background: 'transparent', color: 'white',
          border: '1px solid white', padding: '6px 14px',
          borderRadius: '6px', cursor: 'pointer'
        }}>
          Logout
        </button>
      </div>
    </nav>
  );
}