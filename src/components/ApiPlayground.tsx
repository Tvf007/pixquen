import { useState } from 'react';

type Endpoint = {
  method: string;
  path: string;
  label: string;
  params: { name: string; type: string; required: boolean; placeholder: string }[];
};

const endpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/account',
    label: 'Consultar Conta',
    params: [],
  },
  {
    method: 'POST',
    path: '/deposits',
    label: 'Criar Depósito',
    params: [
      { name: 'amount', type: 'number', required: true, placeholder: '100.00' },
      { name: 'payer_document', type: 'string', required: true, placeholder: '12345678900' },
      { name: 'payer_name', type: 'string', required: false, placeholder: 'Nome do Pagador' },
      { name: 'webhook_url', type: 'string', required: false, placeholder: 'https://seu-site.com/webhook' },
      { name: 'payer_ip', type: 'string', required: false, placeholder: '200.185.212.74' },
    ],
  },
  {
    method: 'GET',
    path: '/deposits',
    label: 'Listar Depósitos',
    params: [
      { name: 'status', type: 'string', required: false, placeholder: 'pending' },
      { name: 'per_page', type: 'number', required: false, placeholder: '15' },
    ],
  },
  {
    method: 'GET',
    path: '/deposits/{id}',
    label: 'Consultar Depósito',
    params: [
      { name: 'id', type: 'string', required: true, placeholder: 'uuid-do-deposito' },
    ],
  },
  {
    method: 'POST',
    path: '/withdrawals',
    label: 'Criar Saque',
    params: [
      { name: 'amount', type: 'number', required: true, placeholder: '100.00' },
      { name: 'pix_key', type: 'string', required: true, placeholder: 'email@exemplo.com' },
      { name: 'pix_key_type', type: 'string', required: true, placeholder: 'email' },
    ],
  },
  {
    method: 'GET',
    path: '/withdrawals',
    label: 'Listar Saques',
    params: [
      { name: 'status', type: 'string', required: false, placeholder: 'completed' },
      { name: 'per_page', type: 'number', required: false, placeholder: '15' },
    ],
  },
  {
    method: 'POST',
    path: '/payment-links',
    label: 'Criar Link de Pagamento',
    params: [
      { name: 'title', type: 'string', required: true, placeholder: 'Pagamento Consultoria' },
      { name: 'amount', type: 'number', required: false, placeholder: '150.00' },
      { name: 'description', type: 'string', required: false, placeholder: 'Descrição do pagamento' },
    ],
  },
  {
    method: 'POST',
    path: '/products',
    label: 'Criar Produto',
    params: [
      { name: 'name', type: 'string', required: true, placeholder: 'Curso de Marketing' },
      { name: 'price', type: 'number', required: true, placeholder: '197.00' },
      { name: 'webhook_url', type: 'string', required: false, placeholder: 'https://seu-site.com/webhook' },
    ],
  },
  {
    method: 'POST',
    path: '/webhooks',
    label: 'Registrar Webhook',
    params: [
      { name: 'url', type: 'string', required: true, placeholder: 'https://seu-site.com/webhook' },
      { name: 'events', type: 'string', required: true, placeholder: '["deposit.completed", "withdrawal.completed"]' },
    ],
  },
  {
    method: 'GET',
    path: '/reports/summary',
    label: 'Resumo Financeiro',
    params: [
      { name: 'date_from', type: 'string', required: false, placeholder: '2026-01-01' },
      { name: 'date_to', type: 'string', required: false, placeholder: '2026-01-31' },
    ],
  },
];

export default function ApiPlayground() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(endpoints[1]);
  const [apiKey, setApiKey] = useState('bpx_live_sua_chave_aqui');
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [useIdempotency, setUseIdempotency] = useState(true);
  const [generatedCode, setGeneratedCode] = useState('');
  const [activeLang, setActiveLang] = useState<'curl' | 'javascript' | 'php' | 'python'>('curl');

  const buildUrl = () => {
    let url = `https://buypix.me/api/v1${selectedEndpoint.path}`;
    if (selectedEndpoint.params.find(p => p.name === 'id') && paramValues['id']) {
      url = url.replace('{id}', paramValues['id']);
    }
    if (selectedEndpoint.method === 'GET' && selectedEndpoint.params.length > 0) {
      const queryParams = selectedEndpoint.params
        .filter(p => p.name !== 'id' && paramValues[p.name])
        .map(p => `${p.name}=${encodeURIComponent(paramValues[p.name])}`)
        .join('&');
      if (queryParams) url += `?${queryParams}`;
    }
    return url;
  };

  const generateCode = () => {
    const url = buildUrl();
    const isPost = selectedEndpoint.method === 'POST';
    const bodyParams = selectedEndpoint.params.filter(p => p.name !== 'id' && paramValues[p.name]);

    let body = '';
    if (isPost && bodyParams.length > 0) {
      const bodyObj: Record<string, string | number> = {};
      bodyParams.forEach(p => {
        if (p.name === 'events') {
          try { bodyObj[p.name] = JSON.parse(paramValues[p.name]); } catch { bodyObj[p.name] = paramValues[p.name]; }
        } else if (p.type === 'number') {
          bodyObj[p.name] = parseFloat(paramValues[p.name]) || 0;
        } else {
          bodyObj[p.name] = paramValues[p.name];
        }
      });
      body = JSON.stringify(bodyObj, null, 2);
    }

    switch (activeLang) {
      case 'curl':
        let curl = `curl -X ${selectedEndpoint.method} "${url}" \\\n  -H "Authorization: Bearer ${apiKey}"`;
        if (isPost) {
          curl += ` \\\n  -H "Content-Type: application/json"`;
          if (useIdempotency) curl += ` \\\n  -H "X-Idempotency-Key: $(uuidgen)"`;
          curl += ` \\\n  -d '${body}'`;
        }
        return curl;

      case 'javascript':
        let js = `const response = await fetch('${url}', {\n  method: '${selectedEndpoint.method}',\n  headers: {\n    'Authorization': 'Bearer ${apiKey}',`;
        if (isPost) {
          js += `\n    'Content-Type': 'application/json',`;
          if (useIdempotency) js += `\n    'X-Idempotency-Key': crypto.randomUUID(),`;
          js += `\n  },\n  body: JSON.stringify(${body.replace(/"/g, "'").replace(/\n/g, '\n  ')}),`;
        } else {
          js += `\n  },`;
        }
        js += `\n});\nconst data = await response.json();\nconsole.log(data);`;
        return js;

      case 'php':
        let php = `$ch = curl_init('${url}');\n$headers = [\n    'Authorization: Bearer ${apiKey}',`;
        if (isPost) {
          php += `\n    'Content-Type: application/json',`;
          if (useIdempotency) php += `\n    'X-Idempotency-Key: ' . uniqid(),`;
        }
        php += `\n];\ncurl_setopt_array($ch, [\n    CURLOPT_RETURNTRANSFER => true,`;
        if (isPost) {
          php += `\n    CURLOPT_POST => true,\n    CURLOPT_HTTPHEADER => $headers,\n    CURLOPT_POSTFIELDS => json_encode(${body.replace(/"/g, "'").replace(/\n/g, '\n    ')}),`;
        } else {
          php += `\n    CURLOPT_HTTPHEADER => $headers,`;
        }
        php += `\n]);\n$response = json_decode(curl_exec($ch), true);\ncurl_close($ch);\nvar_dump($response);`;
        return php;

      case 'python':
        let py = `import requests\n\n`;
        if (isPost) {
          py += `response = requests.post(\n    '${url}',\n    headers={\n        'Authorization': 'Bearer ${apiKey}',\n        'Content-Type': 'application/json',`;
          if (useIdempotency) py += `\n        'X-Idempotency-Key': 'uuid-unico',`;
          py += `\n    },\n    json=${body},\n)\ndata = response.json()\nprint(data)`;
        } else {
          py += `response = requests.get(\n    '${url}',\n    headers={'Authorization': 'Bearer ${apiKey}'},`;
          if (bodyParams.length > 0) {
            const params = bodyParams.map(p => `'${p.name}': '${paramValues[p.name]}'`).join(', ');
            py += `\n    params={${params}},`;
          }
          py += `\n)\ndata = response.json()\nprint(data)`;
        }
        return py;
    }
  };

  const handleGenerate = () => {
    setGeneratedCode(generateCode());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">🚀</span> API Playground
        </h1>
        <p className="text-gray-400 mt-1">Configure e gere código para qualquer endpoint da API BuyPix</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <div className="space-y-4">
          {/* API Key */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <label className="text-sm font-medium text-gray-300 mb-2 block">🔑 API Key</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-gray-300 focus:outline-none focus:border-green-500/50"
              placeholder="bpx_live_sua_chave_aqui"
            />
          </div>

          {/* Endpoint Selection */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <label className="text-sm font-medium text-gray-300 mb-2 block">📡 Endpoint</label>
            <select
              value={endpoints.indexOf(selectedEndpoint)}
              onChange={(e) => {
                setSelectedEndpoint(endpoints[parseInt(e.target.value)]);
                setParamValues({});
              }}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-green-500/50"
            >
              {endpoints.map((ep, i) => (
                <option key={i} value={i}>
                  {ep.method} {ep.path} — {ep.label}
                </option>
              ))}
            </select>
          </div>

          {/* Parameters */}
          {selectedEndpoint.params.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <label className="text-sm font-medium text-gray-300 mb-3 block">📝 Parâmetros</label>
              <div className="space-y-3">
                {selectedEndpoint.params.map((param) => (
                  <div key={param.name}>
                    <label className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                      <code className="text-green-400">{param.name}</code>
                      <span className="text-gray-600">({param.type})</span>
                      {param.required && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type={param.type === 'number' ? 'number' : 'text'}
                      value={paramValues[param.name] || ''}
                      onChange={(e) => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                      className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-gray-300 focus:outline-none focus:border-green-500/50"
                      placeholder={param.placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Options */}
          {selectedEndpoint.method === 'POST' && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useIdempotency}
                  onChange={(e) => setUseIdempotency(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-950 text-green-500 focus:ring-green-500/50"
                />
                <div>
                  <span className="text-sm text-gray-300">Usar Idempotência</span>
                  <p className="text-xs text-gray-500">Header X-Idempotency-Key (previne duplicidade)</p>
                </div>
              </label>
            </div>
          )}

          {/* Language selector */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <label className="text-sm font-medium text-gray-300 mb-2 block">💻 Linguagem</label>
            <div className="flex gap-2">
              {(['curl', 'javascript', 'php', 'python'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors capitalize ${
                    activeLang === lang
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'text-gray-500 hover:text-gray-300 bg-gray-800'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25"
          >
            ⚡ Gerar Código
          </button>
        </div>

        {/* Generated Code */}
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden sticky top-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                <span className="ml-2 text-xs text-gray-500 capitalize">{activeLang}</span>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(generatedCode)}
                className="text-xs text-gray-500 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-800"
              >
                📋 Copiar
              </button>
            </div>
            <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto min-h-[400px] bg-gray-950 leading-relaxed">
              <code>{generatedCode || '// Configure os parâmetros e clique em "Gerar Código"'}</code>
            </pre>
          </div>

          {/* Request Preview */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Preview da Requisição</h4>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                selectedEndpoint.method === 'POST' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {selectedEndpoint.method}
              </span>
              <code className="text-xs text-gray-400 font-mono truncate">{buildUrl()}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
