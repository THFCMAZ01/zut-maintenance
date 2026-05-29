export default function StatusBadge({ status }) {
  const styles = {
    'Pending':     { background: '#fef3c7', color: '#92400e' },
    'In Progress': { background: '#dbeafe', color: '#1e40af' },
    'Resolved':    { background: '#d1fae5', color: '#065f46' },
  };
  const s = styles[status] || { background: '#f3f4f6', color: '#374151' };
  return (
    <span style={{
      ...s, padding: '3px 10px', borderRadius: '999px',
      fontSize: '12px', fontWeight: '600'
    }}>
      {status}
    </span>
  );
}