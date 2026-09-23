import { useState, useEffect } from 'react';
import { AppConfig } from '../types';
import { getConfig, saveConfig } from '../store';
import { 
  validateApiKey, 
  validateWebhookUrl, 
  sanitizeString, 
  maskApiKey, 
  getSecurityConfig, 
  saveSecurityConfig, 
  getAuditLogs, 
  clearAuditLogs,
  logAudit,
  SecurityConfig,
  AuditLog
} from '../security';

interface ConfiguracoesProps {
  onBack: () => void;
}

export default function Configuracoes({ onBack }: ConfiguracoesProps) {
  const [config, setConfig] = useState<AppConfig>(getConfig());
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>(getSecurityConfig());
  const [showSecurity, setShowSecurity] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  useEffect(() => {
    setConfig(getConfig());
    setSecurityConfig(getSecurityConfig());
  }, []);

  useEffect(() => {
    if (showLogs) {
      setAuditLogs(getAuditLogs(50));
    }
  }, [showLogs]);

  const handleSave = () => {
    // Sanitizar inputs
    const sanitizedConfig = {
      ...config,
      businessName: sanitizeString(config.businessName),
      apiKey: config.apiKey.trim(),
      webhookUrl: config.webhookUrl?.trim() || '',
    };

    // Validar API Key se fornecida
    if (sanitizedConfig.apiKey && !validateApiKey(sanitizedConfig.apiKey)) {
      alert('⚠️ Formato de API Key inválido. Use o formato: bpx_live_xxxxxxxxxxxxxxxx');
      logAudit('invalid_api_key_format', 'Tentativa de salvar API Key com formato inválido', 'warning');
      return;
    }

    // Validar webhook URL se fornecida
    if (sanitizedConfig.webhookUrl && !validateWebhookUrl(sanitizedConfig.webhookUrl)) {
      alert('⚠️ URL de webhook inválida. Use HTTPS.');
      logAudit('invalid_webhook_url', 'Tentativa de salvar URL de webhook inválida', 'warning');
      return;
    }

    saveConfig(sanitizedConfig);
    setConfig(sanitizedConfig);
    setSaved(true);
    logAudit('config_saved', 'Configurações salvas com sucesso', 'info');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveSecurity = () => {
    saveSecurityConfig(securityConfig);
    setSaved(true);
    logAudit('security_config_saved', 'Configurações de segurança salvas', 'info');
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
    <div className="h-[100dvh] flex flex-col bg-gray-950 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 flex-shrink-0 safe-top">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-medium text-gray-200">Configurações</span>
        <div className="w-9"></div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-md mx-auto w-full space-y-6">
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
          <div className="relative">
            <input
              type={apiKeyVisible ? "text" : "password"}
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 pr-16 text-sm font-mono text-gray-300 focus:outline-none focus:border-green-500/50"
              placeholder="bpx_live_xxxxxxxxxxxxxxxx"
            />
            <button
              type="button"
              onClick={() => setApiKeyVisible(!apiKeyVisible)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              {apiKeyVisible ? '🙈 Ocultar' : '👁️ Ver'}
            </button>
          </div>
          {config.apiKey && (
            <p className="text-xs text-gray-600 mt-1 font-mono">
              Visualização: {maskApiKey(config.apiKey)}
            </p>
          )}
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

        {/* Security Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowSecurity(!showSecurity)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
              🛡️ Segurança
            </span>
            <svg className={`w-4 h-4 text-gray-500 transition-transform ${showSecurity ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showSecurity && (
            <div className="px-4 pb-4 space-y-4 border-t border-gray-800 pt-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Timeout de sessão (minutos)</label>
                <input
                  type="number"
                  min={5}
                  max={120}
                  value={securityConfig.sessionTimeout}
                  onChange={(e) => setSecurityConfig({ ...securityConfig, sessionTimeout: parseInt(e.target.value) || 30 })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-green-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Máx. transações por hora</label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={securityConfig.maxTransactionsPerHour}
                  onChange={(e) => setSecurityConfig({ ...securityConfig, maxTransactionsPerHour: parseInt(e.target.value) || 50 })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-green-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Valor mínimo por transação (R$)</label>
                <input
                  type="number"
                  min={50}
                  value={securityConfig.minAmountPerTransaction}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value >= 50) {
                      setSecurityConfig({ ...securityConfig, minAmountPerTransaction: value });
                    }
                  }}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-green-500/50"
                />
                <p className="text-[10px] text-gray-600 mt-1">Mínimo permitido: R$ 50,00</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Valor máximo por transação (R$)</label>
                <input
                  type="number"
                  min={50}
                  value={securityConfig.maxAmountPerTransaction}
                  onChange={(e) => setSecurityConfig({ ...securityConfig, maxAmountPerTransaction: parseFloat(e.target.value) || 50000 })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-green-500/50"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Logs de auditoria</span>
                <input
                  type="checkbox"
                  checked={securityConfig.enableAuditLog}
                  onChange={(e) => setSecurityConfig({ ...securityConfig, enableAuditLog: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-950 text-green-500 focus:ring-green-500/50"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Rate limiting</span>
                <input
                  type="checkbox"
                  checked={securityConfig.enableRateLimit}
                  onChange={(e) => setSecurityConfig({ ...securityConfig, enableRateLimit: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-950 text-green-500 focus:ring-green-500/50"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Mascarar dados sensíveis</span>
                <input
                  type="checkbox"
                  checked={securityConfig.maskSensitiveData}
                  onChange={(e) => setSecurityConfig({ ...securityConfig, maskSensitiveData: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-950 text-green-500 focus:ring-green-500/50"
                />
              </div>
              <button
                onClick={handleSaveSecurity}
                className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs font-medium transition-colors"
              >
                💾 Salvar Segurança
              </button>
            </div>
          )}
        </div>

        {/* Audit Logs Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
              📜 Logs de Auditoria
              <span className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-500">{auditLogs.length}</span>
            </span>
            <svg className={`w-4 h-4 text-gray-500 transition-transform ${showLogs ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showLogs && (
            <div className="px-4 pb-4 border-t border-gray-800 pt-4">
              {auditLogs.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">Nenhum log registrado</p>
              ) : (
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {auditLogs.map((log, i) => (
                    <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-800/50 last:border-0">
                      <span className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 ${
                        log.severity === 'critical' ? 'bg-red-500' :
                        log.severity === 'error' ? 'bg-red-400' :
                        log.severity === 'warning' ? 'bg-yellow-400' :
                        'bg-green-400'
                      }`}></span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 truncate">{log.action}</p>
                        {log.details && <p className="text-[10px] text-gray-600 truncate">{log.details}</p>}
                        <p className="text-[10px] text-gray-700">{new Date(log.timestamp).toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {auditLogs.length > 0 && (
                <button
                  onClick={() => { clearAuditLogs(); setAuditLogs([]); }}
                  className="mt-3 w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium transition-colors"
                >
                  🗑️ Limpar Logs
                </button>
              )}
            </div>
          )}
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

        {/* API Key info */}
        {config.apiKey && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-green-400 mb-2">✅ API Configurada</h3>
            <p className="text-xs text-green-400/80">
              Sua API Key está configurada e o aplicativo está operando em modo real.
              As transações serão processadas pela API BuyPix.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
