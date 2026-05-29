import { useState, useEffect } from 'react';
import { getReport, addComment } from '../api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

export default function ReportDetailPage({ id, navigate }) {
  const { user } = useAuth();
  const [report, setReport]   = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await getReport(id);
        setReport(res.data);
      } catch {
        setError('Failed to load report');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await addComment(id, comment);
      setReport(prev => ({
        ...prev,
        comments: [...(prev.comments || []), res.data]
      }));
      setComment('');
    } catch {
      alert('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: '80px', color: '#6b7280' }}>
      Loading report...
    </div>
  );

  if (error || !report) return (
    <div style={{ textAlign: 'center', marginTop: '80px', color: '#991b1b' }}>
      {error || 'Report not found'}
    </div>
  );

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 16px' }}>
      <button onClick={() => navigate('dashboard')} style={{
        background: 'none', border: 'none', color: '#1e3a5f',
        cursor: 'pointer', fontSize: '14px', marginBottom: '16px',
        padding: 0, fontWeight: '600'
      }}>
        ← Back to Dashboard
      </button>

      {/* Report card */}
      <div style={{
        background: 'white', borderRadius: '12px', padding: '28px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, color: '#1e3a5f', fontSize: '20px' }}>{report.title}</h2>
          <StatusBadge status={report.status} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Location',     value: report.location },
            { label: 'Category',     value: report.category },
            { label: 'Submitted by', value: report.submitted_by },
            { label: 'Date',         value: new Date(report.created_at).toLocaleDateString() },
          ].map(item => (
            <div key={item.label} style={{
              background: '#f9fafb', padding: '12px', borderRadius: '8px'
            }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600',
                textTransform: 'uppercase', marginBottom: '4px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600',
            textTransform: 'uppercase', marginBottom: '8px' }}>
            Description
          </div>
          <p style={{ margin: 0, color: '#374151', lineHeight: '1.6', fontSize: '15px' }}>
            {report.description}
          </p>
        </div>

        {report.image_url && (
          <div>
            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600',
              textTransform: 'uppercase', marginBottom: '8px' }}>
              Attached Photo
            </div>
            <img
              src={report.image_url}
              alt="Report"
              style={{ width: '100%', borderRadius: '8px', maxHeight: '300px', objectFit: 'cover' }}
            />
          </div>
        )}
      </div>

      {/* Comments */}
      <div style={{
        background: 'white', borderRadius: '12px', padding: '28px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ margin: '0 0 20px', color: '#1e3a5f' }}>
          Comments ({report.comments?.length || 0})
        </h3>

        {report.comments?.length === 0 && (
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px' }}>
            No comments yet.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {report.comments?.map(c => (
            <div key={c.id} style={{
              padding: '14px', borderRadius: '8px',
              background: c.author_role === 'admin' ? '#eff6ff' : '#f9fafb',
              borderLeft: `3px solid ${c.author_role === 'admin' ? '#3b82f6' : '#d1d5db'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: '600', fontSize: '13px', color: '#374151' }}>
                  {c.author}
                  {c.author_role === 'admin' && (
                    <span style={{
                      marginLeft: '6px', fontSize: '10px', background: '#dbeafe',
                      color: '#1e40af', padding: '2px 6px', borderRadius: '999px'
                    }}>
                      Staff
                    </span>
                  )}
                </span>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {new Date(c.created_at).toLocaleDateString()}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}>{c.body}</p>
            </div>
          ))}
        </div>

        {/* Add comment form */}
        <form onSubmit={handleComment}>
          <textarea
            style={{
              width: '100%', padding: '10px 12px', marginBottom: '12px',
              border: '1px solid #d1d5db', borderRadius: '6px',
              fontSize: '14px', boxSizing: 'border-box',
              height: '80px', resize: 'vertical', outline: 'none'
            }}
            placeholder={user.role === 'admin'
              ? 'Add an update or response...'
              : 'Add a comment...'}
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <button type="submit" disabled={submitting || !comment.trim()} style={{
            padding: '10px 24px', background: '#1e3a5f', color: 'white',
            border: 'none', borderRadius: '6px', cursor: 'pointer',
            fontWeight: '600', fontSize: '14px',
            opacity: submitting || !comment.trim() ? 0.6 : 1
          }}>
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>
    </div>
  );
}