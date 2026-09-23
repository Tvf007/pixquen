import { useState } from 'react';
import { Page } from '../types';
import { formatCurrency } from '../store';
import { getSecurityConfig } from '../security';

interface MaquininhaProps {
  onPaymentCreated: (amount: number) => void;
  onNavigate: (page: Page) => void;
}

export default function Maquininha({ onPaymentCreated, onNavigate }: MaquininhaProps) {
  const [value, setValue] = useState('0');

  const handleDigit = (digit: string) => {
    if (value === '0') {
      setValue(digit);
    } else if (value.length < 10) {
      setValue(value + digit);
    }
  };

  const handleDecimal = () => {
    if (!value.includes('.')) {
      setValue(value + '.');
    }
  };

  const handleBackspace = () => {
    if (value.length <= 1) {
      setValue('0');
    } else {
      setValue(value.slice(0, -1));
    }
  };

  const handleClear = () => {
    setValue('0');
  };

  const handleConfirm = () => {
    const amount = parseFloat(value);
    const config = getSecurityConfig();
    
    if (amount < config.minAmountPerTransaction) {
      alert(`⚠️ Valor mínimo: R$ ${config.minAmountPerTransaction.toFixed(2)}\n\nO valor da cobrança deve ser igual ou superior a R$ ${config.minAmountPerTransaction.toFixed(2)}.`);
      return;
    }
    
    if (amount > config.maxAmountPerTransaction) {
      alert(`⚠️ Valor máximo: R$ ${config.maxAmountPerTransaction.toFixed(2)}\n\nO valor da cobrança excede o limite permitido.`);
      return;
    }
    
    onPaymentCreated(amount);
  };

  const numericValue = parseFloat(value) || 0;
  const config = getSecurityConfig();
  const isValidAmount = numericValue >= config.minAmountPerTransaction && numericValue <= config.maxAmountPerTransaction;

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

  const logoStyle: React.CSSProperties = {
    width: '28px',
    height: '28px',
    background: 'linear-gradient(135deg, #34d399, #059669)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 'bold',
  };

  const displayStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 24px',
    minHeight: 0,
  };

  const keypadStyle: React.CSSProperties = {
    padding: '0 16px 16px',
    flexShrink: 0,
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '6px',
    maxWidth: '320px',
    margin: '0 auto',
  };

  const buttonStyle: React.CSSProperties = {
    height: '48px',
    borderRadius: '8px',
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 500,
    border: '1px solid rgba(55, 65, 81, 0.5)',
    cursor: 'pointer',
    transition: 'all 0.1s',
  };

  const actionButtonsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
    maxWidth: '320px',
    margin: '8px auto 0',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={logoStyle}>PIX</div>
          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Maquininha</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={() => onNavigate('historico')}
            style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '20px' }}
          >
            🕐
          </button>
          <button
            onClick={() => onNavigate('relatorios')}
            style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '20px' }}
          >
            📊
          </button>
          <button
            onClick={() => onNavigate('configuracoes')}
            style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '20px' }}
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Display */}
      <div style={displayStyle}>
        <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Valor da venda</p>
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: '#6b7280', fontSize: '20px', fontWeight: 300 }}>R$</span>
          <span style={{ color: '#ffffff', fontSize: '48px', fontWeight: 'bold', marginLeft: '8px', fontVariantNumeric: 'tabular-nums' }}>
            {numericValue.toFixed(2)}
          </span>
        </div>
        {numericValue > 0 && numericValue < config.minAmountPerTransaction && (
          <p style={{ color: '#f87171', fontSize: '12px', marginTop: '8px' }}>
            ⚠️ Mínimo: {formatCurrency(config.minAmountPerTransaction)}
          </p>
        )}
        {numericValue >= config.minAmountPerTransaction && (
          <p style={{ color: '#34d399', fontSize: '12px', marginTop: '8px' }}>
            ✓ Valor válido
          </p>
        )}
      </div>

      {/* Keypad */}
      <div style={keypadStyle}>
        <div style={gridStyle}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((key) => (
            <button
              key={key}
              onClick={() => {
                if (key === '⌫') handleBackspace();
                else if (key === '.') handleDecimal();
                else handleDigit(key);
              }}
              style={buttonStyle}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Aviso */}
        <div style={{ maxWidth: '320px', margin: '8px auto 0', padding: '4px 8px', backgroundColor: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.2)', borderRadius: '4px' }}>
          <p style={{ fontSize: '9px', color: '#facc15', textAlign: 'center' }}>
            💡 Mínimo: <strong>R$ 50,00</strong>
          </p>
        </div>

        {/* Action buttons */}
        <div style={actionButtonsStyle}>
          <button
            onClick={handleClear}
            style={{
              flex: 1,
              height: '44px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#f87171',
              fontWeight: 500,
              fontSize: '12px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              cursor: 'pointer',
            }}
          >
            Limpar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValidAmount}
            style={{
              flex: 2,
              height: '44px',
              borderRadius: '8px',
              background: isValidAmount ? 'linear-gradient(to right, #10b981, #059669)' : 'rgba(107, 114, 128, 0.4)',
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '12px',
              border: 'none',
              cursor: isValidAmount ? 'pointer' : 'not-allowed',
              opacity: isValidAmount ? 1 : 0.4,
            }}
          >
            {isValidAmount ? `COBRAR ${formatCurrency(numericValue)}` : `MÍNIMO ${formatCurrency(config.minAmountPerTransaction)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
