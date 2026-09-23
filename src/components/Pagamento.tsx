import { useState, useEffect, useRef } from 'react';
import { Transaction } from '../types';
import { createDeposit, getDepositStatus } from '../api';
import { getConfig, saveTransaction, updateTransaction, formatCurrency, generateId } from '../store';
import { generateShareMessage, checkRateLimit, logAudit } from '../security';

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
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
    overflowY: 'auto',
  };

  if (loading) {
    return (
      <div style={{ ...containerStyle, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '64px', height: '64px', border: '4px solid rgba(16, 185, 129, 0.3)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '24px' }}></div>
        <p style={{ color: '#9ca3af', fontSize: '18px' }}>Gerando cobrança...</p>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>{formatCurrency(amount)}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...containerStyle, alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(239, 68, 68, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '32px' }}>
          ❌
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#f87171', marginBottom: '8px' }}>Erro</h2>
        <p style={{ color: '#9ca3af', textAlign: 'center', marginBottom: '24px' }}>{error}</p>
        <button onClick={onBack} style={{ padding: '12px 24px', backgroundColor: '#1f2937', color: '#ffffff', borderRadius: '12px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
          Voltar
        </button>
      </div>
    );
  }

  if (paid) {
    return (
      <div style={{ ...containerStyle, alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontSize: '40px' }}>
          ✅
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#34d399', marginBottom: '8px' }}>Pagamento Confirmado!</h2>
        <p style={{ color: '#9ca3af', textAlign: 'center', marginBottom: '8px' }}>{formatCurrency(transaction!.amount)}</p>
        <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', marginBottom: '32px' }}>O pagamento via PIX foi recebido com sucesso.</p>
        <button
          onClick={onBack}
          style={{ width: '100%', maxWidth: '400px', padding: '12px', background: 'linear-gradient(to right, #10b981, #059669)', color: '#ffffff', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
        >
          Nova Cobrança
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <button onClick={onBack} style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '20px' }}>
          ←
        </button>
        <span style={{ fontWeight: 500, color: '#e5e7eb' }}>Cobrança PIX</span>
        <div style={{ width: '36px' }}></div>
      </header>

      <div style={contentStyle}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Valor a pagar</p>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#ffffff' }}>{formatCurrency(amount)}</p>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '16px', marginBottom: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
          {transaction?.pixQrCodeBase64 ? (
            <img
              src={`data:image/png;base64,${transaction.pixQrCodeBase64}`}
              alt="QR Code PIX"
              style={{ width: '208px', height: '208px' }}
            />
          ) : (
            <div style={{ width: '208px', height: '208px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>📱</div>
                <p style={{ color: '#6b7280', fontSize: '12px' }}>QR Code gerado pela API</p>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: '#facc15', borderRadius: '50%', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
          <span style={{ color: '#facc15', fontSize: '14px' }}>Aguardando pagamento...</span>
        </div>

        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>PIX Copia e Cola</p>
          <p style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {transaction?.pixQrCode?.substring(0, 50) || 'Código PIX...'}...
          </p>
          <button
            onClick={copyPixCode}
            style={{ marginTop: '12px', width: '100%', padding: '8px', backgroundColor: '#1f2937', borderRadius: '8px', fontSize: '14px', color: '#d1d5db', border: 'none', cursor: 'pointer' }}
          >
            {copied ? '✅ Copiado!' : '📋 Copiar código PIX'}
          </button>
        </div>

        <div style={{ width: '100%', maxWidth: '400px' }}>
          <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginBottom: '8px' }}>Compartilhar cobrança</p>
          
          <button
            onClick={shareWhatsApp}
            style={{ width: '100%', padding: '12px', backgroundColor: '#25D366', color: '#ffffff', borderRadius: '12px', fontWeight: 500, fontSize: '14px', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            📱 Compartilhar no WhatsApp
          </button>

          <button
            onClick={copyLink}
            style={{ width: '100%', padding: '12px', backgroundColor: '#1f2937', color: '#d1d5db', borderRadius: '12px', fontWeight: 500, fontSize: '14px', border: '1px solid #374151', cursor: 'pointer', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {copied ? '✅ Link copiado!' : '🔗 Copiar link de pagamento'}
          </button>

          <button
            onClick={() => {
              if (!transaction) return;
              const link = `${window.location.origin}?pay=${transaction.depositId}&amount=${transaction.amount}`;
              window.open(link, '_blank');
            }}
            style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '12px', fontWeight: 500, fontSize: '14px', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            🌐 Abrir link de pagamento
          </button>

          <button
            onClick={shareLink}
            style={{ width: '100%', padding: '12px', backgroundColor: '#1f2937', color: '#d1d5db', borderRadius: '12px', fontWeight: 500, fontSize: '14px', border: '1px solid #374151', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            📤 Compartilhar
          </button>
        </div>

        {transaction?.expiresAt && (
          <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '24px', textAlign: 'center' }}>
            Este QR Code expira em {new Date(transaction.expiresAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}
