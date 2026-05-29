import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import Dashboard      from './pages/Dashboard';
import NewReportPage  from './pages/NewReportPage';
import ReportDetailPage from './pages/ReportDetailPage';
import Navbar         from './components/Navbar';

function AppContent() {
  const { user } = useAuth();
  const [page, setPage]         = useState('login');
  const [selectedId, setSelectedId] = useState(null);

  function navigate(to, id = null) {
    setSelectedId(id);
    setPage(to);
  }

  if (!user) {
    if (page === 'register') return <RegisterPage navigate={navigate} />;
    return <LoginPage navigate={navigate} />;
  }

  return (
    <div>
      <Navbar navigate={navigate} />
      {page === 'dashboard'  && <Dashboard navigate={navigate} />}
      {page === 'new-report' && <NewReportPage navigate={navigate} />}
      {page === 'detail'     && <ReportDetailPage id={selectedId} navigate={navigate} />}
      {page !== 'dashboard' && page !== 'new-report' && page !== 'detail' && <Dashboard navigate={navigate} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}