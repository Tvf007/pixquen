import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { getTransactions, getTransactionsByDate, getTransactionsByMonth, formatCurrency, formatDate, getTodayString } from '../store';
import { generateReceiptMessage, logAudit } from '../security';
import { getConfig } from '../store';

interface RelatoriosProps {
  onViewComprovante: (tx: Transaction) => void;
  onBack: () => void;
}

export default function Relatorios({ onViewComprovante, onBack }: RelatoriosProps) {
  const [view, setView] = useState<'daily' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (view === 'daily') {
      setTransactions(getTransactionsByDate(selectedDate));
    } else {
      const [year, month] = selectedMonth.split('-').map(Number);
      setTransactions(getTransactionsByMonth(year, month));
    }
  }, [view, selectedDate, selectedMonth]);

  const completedTxs = transactions.filter(t => t.status === 'completed' || t.status === 'depix_sent');
  const totalReceived = completedTxs.reduce((sum, t) => sum + t.amount, 0);
  const totalFees = completedTxs.reduce((sum, t) => sum + (t.feeAmount || 0), 0);
  const totalNet = completedTxs.reduce((sum, t) => sum + (t.netAmount || t.amount), 0);

  const shareReport = () => {
    const period = view === 'daily'
      ? `Relatório Diário — ${new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')}`
      : `Relatório Mensal — ${new Date(selectedMonth + '-01T12:00:00').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;

    const message = `📊 ${period}\n\n💰 Total: ${formatCurrency(totalReceived)}\n📉 Taxas: ${formatCurrency(totalFees)}\n✅ Líquido: ${formatCurrency(totalNet)}\n📋 Transações: ${completedTxs.length}`;

    if (navigator.share) {
      navigator.share({ title: period, text: message });
    } else {
      navigator.clipboard.writeText(message);
      alert('Relatório copiado!');
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#030712',
    color: '#ffffff',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderBottom: '1px solid #1f2937',
    flexShrink: 0,
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <button onClick={onBack} style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '20px' }}>
          ←
        </button>
        <span style={{ fontWeight: 500, color: '#e5e7eb' }}>Relatórios</span>
        <button onClick={shareReport} style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '20px' }}>
          📤
        </button>
      </header>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', backgroundColor: '#111827', borderRadius: '12px', padding: '4px', border: '1px solid #1f2937' }}>
            <button
              onClick={() => setView('daily')}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer', backgroundColor: view === 'daily' ? 'rgba(16, 185, 129, 0.2)' : 'transparent', color: view === 'daily' ? '#34d399' : '#6b7280' }}
            >
              📅 Diário
            </button>
            <button
              onClick={() => setView('monthly')}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer', backgroundColor: view === 'monthly' ? 'rgba(16, 185, 129, 0.2)' : 'transparent', color: view === 'monthly' ? '#34d399' : '#6b7280' }}
            >
              📆 Mensal
            </button>
          </div>
        </div>

        <div style={{ padding: '0 16px 12px' }}>
          {view === 'daily' ? (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ width: '100%', backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '12px', fontSize: '14px', color: '#d1d5db' }}
            />
          ) : (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ width: '100%', backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '12px', fontSize: '14px', color: '#d1d5db' }}
            />
          )}
        </div>

        <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Recebido</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#34d399', marginTop: '4px' }}>{formatCurrency(totalReceived)}</p>
          </div>
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Líquido</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#34d399', marginTop: '4px' }}>{formatCurrency(totalNet)}</p>
          </div>
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Taxas</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#f87171', marginTop: '4px' }}>{formatCurrency(totalFees)}</p>
          </div>
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Transações</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', marginTop: '4px' }}>{completedTxs.length}</p>
          </div>
        </div>

        <div style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#9ca3af', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Transações do período
          </h3>

          {transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <span style={{ fontSize: '36px', display: 'block', marginBottom: '8px' }}>📭</span>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Nenhuma transação neste período</p>
            </div>
          ) : (
            transactions.map(tx => (
              <button
                key={tx.id}
                onClick={() => (tx.status === 'completed' || tx.status === 'depix_sent') && onViewComprovante(tx)}
                style={{ width: '100%', textAlign: 'left', backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '12px', marginBottom: '8px', cursor: (tx.status === 'completed' || tx.status === 'depix_sent') ? 'pointer' : 'default' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: tx.status === 'completed' || tx.status === 'depix_sent' ? 'rgba(16, 185, 129, 0.2)' : tx.status === 'pending' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(107, 114, 128, 0.2)' }}>
                      <span style={{ fontSize: '14px' }}>
                        {tx.status === 'completed' || tx.status === 'depix_sent' ? '✅' : tx.status === 'pending' ? '⏳' : '❌'}
                      </span>
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>{formatCurrency(tx.amount)}</p>
                      <p style={{ fontSize: '12px', color: '#6b7280' }}>{new Date(tx.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '12px', backgroundColor: tx.status === 'completed' || tx.status === 'depix_sent' ? 'rgba(16, 185, 129, 0.2)' : tx.status === 'pending' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(107, 114, 128, 0.2)', color: tx.status === 'completed' || tx.status === 'depix_sent' ? '#34d399' : tx.status === 'pending' ? '#facc15' : '#9ca3af' }}>
                    {tx.status === 'completed' || tx.status === 'depix_sent' ? 'Pago' : tx.status === 'pending' ? 'Pendente' : tx.status}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        <div style={{ padding: '0 16px 24px' }}>
          <button
            onClick={shareReport}
            style={{ width: '100%', padding: '12px', background: 'linear-gradient(to right, #10b981, #059669)', color: '#ffffff', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', border: 'none', cursor: 'pointer' }}
          >
            📤 Compartilhar Relatório
          </button>
        </div>
      </div>
    </div>
  );
}
