import { useState, useEffect, Component, ReactNode } from 'react';
import { Page, Transaction } from './types';
import Maquininha from './components/Maquininha';
import Pagamento from './components/Pagamento';
import Historico from './components/Historico';
import Relatorios from './components/Relatorios';
import Comprovante from './components/Comprovante';
import Configuracoes from './components/Configuracoes';
import { startSession, renewSession, logAudit, isFramed } from './security';

// Error Boundary para capturar erros de renderização
class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    logAudit('render_error', `Erro de renderização: ${error.message}`, 'error');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-2">Ops! Algo deu errado</h1>
            <p className="text-gray-400 mb-4">
              Ocorreu um erro ao carregar o aplicativo.
            </p>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4 text-left">
              <p className="text-xs text-gray-500 mb-2">Detalhes do erro:</p>
              <code className="text-xs text-red-400 break-all">
                {this.state.error?.message || 'Erro desconhecido'}
              </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              🔄 Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('maquininha');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [currentAmount, setCurrentAmount] = useState(0);

  // Inicializar segurança
  useEffect(() => {
    startSession();
    logAudit('app_started', 'Aplicativo iniciado', 'info');

    // Renova sessão periodicamente
    const interval = setInterval(() => {
      renewSession();
    }, 5 * 60 * 1000); // a cada 5 minutos

    // Verificar se está em iframe
    try {
      if (isFramed()) {
        logAudit('framed_detected', 'Aplicativo detectado em iframe', 'warning');
      }
    } catch (e) {
      // Ignorar erros de cross-origin
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

// Wrapper com Error Boundary
function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
