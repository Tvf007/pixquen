import { useState, useEffect } from 'react';
import { AppConfig } from '../types';
import { getConfig, saveConfig } from '../store';
import { validateApiKey, validateWebhookUrl, sanitizeString, maskApiKey, getSecurityConfig, saveSecurityConfig, getAuditLogs, clearAuditLogs, logAudit, SecurityConfig, AuditLog } from '../security';

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
    const sanitizedConfig = {
      ...config,
      businessName: sanitizeString(config.businessName),
      apiKey: config.apiKey.trim(),
      webhookUrl: config.webhookUrl?.trim() || '',
    };

    if (sanitizedConfig.apiKey && !validateApiKey(sanitizedConfig.apiKey)) {
      alert('⚠️ Formato de API Key inválido. Use o formato: bpx_live_xxxxxxxxxxxxxxxx');
      logAudit('invalid_api_key_format', 'Tentativa de salvar API Key com formato inválido', 'warning');
      return;
    }

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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#030712',
    border: '1px solid #374151',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    color: '#d1d5db',
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <button onClick={onBack} style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '20px' }}>
          ←
        </button>
        <span style={{ fontWeight: 500, color: '#e5e7eb' }}>Configurações</span>
        <div style={{ width: '36px' }}></div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px', maxWidth: '500px', margin: '0 auto', width: '100%' }}>
        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
          <label style={{ fontSize: '14px', fontWeight: 500, color: '#d1d5db', marginBottom: '8px', display: 'block' }}>
            🏪 Nome do Estabelecimento
          </label>
          <input
            type="text"
            value={config.businessName}
            onChange={(e) => setConfig({ ...config, businessName: e.target.value })}
            style={inputStyle}
            placeholder="Minha Loja"
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>Aparece nos comprovantes e links de pagamento</p>
        </div>

        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
          <label style={{ fontSize: '14px', fontWeight: 500, color: '#d1d5db', marginBottom: '8px', display: 'block' }}>
            🔑 API Key BuyPix
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={apiKeyVisible ? "text" : "password"}
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              style={{ ...inputStyle, paddingRight: '80px' }}
              placeholder="bpx_live_xxxxxxxxxxxxxxxx"
            />
            <button
              type="button"
              onClick={() => setApiKeyVisible(!apiKeyVisible)}
              style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', padding: '4px 8px', fontSize: '12px', color: '#6b7280', background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              {apiKeyVisible ? '🙈 Ocultar' : '👁️ Ver'}
            </button>
          </div>
          {config.apiKey && (
            <p style={{ fontSize: '12px', color: '#4b5563', marginTop: '4px', fontFamily: 'monospace' }}>
              Visualização: {maskApiKey(config.apiKey)}
            </p>
          )}
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
            Obtenha em{' '}
            <a href="https://buypix.me/app/api-keys" target="_blank" rel="noopener noreferrer" style={{ color: '#34d399', textDecoration: 'underline' }}>
              buypix.me/app/api-keys
            </a>
          </p>

          {config.apiKey && (
            <div style={{ marginTop: '12px' }}>
              <button
                onClick={handleTest}
                disabled={testing}
                style={{ padding: '8px 16px', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', borderRadius: '8px', fontSize: '12px', fontWeight: 500, border: 'none', cursor: 'pointer', opacity: testing ? 0.5 : 1 }}
              >
                {testing ? '⏳ Testando...' : '🔌 Testar conexão'}
              </button>
              {testResult === 'success' && (
                <p style={{ fontSize: '12px', color: '#34d399', marginTop: '8px' }}>✅ Conexão bem-sucedida!</p>
              )}
              {testResult === 'error' && (
                <p style={{ fontSize: '12px', color: '#f87171', marginTop: '8px' }}>❌ Erro na conexão. Verifique sua API Key.</p>
              )}
            </div>
          )}
        </div>

        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
          <label style={{ fontSize: '14px', fontWeight: 500, color: '#d1d5db', marginBottom: '8px', display: 'block' }}>
            🔗 URL do Webhook (opcional)
          </label>
          <input
            type="url"
            value={config.webhookUrl || ''}
            onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
            style={inputStyle}
            placeholder="https://seu-site.com/webhook"
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>Receba notificações automáticas quando pagamentos forem confirmados</p>
        </div>

        <button
          onClick={handleSave}
          style={{ width: '100%', padding: '12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', border: 'none', cursor: 'pointer', background: saved ? '#10b981' : 'linear-gradient(to right, #10b981, #059669)', color: '#ffffff', marginBottom: '24px' }}
        >
          {saved ? '✅ Salvo!' : '💾 Salvar Configurações'}
        </button>

        {config.apiKey && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#34d399', marginBottom: '8px' }}>✅ API Configurada</h3>
            <p style={{ fontSize: '12px', color: 'rgba(52, 211, 153, 0.8)' }}>Sua API Key está configurada e o aplicativo está operando em modo real.</p>
          </div>
        )}
      </div>
    </div>
  );
}
