import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { getTransactions, formatCurrency, formatDate } from '../store';

interface HistoricoProps {
  onViewComprovante: (tx: Transaction) => void;
  onBack: () => void;
}

export default function Historico({ onViewComprovante, onBack }: HistoricoProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  const filtered = transactions.filter(t => {
    if (filter === 'completed') return t.status === 'completed' || t.status === 'depix_sent';
    if (filter === 'pending') return t.status === 'pending';
    return true;
  });

  const totalCompleted = transactions
    .filter(t => t.status === 'completed' || t.status === 'depix_sent')
    .reduce((sum, t) => sum + t.amount, 0);

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; bg: string; color: string }> = {
      pending: { label: 'Pendente', bg: 'rgba(234, 179, 8, 0.2)', color: '#facc15' },
      depix_sent: { label: 'Pago', bg: 'rgba(16, 185, 129, 0.2)', color: '#34d399' },
      completed: { label: 'Pago', bg: 'rgba(16, 185, 129, 0.2)', color: '#34d399' },
      expired: { label: 'Expirado', bg: 'rgba(107, 114, 128, 0.2)', color: '#9ca3af' },
      canceled: { label: 'Cancelado', bg: 'rgba(239, 68, 68, 0.2)', color: '#f87171' },
      error: { label: 'Erro', bg: 'rgba(239, 68, 68, 0.2)', color: '#f87171' },
      under_review: { label: 'Em análise', bg: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' },
      refunded: { label: 'Reembolsado', bg: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' },
    };
    const s = map[status] || { label: status, bg: 'rgba(107, 114, 128, 0.2)', color: '#9ca3af' };
    return <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '12px', backgroundColor: s.bg, color: s.color }}>{s.label}</span>;
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
        <span style={{ fontWeight: 500, color: '#e5e7eb' }}>Histórico</span>
        <div style={{ width: '36px' }}></div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '16px' }}>
          <div style={{ background: 'linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', padding: '16px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total recebido</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#34d399', marginTop: '4px' }}>{formatCurrency(totalCompleted)}</p>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{transactions.filter(t => t.status === 'completed' || t.status === 'depix_sent').length} transações concluídas</p>
          </div>
        </div>

        <div style={{ padding: '0 16px', display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[
            { key: 'all', label: 'Todos' },
            { key: 'completed', label: 'Pagos' },
            { key: 'pending', label: 'Pendentes' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 500,
                border: filter === f.key ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
                backgroundColor: filter === f.key ? 'rgba(16, 185, 129, 0.2)' : '#1f2937',
                color: filter === f.key ? '#34d399' : '#9ca3af',
                cursor: 'pointer',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '0 16px 24px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>📋</span>
              <p style={{ color: '#6b7280' }}>Nenhuma transação encontrada</p>
            </div>
          ) : (
            filtered.map(tx => (
              <button
                key={tx.id}
                onClick={() => (tx.status === 'completed' || tx.status === 'depix_sent') && onViewComprovante(tx)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  backgroundColor: '#111827',
                  border: '1px solid #1f2937',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '8px',
                  cursor: (tx.status === 'completed' || tx.status === 'depix_sent') ? 'pointer' : 'default',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>{formatCurrency(tx.amount)}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{formatDate(tx.createdAt)}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {statusBadge(tx.status)}
                    {(tx.status === 'completed' || tx.status === 'depix_sent') && (
                      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Ver comprovante →</p>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
