import { useState } from 'react';
import { createReport } from '../api';

const CATEGORIES = ['Electrical', 'Plumbing', 'Furniture', 'IT Equipment', 'Structural', 'Other'];

export default function NewReportPage({ navigate }) {
  const [form, setForm] = useState({
    title: '', description: '', location: '', category: 'Electrical'
  });
  const [image, setImage]   = useState(null);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title',       form.title);
      formData.append('description', form.description);
      formData.append('location',    form.location);
      formData.append('category',    form.category);
      if (image) formData.append('image', image);

      await createReport(formData);
      navigate('dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 16px' }}>
      <button onClick={() => navigate('dashboard')} style={{
        background: 'none', border: 'none', color: '#1e3a5f',
        cursor: 'pointer', fontSize: '14px', marginBottom: '16px',
        padding: 0, fontWeight: '600'
      }}>
        ← Back to Dashboard
      </button>

      <div style={{
        background: 'white', borderRadius: '12px', padding: '32px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ margin: '0 0 24px', color: '#1e3a5f' }}>
          Submit Maintenance Report
        </h2>

        {error && (
          <div style={{
            background: '#fee2e2', color: '#991b1b', padding: '10px 14px',
            borderRadius: '6px', marginBottom: '16px', fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Title *</label>
          <input
            style={inputStyle}
            placeholder="e.g. Broken projector in Lab 3"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />

          <label style={labelStyle}>Location *</label>
          <input
            style={inputStyle}
            placeholder="e.g. Block B, Lab 3"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
            required
          />

          <label style={labelStyle}>Category *</label>
          <select
            style={inputStyle}
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>

          <label style={labelStyle}>Description *</label>
          <textarea
            style={{ ...inputStyle, height: '100px', resize: 'vertical' }}
            placeholder="Describe the problem in detail..."
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            required
          />

          <label style={labelStyle}>Photo (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            style={{ marginBottom: '24px', display: 'block', fontSize: '14px' }}
          />

          {image && (
            <div style={{ marginBottom: '16px' }}>
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={() => navigate('dashboard')} style={{
              flex: 1, padding: '11px', background: 'white', color: '#374151',
              border: '1px solid #d1d5db', borderRadius: '6px',
              cursor: 'pointer', fontWeight: '600'
            }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{
              flex: 1, padding: '11px', background: '#1e3a5f',
              color: 'white', border: 'none', borderRadius: '6px',
              cursor: 'pointer', fontWeight: '600', fontSize: '15px'
            }}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
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