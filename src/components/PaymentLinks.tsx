import CodeBlock from './CodeBlock';

export default function PaymentLinks() {
  const createCurl = `curl -X POST https://buypix.me/api/v1/payment-links \\
  -H "Authorization: Bearer bpx_live_sua_chave" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Pagamento Consultoria",
    "description": "Consultoria de marketing digital",
    "amount": 150.00,
    "require_payer_data": false,
    "pass_fees_to_payer": false
  }'`;

  const createJs = `const response = await fetch('https://buypix.me/api/v1/payment-links', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer bpx_live_sua_chave',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Pagamento Consultoria',
    amount: 150.00,
  }),
});
const data = await response.json();`;

  const responseExample = `{
  "success": true,
  "message": "Link de pagamento criado com sucesso.",
  "data": {
    "id": "uuid-do-link",
    "title": "Pagamento Consultoria",
    "slug": "xK3mN9pQ2w",
    "amount": 150.00,
    "is_active": true,
    "checkout_url": "https://buypix.me/pay/xK3mN9pQ2w",
    "description": null,
    "require_payer_data": false,
    "pass_fees_to_payer": false,
    "expires_at": null,
    "is_expired": false,
    "created_at": "2026-02-25T10:00:00Z"
  }
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">🔗</span> Links de Pagamento
        </h1>
        <p className="text-gray-400 mt-1">Crie links de pagamento com checkout hospedado pela BuyPix</p>
      </div>

      {/* Endpoints overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {[
          { method: 'POST', path: '/payment-links', desc: 'Criar' },
          { method: 'GET', path: '/payment-links', desc: 'Listar' },
          { method: 'GET', path: '/payment-links/{id}', desc: 'Consultar' },
          { method: 'PUT', path: '/payment-links/{id}', desc: 'Atualizar' },
          { method: 'DELETE', path: '/payment-links/{id}', desc: 'Desativar' },
        ].map((ep, i) => {
          const methodColors: Record<string, string> = {
            GET: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            POST: 'bg-green-500/20 text-green-400 border-green-500/30',
            PUT: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
          };
          return (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${methodColors[ep.method]}`}>
                {ep.method}
              </span>
              <p className="text-xs text-gray-400 mt-2 font-mono truncate">{ep.path}</p>
              <p className="text-xs text-gray-500 mt-1">{ep.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Create section */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">POST</span>
          <code className="text-sm text-gray-300 font-mono">https://buypix.me/api/v1/payment-links</code>
        </div>
        <p className="text-sm text-gray-400">Cria um novo link de pagamento e retorna a URL de checkout.</p>
      </div>

      {/* Parameters */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Parâmetros</h3>
        <div className="space-y-3">
          {[
            { name: 'title', type: 'string', required: true, desc: 'Título do link' },
            { name: 'description', type: 'string', required: false, desc: 'Descrição (máx: 500 caracteres)' },
            { name: 'amount', type: 'number', required: false, desc: 'Valor fixo em R$ (mín: 10). Vazio = valor aberto' },
            { name: 'slug', type: 'string', required: false, desc: 'Slug personalizado. Vazio = gerado automaticamente' },
            { name: 'require_payer_data', type: 'boolean', required: false, desc: 'Exigir dados do pagador no checkout' },
            { name: 'pass_fees_to_payer', type: 'boolean', required: false, desc: 'Repassar taxas ao pagador' },
            { name: 'expires_at', type: 'string', required: false, desc: 'Data de expiração (ISO 8601)' },
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

      <CodeBlock
        title="Exemplos de Código"
        examples={{
          cURL: createCurl,
          JavaScript: createJs,
        }}
      />

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Resposta (201)</h3>
        <pre className="bg-gray-950 rounded-lg p-4 text-sm font-mono text-gray-300 overflow-x-auto">
          {responseExample}
        </pre>
      </div>
    </div>
  );
}
