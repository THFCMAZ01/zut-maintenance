import { useState, useEffect } from 'react';
import { getReports, deleteReport, updateStatus } from '../api';
import { useAuth } from '../context/AuthContext';
import ReportCard from '../components/ReportCard';

export default function Dashboard({ navigate }) {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('All');

useEffect(() => {
    async function load() {
      try {
        const res = await getReports();
        setReports(res.data);
      } catch {
        console.error('Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this report?')) return;
    try {
      await deleteReport(id);
      setReports(prev => prev.filter(r => r.id !== id));
    } catch {
      alert('Failed to delete report');
    }
  }

  async function handleStatusChange(id, status) {
    try {
      await updateStatus(id, status);
      setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch {
      alert('Failed to update status');
    }
  }

  const statuses = ['All', 'Pending', 'In Progress', 'Resolved'];
  const filtered = filter === 'All' ? reports : reports.filter(r => r.status === filter);

  const counts = {
    total:      reports.length,
    pending:    reports.filter(r => r.status === 'Pending').length,
    inProgress: reports.filter(r => r.status === 'In Progress').length,
    resolved:   reports.filter(r => r.status === 'Resolved').length,
  };

  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: '80px', color: '#6b7280' }}>
      Loading reports...
    </div>
  );

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 16px' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total',       value: counts.total,      bg: '#f0f9ff', color: '#0369a1' },
          { label: 'Pending',     value: counts.pending,    bg: '#fef3c7', color: '#92400e' },
          { label: 'In Progress', value: counts.inProgress, bg: '#dbeafe', color: '#1e40af' },
          { label: 'Resolved',    value: counts.resolved,   bg: '#d1fae5', color: '#065f46' },
        ].map(s => (
          <div key={s.label} style={{
            background: s.bg, borderRadius: '10px',
            padding: '20px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: s.color, marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#1e3a5f' }}>
          {user.role === 'admin' ? 'All Reports' : 'My Reports'}
        </h2>
        {user.role === 'student' && (
          <button onClick={() => navigate('new-report')} style={{
            background: '#1e3a5f', color: 'white', border: 'none',
            padding: '10px 20px', borderRadius: '8px',
            cursor: 'pointer', fontWeight: '600'
          }}>
            + New Report
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '6px 16px', borderRadius: '999px', cursor: 'pointer',
            border: '1px solid #d1d5db', fontSize: '13px',
            fontWeight: filter === s ? '700' : '400',
            background: filter === s ? '#1e3a5f' : 'white',
            color: filter === s ? 'white' : '#374151',
          }}>
            {s}
          </button>
        ))}
      </div>

      {/* Reports list */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px', background: 'white',
          borderRadius: '12px', color: '#9ca3af'
        }}>
          {filter === 'All' ? 'No reports yet.' : `No ${filter} reports.`}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(report => (
            <div key={report.id}>
              <ReportCard
                report={report}
                onClick={() => navigate('detail', report.id)}
              />
              {user.role === 'admin' && (
                <div style={{
                  display: 'flex', gap: '8px', padding: '8px 12px',
                  background: '#f9fafb', border: '1px solid #e5e7eb',
                  borderTop: 'none', borderRadius: '0 0 10px 10px',
                  marginTop: '-1px'
                }}>
                  <span style={{ fontSize: '13px', color: '#6b7280', alignSelf: 'center' }}>
                    Status:
                  </span>
                  {['Pending', 'In Progress', 'Resolved'].map(s => (
                    <button key={s} onClick={() => handleStatusChange(report.id, s)} style={{
                      padding: '4px 12px', fontSize: '12px', cursor: 'pointer',
                      borderRadius: '6px', border: '1px solid #d1d5db',
                      background: report.status === s ? '#1e3a5f' : 'white',
                      color: report.status === s ? 'white' : '#374151',
                      fontWeight: report.status === s ? '600' : '400'
                    }}>
                      {s}
                    </button>
                  ))}
                  <button onClick={() => handleDelete(report.id)} style={{
                    marginLeft: 'auto', padding: '4px 12px', fontSize: '12px',
                    cursor: 'pointer', borderRadius: '6px',
                    border: '1px solid #fca5a5',
                    background: '#fee2e2', color: '#991b1b'
                  }}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}