import { Transaction } from '../types';
import { formatCurrency, formatDate, getConfig } from '../store';
import { generateReceiptMessage, logAudit } from '../security';

interface ComprovanteProps {
  transaction: Transaction;
  onBack: () => void;
}

export default function Comprovante({ transaction, onBack }: ComprovanteProps) {
  const config = getConfig();

  const shareComprovante = () => {
    const message = generateReceiptMessage(
      transaction.amount,
      transaction.completedAt || transaction.createdAt,
      transaction.depositId,
      config.businessName,
      transaction.feeAmount,
      transaction.netAmount
    );

    if (navigator.share) {
      navigator.share({ title: 'Comprovante de Pagamento', text: message });
    } else {
      navigator.clipboard.writeText(message);
    }
    logAudit('receipt_shared', `Comprovante compartilhado: ${transaction.depositId}`, 'info');
  };

  const shareWhatsApp = () => {
    const message = generateReceiptMessage(
      transaction.amount,
      transaction.completedAt || transaction.createdAt,
      transaction.depositId,
      config.businessName,
      transaction.feeAmount,
      transaction.netAmount
    );
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    logAudit('receipt_whatsapp_shared', `Comprovante WhatsApp: ${transaction.depositId}`, 'info');
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
        <span style={{ fontWeight: 500, color: '#e5e7eb' }}>Comprovante</span>
        <button onClick={shareComprovante} style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '20px' }}>
          📋
        </button>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px', maxWidth: '500px', margin: '0 auto', width: '100%' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ background: 'linear-gradient(to right, #10b981, #059669)', padding: '24px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '32px' }}>
              ✅
            </div>
            <h2 style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '18px' }}>Pagamento Confirmado</h2>
            <p style={{ color: '#d1fae5', fontSize: '14px', marginTop: '4px' }}>via PIX</p>
          </div>

          <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
            <p style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Valor</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginTop: '4px' }}>{formatCurrency(transaction.amount)}</p>
          </div>

          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>Estabelecimento</span>
              <span style={{ color: '#111827', fontSize: '14px', fontWeight: 500 }}>{config.businessName || 'Minha Loja'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>Data/Hora</span>
              <span style={{ color: '#111827', fontSize: '14px', fontWeight: 500 }}>{formatDate(transaction.completedAt || transaction.createdAt)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>ID Transação</span>
              <span style={{ color: '#111827', fontSize: '14px', fontFamily: 'monospace' }}>{transaction.depositId.substring(0, 16)}...</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>Forma</span>
              <span style={{ color: '#111827', fontSize: '14px', fontWeight: 500 }}>PIX</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>Status</span>
              <span style={{ color: '#059669', fontSize: '14px', fontWeight: 'bold' }}>✅ Confirmado</span>
            </div>

            {transaction.feeAmount !== undefined && transaction.feeAmount > 0 && (
              <>
                <div style={{ borderTop: '1px solid #e5e7eb', margin: '12px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Taxa</span>
                  <span style={{ color: '#ef4444', fontSize: '14px' }}>- {formatCurrency(transaction.feeAmount)}</span>
                </div>
                {transaction.netAmount !== undefined && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>Líquido</span>
                    <span style={{ color: '#059669', fontSize: '14px', fontWeight: 'bold' }}>{formatCurrency(transaction.netAmount)}</span>
                  </div>
                )}
              </>
            )}
          </div>

          <div style={{ padding: '16px', backgroundColor: '#f9fafb', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#9ca3af' }}>Comprovante gerado pela Maquininha PIX</p>
            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <button
            onClick={shareWhatsApp}
            style={{ width: '100%', padding: '12px', backgroundColor: '#25D366', color: '#ffffff', borderRadius: '12px', fontWeight: 500, fontSize: '14px', border: 'none', cursor: 'pointer', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            📱 Enviar via WhatsApp
          </button>

          <button
            onClick={shareComprovante}
            style={{ width: '100%', padding: '12px', backgroundColor: '#1f2937', color: '#d1d5db', borderRadius: '12px', fontWeight: 500, fontSize: '14px', border: '1px solid #374151', cursor: 'pointer', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            📋 Copiar Comprovante
          </button>

          <button
            onClick={onBack}
            style={{ width: '100%', padding: '12px', color: '#6b7280', borderRadius: '12px', fontWeight: 500, fontSize: '14px', border: 'none', cursor: 'pointer' }}
          >
            ← Voltar ao histórico
          </button>
        </div>
      </div>
    </div>
  );
}
