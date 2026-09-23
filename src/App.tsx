import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Deposits from './components/Deposits';
import Withdrawals from './components/Withdrawals';
import PaymentLinks from './components/PaymentLinks';
import Products from './components/Products';
import Webhooks from './components/Webhooks';
import Reports from './components/Reports';
import ApiPlayground from './components/ApiPlayground';
import WebhookVerifier from './components/WebhookVerifier';

export type Page = 'dashboard' | 'deposits' | 'withdrawals' | 'payment-links' | 'products' | 'webhooks' | 'reports' | 'playground' | 'webhook-verifier';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'deposits': return <Deposits />;
      case 'withdrawals': return <Withdrawals />;
      case 'payment-links': return <PaymentLinks />;
      case 'products': return <Products />;
      case 'webhooks': return <Webhooks />;
      case 'reports': return <Reports />;
      case 'playground': return <ApiPlayground />;
      case 'webhook-verifier': return <WebhookVerifier />;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
