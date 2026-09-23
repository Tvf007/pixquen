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
    const map: Record<string, { label: string; class: string }> = {
      pending: { label: 'Pendente', class: 'bg-yellow-500/20 text-yellow-400' },
      depix_sent: { label: 'Pago', class: 'bg-green-500/20 text-green-400' },
      completed: { label: 'Pago', class: 'bg-green-500/20 text-green-400' },
      expired: { label: 'Expirado', class: 'bg-gray-500/20 text-gray-400' },
      canceled: { label: 'Cancelado', class: 'bg-red-500/20 text-red-400' },
      error: { label: 'Erro', class: 'bg-red-500/20 text-red-400' },
      under_review: { label: 'Em análise', class: 'bg-blue-500/20 text-blue-400' },
      refunded: { label: 'Reembolsado', class: 'bg-purple-500/20 text-purple-400' },
    };
    const s = map[status] || { label: status, class: 'bg-gray-500/20 text-gray-400' };
    return <span className={`text-xs px-2 py-0.5 rounded-full ${s.class}`}>{s.label}</span>;
  };

  return (
    <div className="flex flex-col bg-gray-950 overflow-hidden" style={{ height: '100vh' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 flex-shrink-0 safe-top">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-medium text-gray-200">Histórico</span>
        <div className="w-9"></div>
      </header>

      {/* Conteúdo com scroll */}
      <div className="flex-1 overflow-y-auto">
        {/* Resumo */}
        <div className="px-4 py-4">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total recebido</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{formatCurrency(totalCompleted)}</p>
            <p className="text-xs text-gray-500 mt-1">{transactions.filter(t => t.status === 'completed' || t.status === 'depix_sent').length} transações concluídas</p>
          </div>
        </div>

      {/* Filtros */}
      <div className="px-4 flex gap-2 mb-4">
        {[
          { key: 'all', label: 'Todos' },
          { key: 'completed', label: 'Pagos' },
          { key: 'pending', label: 'Pendentes' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as typeof filter)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f.key
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-gray-800 text-gray-400 hover:text-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

        {/* Lista */}
        <div className="px-4 pb-6 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl block mb-3">📋</span>
              <p className="text-gray-500">Nenhuma transação encontrada</p>
            </div>
          ) : (
            filtered.map(tx => (
              <button
                key={tx.id}
                onClick={() => (tx.status === 'completed' || tx.status === 'depix_sent') && onViewComprovante(tx)}
                className={`w-full text-left bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors ${
                  (tx.status === 'completed' || tx.status === 'depix_sent') ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-white">{formatCurrency(tx.amount)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(tx.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    {statusBadge(tx.status)}
                    {(tx.status === 'completed' || tx.status === 'depix_sent') && (
                      <p className="text-xs text-gray-500 mt-1">Ver comprovante →</p>
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
