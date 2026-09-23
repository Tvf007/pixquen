import { useState, useEffect } from 'react';
import { Page, Transaction } from './types';
import Maquininha from './components/Maquininha';
import Pagamento from './components/Pagamento';
import Historico from './components/Historico';
import Relatorios from './components/Relatorios';
import Comprovante from './components/Comprovante';
import Configuracoes from './components/Configuracoes';
import { startSession, renewSession, applySecurityHeaders, logAudit, isFramed } from './security';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('maquininha');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [currentAmount, setCurrentAmount] = useState(0);

  // Inicializar segurança
  useEffect(() => {
    applySecurityHeaders();
    startSession();
    logAudit('app_started', 'Aplicativo iniciado', 'info');

    // Renova sessão periodicamente
    const interval = setInterval(() => {
      renewSession();
    }, 5 * 60 * 1000); // a cada 5 minutos

    // Proteger contra clickjacking
    if (isFramed()) {
      logAudit('framed_detected', 'Aplicativo detectado em iframe', 'warning');
    }

    return () => clearInterval(interval);
  }, []);

  const handlePaymentCreated = (amount: number) => {
    setCurrentAmount(amount);
    setCurrentPage('pagamento');
  };

  const handleViewComprovante = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setCurrentPage('comprovante');
  };

  const handleBack = () => {
    setCurrentPage('maquininha');
    setCurrentAmount(0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'maquininha':
        return <Maquininha onPaymentCreated={handlePaymentCreated} onNavigate={setCurrentPage} />;
      case 'pagamento':
        return <Pagamento amount={currentAmount} onBack={handleBack} />;
      case 'historico':
        return <Historico onViewComprovante={handleViewComprovante} onBack={() => setCurrentPage('maquininha')} />;
      case 'relatorios':
        return <Relatorios onViewComprovante={handleViewComprovante} onBack={() => setCurrentPage('maquininha')} />;
      case 'comprovante':
        return selectedTransaction ? (
          <Comprovante transaction={selectedTransaction} onBack={() => setCurrentPage('historico')} />
        ) : null;
      case 'configuracoes':
        return <Configuracoes onBack={() => setCurrentPage('maquininha')} />;
      default:
        return <Maquininha onPaymentCreated={handlePaymentCreated} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {renderPage()}
    </div>
  );
}

export default App;
