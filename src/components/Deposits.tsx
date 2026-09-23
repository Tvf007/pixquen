import { useState } from 'react';
import CodeBlock from './CodeBlock';

export default function Deposits() {
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'get'>('create');

  const createCurl = `curl -X POST https://buypix.me/api/v1/deposits \\
  -H "Authorization: Bearer bpx_live_sua_chave" \\
  -H "Content-Type: application/json" \\
  -H "X-Idempotency-Key: uuid-unico" \\
  -d '{
    "amount": 100.00,
    "payer_document": "12345678900",
    "payer_name": "Cliente Teste",
    "webhook_url": "https://meu-site.com/callback",
    "payer_ip": "200.185.212.74"
  }'`;

  const createJs = `const response = await fetch('https://buypix.me/api/v1/deposits', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer bpx_live_sua_chave',
    'Content-Type': 'application/json',
    'X-Idempotency-Key': crypto.randomUUID(),
  },
  body: JSON.stringify({
    amount: 100.00,
    payer_document: '12345678900',
    payer_name: 'Cliente Teste',
    webhook_url: 'https://meu-site.com/callback',
    payer_ip: clientIp,
  }),
});
const data = await response.json();`;

  const createPhp = `$ch = curl_init('https://buypix.me/api/v1/deposits');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer bpx_live_sua_chave',
        'Content-Type: application/json',
        'X-Idempotency-Key: ' . uniqid(),
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'amount' => 100.00,
        'payer_document' => '12345678900',
        'payer_name' => 'Cliente Teste',
        'webhook_url' => 'https://meu-site.com/callback',
        'payer_ip' => $_SERVER['REMOTE_ADDR'],
    ]),
]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);`;

  const createPy = `import requests

response = requests.post(
    'https://buypix.me/api/v1/deposits',
    headers={
        'Authorization': 'Bearer bpx_live_sua_chave',
        'X-Idempotency-Key': 'uuid-unico',
    },
    json={
        'amount': 100.00,
        'payer_document': '12345678900',
        'payer_name': 'Cliente Teste',
        'webhook_url': 'https://meu-site.com/callback',
        'payer_ip': client_ip,
    },
)
data = response.json()`;

  const responseExample = `{
  "success": true,
  "message": "Depósito criado com sucesso.",
  "data": {
    "id": "uuid-do-deposito",
    "amount": 100.00,
    "fee_percent": 2.0,
    "fee_amount": 2.00,
    "net_amount": 98.00,
    "status": "pending",
    "pix_qr_code": "00020126...",
    "pix_qr_code_base64": "data:image/png;base64,...",
    "expires_at": "2026-02-20T12:30:00Z"
  }
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">💰</span> Depósitos
        </h1>
        <p className="text-gray-400 mt-1">Crie depósitos PIX e receba QR Codes para pagamento (PIX → DePix)</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-800 pb-0">
        {[
          { key: 'create', label: 'Criar Depósito', method: 'POST' },
          { key: 'list', label: 'Listar', method: 'GET' },
          { key: 'get', label: 'Consultar', method: 'GET' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.key
                ? 'bg-gray-800 text-green-400 border-b-2 border-green-400'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className={`text-xs font-bold mr-2 ${tab.method === 'POST' ? 'text-green-400' : 'text-blue-400'}`}>
              {tab.method}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'create' && (
        <div className="space-y-6">
          {/* Endpoint info */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">POST</span>
              <code className="text-sm text-gray-300 font-mono">https://buypix.me/api/v1/deposits</code>
            </div>
            <p className="text-sm text-gray-400">Cria um novo depósito e retorna o QR Code PIX para pagamento.</p>
          </div>

          {/* Parameters */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Parâmetros</h3>
            <div className="space-y-3">
              {[
                { name: 'amount', type: 'number', required: true, desc: 'Valor em R$ (mínimo: 5)' },
                { name: 'payer_document', type: 'string', required: true, desc: 'CPF (11 dígitos) ou CNPJ (14 dígitos) do pagador' },
                { name: 'payer_name', type: 'string', required: false, desc: 'Nome do pagador' },
                { name: 'payer_euid', type: 'string', required: false, desc: 'ID interno Eulen do pagador' },
                { name: 'webhook_url', type: 'string', required: false, desc: 'URL para callback ad-hoc desta transação' },
                { name: 'payer_ip', type: 'string', required: false, desc: 'IP real do cliente (IPv4 ou IPv6)' },
              ].map((param) => (
                <div key={param.name} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-green-400 font-mono">{param.name}</code>
                      <span className="text-xs text-gray-500">{param.type}</span>
                      {param.required && <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">obrigatório</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{param.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code examples */}
          <CodeBlock
            title="Exemplos de Código"
            examples={{
              cURL: createCurl,
              JavaScript: createJs,
              PHP: createPhp,
              Python: createPy,
            }}
          />

          {/* Response */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Resposta (201)</h3>
            <pre className="bg-gray-950 rounded-lg p-4 text-sm font-mono text-gray-300 overflow-x-auto">
              {responseExample}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">GET</span>
              <code className="text-sm text-gray-300 font-mono">https://buypix.me/api/v1/deposits</code>
            </div>
            <p className="text-sm text-gray-400">Lista depósitos com filtros e paginação.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Query Parameters</h3>
            <div className="space-y-3">
              {[
                { name: 'status', type: 'string', desc: 'Filtrar por status (pending, depix_sent, under_review, etc.)' },
                { name: 'date_from', type: 'string', desc: 'Data início (YYYY-MM-DD)' },
                { name: 'date_to', type: 'string', desc: 'Data fim (YYYY-MM-DD)' },
                { name: 'per_page', type: 'integer', desc: 'Itens por página (1-100, padrão: 15)' },
              ].map((param) => (
                <div key={param.name} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-blue-400 font-mono">{param.name}</code>
                      <span className="text-xs text-gray-500">{param.type}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{param.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <CodeBlock
            title="Exemplo"
            examples={{
              cURL: `curl -X GET "https://buypix.me/api/v1/deposits?status=pending&per_page=10" \\
  -H "Authorization: Bearer bpx_live_sua_chave"`,
              JavaScript: `const params = new URLSearchParams({ status: 'pending', per_page: '10' });
const response = await fetch(\`https://buypix.me/api/v1/deposits?\${params}\`, {
  headers: { 'Authorization': 'Bearer bpx_live_sua_chave' },
});
const data = await response.json();`,
            }}
          />
        </div>
      )}

      {activeTab === 'get' && (
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">GET</span>
              <code className="text-sm text-gray-300 font-mono">https://buypix.me/api/v1/deposits/&#123;id&#125;</code>
            </div>
            <p className="text-sm text-gray-400">Consulta detalhes de um depósito específico.</p>
          </div>

          <CodeBlock
            title="Exemplo"
            examples={{
              cURL: `curl -X GET https://buypix.me/api/v1/deposits/uuid-do-deposito \\
  -H "Authorization: Bearer bpx_live_sua_chave"`,
              JavaScript: `const depositId = 'uuid-do-deposito';
const response = await fetch(\`https://buypix.me/api/v1/deposits/\${depositId}\`, {
  headers: { 'Authorization': 'Bearer bpx_live_sua_chave' },
});
const data = await response.json();`,
            }}
          />
        </div>
      )}
    </div>
  );
}
