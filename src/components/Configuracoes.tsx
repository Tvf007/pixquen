import { useState, useEffect } from 'react';
import { AppConfig } from '../types';
import { getConfig, saveConfig } from '../store';

interface ConfiguracoesProps {
  onBack: () => void;
}

export default function Configuracoes({ onBack }: ConfiguracoesProps) {
  const [config, setConfig] = useState<AppConfig>(getConfig());
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    setConfig(getConfig());
  }, []);

  const handleSave = () => {
    saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const response = await fetch('https://buypix.me/api/v1/account', {
        headers: { 'Authorization': `Bearer ${config.apiKey}` },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConfig(prev => ({ ...prev, businessName: data.data.name || prev.businessName }));
          setTestResult('success');
        } else {
          setTestResult('error');
        }
      } else {
        setTestResult('error');
      }
    } catch {
      setTestResult('error');
    }
    setTesting(false);
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
        <span className="font-medium text-gray-200">Configurações</span>
        <div className="w-9"></div>
      </header>

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Business name */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            🏪 Nome do Estabelecimento
          </label>
          <input
            type="text"
            value={config.businessName}
            onChange={(e) => setConfig({ ...config, businessName: e.target.value })}
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-green-500/50"
            placeholder="Minha Loja"
          />
          <p className="text-xs text-gray-500 mt-2">Aparece nos comprovantes e links de pagamento</p>
        </div>

        {/* API Key */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            🔑 API Key BuyPix
          </label>
          <input
            type="password"
            value={config.apiKey}
            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-300 focus:outline-none focus:border-green-500/50"
            placeholder="bpx_live_xxxxxxxxxxxxxxxx"
          />
          <p className="text-xs text-gray-500 mt-2">
            Obtenha em{' '}
            <a href="https://buypix.me/app/api-keys" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
              buypix.me/app/api-keys
            </a>
          </p>

          {/* Test connection */}
          {config.apiKey && (
            <div className="mt-3">
              <button
                onClick={handleTest}
                disabled={testing}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                {testing ? '⏳ Testando...' : '🔌 Testar conexão'}
              </button>
              {testResult === 'success' && (
                <p className="text-xs text-green-400 mt-2">✅ Conexão bem-sucedida!</p>
              )}
              {testResult === 'error' && (
                <p className="text-xs text-red-400 mt-2">❌ Erro na conexão. Verifique sua API Key.</p>
              )}
            </div>
          )}
        </div>

        {/* Webhook URL */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            🔗 URL do Webhook (opcional)
          </label>
          <input
            type="url"
            value={config.webhookUrl || ''}
            onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-300 focus:outline-none focus:border-green-500/50"
            placeholder="https://seu-site.com/webhook"
          />
          <p className="text-xs text-gray-500 mt-2">
            Receba notificações automáticas quando pagamentos forem confirmados
          </p>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25'
          }`}
        >
          {saved ? '✅ Salvo!' : '💾 Salvar Configurações'}
        </button>

        {/* Info */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">ℹ️ Sobre a API BuyPix</h3>
          <div className="space-y-2 text-xs text-gray-500">
            <p>• <strong className="text-gray-400">Base URL:</strong> https://buypix.me/api/v1</p>
            <p>• <strong className="text-gray-400">Autenticação:</strong> Bearer Token</p>
            <p>• <strong className="text-gray-400">Formato da chave:</strong> bpx_live_xxxxxxxxxxxx</p>
            <p>• <strong className="text-gray-400">Rate limit:</strong> 1.000 req/hora</p>
            <p>• <strong className="text-gray-400">Idempotência:</strong> X-Idempotency-Key (UUID v4)</p>
            <p>• <strong className="text-gray-400">Documentação:</strong>{' '}
              <a href="https://docs.buypix.me" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                docs.buypix.me
              </a>
            </p>
          </div>
        </div>

        {/* Demo mode info */}
        {!config.apiKey && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-yellow-400 mb-2">⚠️ Modo Demonstração</h3>
            <p className="text-xs text-yellow-400/80">
              Sem API Key configurada, o app funciona em modo demonstração. 
              Os pagamentos serão simulados localmente. Configure sua chave BuyPix para usar a integração real.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
