import { useState, useEffect, useRef } from 'react';
import { Transaction } from '../types';
import { createDeposit, getDepositStatus } from '../api';
import { getConfig, saveTransaction, updateTransaction, formatCurrency, generateId } from '../store';
import { generateShareMessage, checkRateLimit, logAudit, sanitizeString } from '../security';

interface PagamentoProps {
  amount: number;
  onBack: () => void;
}

export default function Pagamento({ amount, onBack }: PagamentoProps) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    initiatePayment();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const initiatePayment = async () => {
    setLoading(true);
    
    // Verificar rate limiting
    if (!checkRateLimit('transaction')) {
      setError('Limite de transações por hora excedido. Aguarde antes de criar nova cobrança.');
      setLoading(false);
      return;
    }
    
    try {
      const response = await createDeposit({ amount });

      if (response.success && response.data) {
        const tx: Transaction = {
          id: generateId(),
          depositId: response.data.id,
          amount: response.data.amount,
          status: 'pending',
          pixQrCode: response.data.pix_qr_code,
          pixQrCodeBase64: response.data.pix_qr_code_base64,
          createdAt: new Date().toISOString(),
          expiresAt: response.data.expires_at,
          feeAmount: response.data.fee_amount,
          netAmount: response.data.net_amount,
        };
        setTransaction(tx);
        saveTransaction(tx);
        logAudit('payment_created', `Cobrança criada: ${formatCurrency(amount)} - ID: ${tx.depositId}`, 'info');

        // Iniciar polling para verificar pagamento
        startPolling(response.data.id);
      } else {
        setError(response.message || 'Erro ao criar pagamento');
      }
    } catch (err: any) {
      setError(err.message || 'Erro de conexão');
    }
    setLoading(false);
  };

  const startPolling = (depositId: string) => {
    pollRef.current = setInterval(async () => {
      try {
        const statusResponse = await getDepositStatus(depositId);

        if (statusResponse.success && statusResponse.data) {
          const newStatus = statusResponse.data.status as Transaction['status'];
          
          if (newStatus === 'depix_sent' || newStatus === 'completed') {
            setPaid(true);
            updateTransaction(transaction!.id, {
              status: 'completed',
              completedAt: statusResponse.data.confirmed_at || new Date().toISOString(),
            });
            setTransaction(prev => prev ? { ...prev, status: 'completed', completedAt: new Date().toISOString() } : null);
            logAudit('payment_confirmed', `Pagamento confirmado: ${formatCurrency(transaction!.amount)} - ID: ${transaction!.depositId}`, 'info');
            if (pollRef.current) clearInterval(pollRef.current);
          } else if (['canceled', 'expired', 'error'].includes(newStatus)) {
            updateTransaction(transaction!.id, { status: newStatus });
            setTransaction(prev => prev ? { ...prev, status: newStatus } : null);
            if (pollRef.current) clearInterval(pollRef.current);
          }
        }
      } catch {
        // Silent fail for polling
      }
    }, 3000);
  };

  const shareLink = () => {
    if (!transaction) return;
    const config = getConfig();
    const link = `${window.location.origin}?pay=${transaction.depositId}&amount=${transaction.amount}`;
    const messages = generateShareMessage(transaction.amount, link, config.businessName);
    
    if (navigator.share) {
      navigator.share({ title: 'Pagamento PIX', text: messages.generic, url: link });
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(messages.whatsapp)}`;
      window.open(whatsappUrl, '_blank');
    }
    logAudit('payment_link_shared', `Link compartilhado: ${transaction.depositId}`, 'info');
  };

  const shareWhatsApp = () => {
    if (!transaction) return;
    const config = getConfig();
    const link = `${window.location.origin}?pay=${transaction.depositId}&amount=${transaction.amount}`;
    const messages = generateShareMessage(transaction.amount, link, config.businessName);
    window.open(`https://wa.me/?text=${encodeURIComponent(messages.whatsapp)}`, '_blank');
    logAudit('payment_whatsapp_shared', `WhatsApp compartilhado: ${transaction.depositId}`, 'info');
  };

  const copyLink = () => {
    if (!transaction) return;
    const link = `${window.location.origin}?pay=${transaction.depositId}&amount=${transaction.amount}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    logAudit('payment_link_copied', `Link copiado: ${transaction.depositId}`, 'info');
  };

  const copyPixCode = () => {
    if (!transaction?.pixQrCode) return;
    navigator.clipboard.writeText(transaction.pixQrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-950 px-6 overflow-hidden" style={{ height: '100vh' }}>
        <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mb-6"></div>
        <p className="text-gray-400 text-lg">Gerando cobrança...</p>
        <p className="text-gray-600 text-sm mt-2">{formatCurrency(amount)}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-950 px-6 overflow-hidden" style={{ height: '100vh' }}>
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">❌</span>
        </div>
        <h2 className="text-xl font-bold text-red-400 mb-2">Erro</h2>
        <p className="text-gray-400 text-center mb-6">{error}</p>
        <button onClick={onBack} className="px-6 py-3 bg-gray-800 rounded-xl text-white font-medium hover:bg-gray-700 transition-colors">
          Voltar
        </button>
      </div>
    );
  }

  if (paid) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-950 px-6 overflow-hidden" style={{ height: '100vh' }}>
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <span className="text-4xl">✅</span>
        </div>
        <h2 className="text-2xl font-bold text-green-400 mb-2">Pagamento Confirmado!</h2>
        <p className="text-gray-400 text-center mb-2">{formatCurrency(transaction!.amount)}</p>
        <p className="text-gray-600 text-sm text-center mb-8">O pagamento via PIX foi recebido com sucesso.</p>
        
        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={onBack}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all"
          >
            Nova Cobrança
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-950 overflow-hidden" style={{ height: '100vh' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-medium text-gray-200">Cobrança PIX</span>
        <div className="w-9"></div>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 py-4 overflow-y-auto min-h-0">
        {/* Valor */}
        <div className="text-center mb-6">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Valor a pagar</p>
          <p className="text-4xl font-bold text-white">{formatCurrency(amount)}</p>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-xl shadow-black/30">
          {transaction?.pixQrCodeBase64 ? (
            <img
              src={`data:image/png;base64,${transaction.pixQrCodeBase64}`}
              alt="QR Code PIX"
              className="w-52 h-52"
            />
          ) : (
            <div className="w-52 h-52 flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <div className="text-5xl mb-2">📱</div>
                <p className="text-gray-500 text-xs">QR Code gerado pela API</p>
                <p className="text-gray-400 text-[10px] mt-1">Configure a API Key para QR real</p>
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <span className="text-yellow-400 text-sm">Aguardando pagamento...</span>
        </div>

        {/* PIX Copia e Cola */}
        <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
          <p className="text-xs text-gray-500 mb-2">PIX Copia e Cola</p>
          <p className="text-xs text-gray-400 font-mono truncate">
            {transaction?.pixQrCode?.substring(0, 50) || 'Código PIX...'}...
          </p>
          <button
            onClick={copyPixCode}
            className="mt-3 w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
          >
            {copied ? '✅ Copiado!' : '📋 Copiar código PIX'}
          </button>
        </div>

        {/* Compartilhamento */}
        <div className="w-full max-w-sm space-y-2">
          <p className="text-xs text-gray-500 text-center mb-2">Compartilhar cobrança</p>
          
          <button
            onClick={shareWhatsApp}
            className="w-full py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Compartilhar no WhatsApp
          </button>

          <button
            onClick={copyLink}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors border border-gray-700"
          >
            {copied ? '✅ Link copiado!' : '🔗 Copiar link de pagamento'}
          </button>

          <button
            onClick={() => {
              if (!transaction) return;
              const link = `${window.location.origin}?pay=${transaction.depositId}&amount=${transaction.amount}`;
              window.open(link, '_blank');
            }}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            🌐 Abrir link de pagamento
          </button>

          <button
            onClick={shareLink}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors border border-gray-700"
          >
            📤 Compartilhar
          </button>
        </div>

        {/* Expira em */}
        {transaction?.expiresAt && (
          <p className="text-gray-600 text-xs mt-6 text-center">
            Este QR Code expira em {new Date(transaction.expiresAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}
