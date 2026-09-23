import { useState } from 'react';
import { Page } from '../types';
import { formatCurrency } from '../store';

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
    if (amount >= 1) {
      onPaymentCreated(amount);
    }
  };

  const numericValue = parseFloat(value) || 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">PIX</span>
          </div>
          <span className="font-bold text-sm text-gray-200">Maquininha</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onNavigate('historico')}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
            title="Histórico"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            onClick={() => onNavigate('relatorios')}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
            title="Relatórios"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
          <button
            onClick={() => onNavigate('configuracoes')}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
            title="Configurações"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Display do valor */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <p className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Valor da venda</p>
        <div className="text-center">
          <span className="text-gray-500 text-2xl font-light">R$</span>
          <span className="text-white text-6xl md:text-7xl font-bold ml-2 tabular-nums">
            {numericValue.toFixed(2)}
          </span>
        </div>
        {numericValue > 0 && (
          <p className="text-gray-600 text-xs mt-3">
            {value.length < 4 ? 'Digite o valor' : formatCurrency(numericValue)}
          </p>
        )}
      </div>

      {/* Teclado numérico */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((key) => (
            <button
              key={key}
              onClick={() => {
                if (key === '⌫') handleBackspace();
                else if (key === '.') handleDecimal();
                else handleDigit(key);
              }}
              className="h-14 rounded-xl bg-gray-800/80 hover:bg-gray-700 active:bg-gray-600 text-white text-xl font-medium transition-all active:scale-95 border border-gray-700/50"
            >
              {key}
            </button>
          ))}
        </div>

        {/* Botões de ação */}
        <div className="flex gap-3 mt-4 max-w-xs mx-auto">
          <button
            onClick={handleClear}
            className="flex-1 h-12 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium text-sm transition-all border border-red-500/20"
          >
            Limpar
          </button>
          <button
            onClick={handleConfirm}
            disabled={numericValue < 1}
            className="flex-[2] h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm transition-all shadow-lg shadow-green-500/25 hover:from-green-600 hover:to-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            COBRAR {numericValue >= 1 ? formatCurrency(numericValue) : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
