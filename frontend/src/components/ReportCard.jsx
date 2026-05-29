import StatusBadge from './StatusBadge';

export default function ReportCard({ report, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: 'white', border: '1px solid #e5e7eb',
      borderRadius: '10px', padding: '20px', cursor: 'pointer',
      boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
      transition: 'box-shadow 0.2s'
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.07)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h3 style={{ margin: 0, color: '#1e3a5f', fontSize: '16px' }}>{report.title}</h3>
        <StatusBadge status={report.status} />
      </div>
      <p style={{ margin: '4px 0', color: '#6b7280', fontSize: '14px' }}>
         {report.location} &nbsp;|&nbsp;  {report.category}
      </p>
      <p style={{ margin: '4px 0', color: '#9ca3af', fontSize: '13px' }}>
        By {report.submitted_by} &nbsp;·&nbsp; {new Date(report.created_at).toLocaleDateString()}
      </p>
    </div>
  );
}