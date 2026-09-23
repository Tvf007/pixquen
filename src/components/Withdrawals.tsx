import CodeBlock from './CodeBlock';

export default function Withdrawals() {
  const createCurl = `curl -X POST https://buypix.me/api/v1/withdrawals \\
  -H "Authorization: Bearer bpx_live_sua_chave" \\
  -H "Content-Type: application/json" \\
  -H "X-Idempotency-Key: uuid-unico" \\
  -d '{
    "amount": 100.00,
    "pix_key": "email@exemplo.com",
    "pix_key_type": "email"
  }'`;

  const createJs = `const response = await fetch('https://buypix.me/api/v1/withdrawals', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer bpx_live_sua_chave',
    'Content-Type': 'application/json',
    'X-Idempotency-Key': crypto.randomUUID(),
  },
  body: JSON.stringify({
    amount: 100.00,
    pix_key: 'email@exemplo.com',
    pix_key_type: 'email',
  }),
});
const data = await response.json();`;

  const responseExample = `{
  "success": true,
  "message": "Saque criado com sucesso.",
  "data": {
    "id": "uuid-do-saque",
    "amount": 100.00,
    "fee_percent": 1.50,
    "fee_amount": 1.51,
    "net_amount": 100.00,
    "status": "awaiting_deposit",
    "pix_key": "email@exemplo.com",
    "pix_key_type": "email",
    "deposit_address": "VJL...endereço-de-deposito",
    "deposit_amount": 101.51,
    "expires_at": "2026-02-24T16:00:00+00:00"
  }
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">💸</span> Saques
        </h1>
        <p className="text-gray-400 mt-1">Converta DePix para PIX automaticamente (DePix → PIX)</p>
      </div>

      {/* Flow info */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-blue-400 mb-3">📋 Fluxo de Saque (2 etapas)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <div>
              <p className="text-sm font-medium text-gray-200">Crie o saque via API</p>
              <p className="text-xs text-gray-500">Receba deposit_address e deposit_amount</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">2</span>
            <div>
              <p className="text-sm font-medium text-gray-200">Envie DePix</p>
              <p className="text-xs text-gray-500">Para o endereço no valor exato antes do expires_at</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">3</span>
            <div>
              <p className="text-sm font-medium text-gray-200">PIX enviado automaticamente</p>
              <p className="text-xs text-gray-500">Sistema detecta depósito e envia PIX</p>
            </div>
          </div>
        </div>
      </div>

      {/* Endpoint */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">POST</span>
          <code className="text-sm text-gray-300 font-mono">https://buypix.me/api/v1/withdrawals</code>
        </div>
        <p className="text-sm text-gray-400">Cria um novo saque. Retorna endereço de depósito para envio de DePix.</p>
      </div>

      {/* Parameters */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Parâmetros</h3>
        <div className="space-y-3">
          {[
            { name: 'amount', type: 'number', required: true, desc: 'Valor em R$ que deseja receber (mín: 5, máx: 5000)' },
            { name: 'pix_key', type: 'string', required: true, desc: 'Chave PIX de destino' },
            { name: 'pix_key_type', type: 'string', required: true, desc: 'Tipo: cpf, cnpj, email, phone ou random' },
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
        }}
      />

      {/* Response */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Resposta (201)</h3>
        <pre className="bg-gray-950 rounded-lg p-4 text-sm font-mono text-gray-300 overflow-x-auto">
          {responseExample}
        </pre>
      </div>

      {/* Withdrawal Status */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Status do Saque</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { status: 'awaiting_deposit', desc: 'Aguardando envio de DePix', color: 'yellow' },
            { status: 'deposit_detected', desc: 'DePix detectado na rede', color: 'blue' },
            { status: 'confirmed', desc: 'DePix confirmado', color: 'blue' },
            { status: 'processing', desc: 'Processando conversão', color: 'purple' },
            { status: 'processing_pix', desc: 'Aguardando envio do PIX', color: 'orange' },
            { status: 'completed', desc: 'PIX enviado com sucesso ✅', color: 'green' },
            { status: 'expired', desc: 'Expirado (DePix não enviado)', color: 'gray' },
            { status: 'error', desc: 'Erro no processamento', color: 'red' },
          ].map((s) => {
            const colorMap: Record<string, string> = {
              yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
              green: 'bg-green-500/10 text-green-400 border-green-500/30',
              blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
              red: 'bg-red-500/10 text-red-400 border-red-500/30',
              purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
              gray: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
              orange: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
            };
            return (
              <div key={s.status} className={`p-3 rounded-lg border ${colorMap[s.color]}`}>
                <code className="text-xs font-bold">{s.status}</code>
                <p className="text-xs mt-1 opacity-80">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
