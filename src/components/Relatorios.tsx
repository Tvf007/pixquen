import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { getTransactions, getTransactionsByDate, getTransactionsByMonth, formatCurrency, formatDate, getTodayString } from '../store';

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
  const pendingTxs = transactions.filter(t => t.status === 'pending');
  const totalReceived = completedTxs.reduce((sum, t) => sum + t.amount, 0);
  const totalFees = completedTxs.reduce((sum, t) => sum + (t.feeAmount || 0), 0);
  const totalNet = completedTxs.reduce((sum, t) => sum + (t.netAmount || t.amount), 0);

  const shareReport = () => {
    const period = view === 'daily'
      ? `Relatório Diário — ${new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')}`
      : `Relatório Mensal — ${new Date(selectedMonth + '-01T12:00:00').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;

    const message = `📊 ${period}\n\n` +
      `💰 Total recebido: ${formatCurrency(totalReceived)}\n` +
      `📉 Taxas: ${formatCurrency(totalFees)}\n` +
      `✅ Líquido: ${formatCurrency(totalNet)}\n` +
      `📋 Transações: ${completedTxs.length} pagas, ${pendingTxs.length} pendentes\n\n` +
      `Detalhamento:\n` +
      completedTxs.map(t => `• ${formatCurrency(t.amount)} — ${formatDate(t.createdAt)}`).join('\n');

    if (navigator.share) {
      navigator.share({ title: period, text: message });
    } else {
      navigator.clipboard.writeText(message);
      alert('Relatório copiado para a área de transferência!');
    }
  };

  // Agrupar por dia para visualização mensal
  const groupedByDay = view === 'monthly'
    ? completedTxs.reduce((acc, tx) => {
        const day = tx.createdAt.split('T')[0];
        if (!acc[day]) acc[day] = [];
        acc[day].push(tx);
        return acc;
      }, {} as Record<string, Transaction[]>)
    : {};

  return (
    <div className="h-[100dvh] flex flex-col bg-gray-950 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 flex-shrink-0 safe-top">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-medium text-gray-200">Relatórios</span>
        <button onClick={shareReport} className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </header>
      
      {/* Conteúdo com scroll */}
      <div className="flex-1 overflow-y-auto">

      {/* Toggle */}
      <div className="px-4 pt-4">
        <div className="flex bg-gray-900 rounded-xl p-1 border border-gray-800">
          <button
            onClick={() => setView('daily')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              view === 'daily' ? 'bg-green-500/20 text-green-400' : 'text-gray-500'
            }`}
          >
            📅 Diário
          </button>
          <button
            onClick={() => setView('monthly')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              view === 'monthly' ? 'bg-green-500/20 text-green-400' : 'text-gray-500'
            }`}
          >
            📆 Mensal
          </button>
        </div>
      </div>

      {/* Date picker */}
      <div className="px-4 pt-3">
        {view === 'daily' ? (
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-green-500/50"
          />
        ) : (
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-green-500/50"
          />
        )}
      </div>

      {/* Summary Cards */}
      <div className="px-4 pt-4 grid grid-cols-2 gap-3">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500">Recebido</p>
          <p className="text-lg font-bold text-green-400 mt-1">{formatCurrency(totalReceived)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500">Líquido</p>
          <p className="text-lg font-bold text-emerald-400 mt-1">{formatCurrency(totalNet)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500">Taxas</p>
          <p className="text-lg font-bold text-red-400 mt-1">{formatCurrency(totalFees)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500">Transações</p>
          <p className="text-lg font-bold text-white mt-1">{completedTxs.length}</p>
        </div>
      </div>

      {/* Transactions list */}
      <div className="px-4 pt-4 pb-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
          Transações do período
        </h3>

        {view === 'daily' ? (
          <div className="space-y-2">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-3xl block mb-2">📭</span>
                <p className="text-gray-500 text-sm">Nenhuma transação neste dia</p>
              </div>
            ) : (
              transactions.map(tx => (
                <button
                  key={tx.id}
                  onClick={() => (tx.status === 'completed' || tx.status === 'depix_sent') && onViewComprovante(tx)}
                  className="w-full text-left bg-gray-900 border border-gray-800 rounded-xl p-3 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.status === 'completed' || tx.status === 'depix_sent'
                          ? 'bg-green-500/20'
                          : tx.status === 'pending'
                          ? 'bg-yellow-500/20'
                          : 'bg-gray-500/20'
                      }`}>
                        <span className="text-sm">
                          {tx.status === 'completed' || tx.status === 'depix_sent' ? '✅' : tx.status === 'pending' ? '⏳' : '❌'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{formatCurrency(tx.amount)}</p>
                        <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      tx.status === 'completed' || tx.status === 'depix_sent'
                        ? 'bg-green-500/20 text-green-400'
                        : tx.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {tx.status === 'completed' || tx.status === 'depix_sent' ? 'Pago' : tx.status === 'pending' ? 'Pendente' : tx.status}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {Object.keys(groupedByDay).length === 0 ? (
              <div className="text-center py-8">
                <span className="text-3xl block mb-2">📭</span>
                <p className="text-gray-500 text-sm">Nenhuma transação neste mês</p>
              </div>
            ) : (
              Object.entries(groupedByDay)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([day, txs]) => {
                  const dayTotal = txs.reduce((sum, t) => sum + t.amount, 0);
                  return (
                    <div key={day} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50">
                        <p className="text-sm font-medium text-gray-300">
                          {new Date(day + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                        </p>
                        <p className="text-sm font-bold text-green-400">{formatCurrency(dayTotal)}</p>
                      </div>
                      <div className="divide-y divide-gray-800/50">
                        {txs.map(tx => (
                          <button
                            key={tx.id}
                            onClick={() => onViewComprovante(tx)}
                            className="w-full text-left px-4 py-2.5 hover:bg-gray-800/30 transition-colors flex items-center justify-between"
                          >
                            <p className="text-sm text-gray-400">
                              {new Date(tx.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-sm font-medium text-white">{formatCurrency(tx.amount)}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}
      </div>

        {/* Share button */}
        <div className="px-4 pb-6">
          <button
            onClick={shareReport}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-sm hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25"
          >
            📤 Compartilhar Relatório
          </button>
        </div>
      </div>
    </div>
  );
}
