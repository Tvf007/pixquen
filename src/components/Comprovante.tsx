import { Transaction } from '../types';
import { formatCurrency, formatDate, getConfig } from '../store';

interface ComprovanteProps {
  transaction: Transaction;
  onBack: () => void;
}

export default function Comprovante({ transaction, onBack }: ComprovanteProps) {
  const config = getConfig();

  const shareComprovante = () => {
    const message =
      `✅ COMPROVANTE DE PAGAMENTO\n\n` +
      `🏪 ${config.businessName || 'Minha Loja'}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `💰 Valor: ${formatCurrency(transaction.amount)}\n` +
      `📅 Data: ${formatDate(transaction.completedAt || transaction.createdAt)}\n` +
      `📋 ID: ${transaction.depositId}\n` +
      `✅ Status: Pago via PIX\n\n` +
      (transaction.feeAmount ? `📉 Taxa: ${formatCurrency(transaction.feeAmount)}\n` : '') +
      (transaction.netAmount ? `✅ Líquido: ${formatCurrency(transaction.netAmount)}\n\n` : '\n') +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Comprovante gerado pela Maquininha PIX`;

    if (navigator.share) {
      navigator.share({ title: 'Comprovante de Pagamento', text: message });
    } else {
      navigator.clipboard.writeText(message);
    }
  };

  const shareWhatsApp = () => {
    const message =
      `✅ *COMPROVANTE DE PAGAMENTO*\n\n` +
      `🏪 *${config.businessName || 'Minha Loja'}*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `💰 Valor: *${formatCurrency(transaction.amount)}*\n` +
      `📅 Data: ${formatDate(transaction.completedAt || transaction.createdAt)}\n` +
      `📋 ID: ${transaction.depositId}\n` +
      `✅ Status: *Pago via PIX*\n\n` +
      (transaction.feeAmount ? `📉 Taxa: ${formatCurrency(transaction.feeAmount)}\n` : '') +
      (transaction.netAmount ? `✅ Líquido: ${formatCurrency(transaction.netAmount)}\n\n` : '\n') +
      `━━━━━━━━━━━━━━━━━━━━`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-medium text-gray-200">Comprovante</span>
        <button onClick={shareComprovante} className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400" title="Copiar">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </header>

      <div className="px-4 py-6 max-w-md mx-auto">
        {/* Receipt Card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-white font-bold text-lg">Pagamento Confirmado</h2>
            <p className="text-green-100 text-sm mt-1">via PIX</p>
          </div>

          {/* Amount */}
          <div className="px-6 py-5 text-center border-b border-gray-200">
            <p className="text-gray-500 text-xs uppercase tracking-wider">Valor</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(transaction.amount)}</p>
          </div>

          {/* Details */}
          <div className="px-6 py-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Estabelecimento</span>
              <span className="text-gray-900 text-sm font-medium">{config.businessName || 'Minha Loja'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Data/Hora</span>
              <span className="text-gray-900 text-sm font-medium">
                {formatDate(transaction.completedAt || transaction.createdAt)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">ID Transação</span>
              <span className="text-gray-900 text-sm font-mono">{transaction.depositId.substring(0, 16)}...</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Forma</span>
              <span className="text-gray-900 text-sm font-medium">PIX</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Status</span>
              <span className="text-green-600 text-sm font-bold">✅ Confirmado</span>
            </div>

            {transaction.feeAmount !== undefined && transaction.feeAmount > 0 && (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Taxa</span>
                  <span className="text-red-500 text-sm">- {formatCurrency(transaction.feeAmount)}</span>
                </div>
                {transaction.netAmount !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm font-medium">Líquido</span>
                    <span className="text-green-600 text-sm font-bold">{formatCurrency(transaction.netAmount)}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 text-center">
            <p className="text-xs text-gray-400">
              Comprovante gerado pela Maquininha PIX
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={shareWhatsApp}
            className="w-full py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Enviar via WhatsApp
          </button>

          <button
            onClick={shareComprovante}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors border border-gray-700"
          >
            📋 Copiar Comprovante
          </button>

          <button
            onClick={onBack}
            className="w-full py-3 text-gray-500 hover:text-gray-300 rounded-xl font-medium text-sm transition-colors"
          >
            ← Voltar ao histórico
          </button>
        </div>
      </div>
    </div>
  );
}
