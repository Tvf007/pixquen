import CodeBlock from './CodeBlock';

export default function Webhooks() {
  const createCurl = `curl -X POST https://buypix.me/api/v1/webhooks \\
  -H "Authorization: Bearer bpx_live_sua_chave" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://meu-site.com/webhook",
    "events": ["deposit.completed", "withdrawal.completed"]
  }'`;

  const responseExample = `{
  "success": true,
  "message": "Webhook endpoint registrado com sucesso.",
  "data": {
    "id": "uuid-do-endpoint",
    "url": "https://meu-site.com/webhook",
    "events": ["deposit.completed", "withdrawal.completed"],
    "secret": "whsec_abc123...",
    "is_active": true
  }
}`;

  const events = [
    { event: 'deposit.created', desc: 'Novo depósito criado' },
    { event: 'deposit.completed', desc: 'Depósito confirmado (PIX recebido, DePix enviado)' },
    { event: 'deposit.expired', desc: 'Depósito expirado (QR Code não pago a tempo)' },
    { event: 'deposit.error', desc: 'Erro no processamento do depósito' },
    { event: 'deposit.under_review', desc: 'Depósito em análise/revisão pela equipe' },
    { event: 'deposit.canceled', desc: 'Depósito cancelado' },
    { event: 'deposit.refunded', desc: 'Depósito reembolsado (valor devolvido via PIX)' },
    { event: 'deposit.delayed', desc: 'Depósito com processamento atrasado' },
    { event: 'deposit.pending_pix2fa', desc: 'Aguardando verificação de segurança (Pix 2FA)' },
    { event: 'withdrawal.created', desc: 'Saque criado — endereço de depósito gerado' },
    { event: 'withdrawal.completed', desc: 'Saque concluído — PIX enviado com sucesso' },
    { event: 'withdrawal.failed', desc: 'Erro no processamento do saque' },
    { event: '*', desc: 'Todos os eventos (wildcard)' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">🔔</span> Webhooks
        </h1>
        <p className="text-gray-400 mt-1">Receba notificações em tempo real quando eventos ocorrerem na sua conta</p>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-purple-400 mb-3">🔧 Como Funcionam</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p>• Chamadas HTTP POST enviadas para sua URL quando um evento ocorre</p>
          <p>• Cada chamada inclui assinatura <code className="bg-purple-500/20 px-1 rounded text-purple-300">HMAC-SHA256</code> para verificação</p>
          <p>• Máximo de <strong>5 endpoints</strong> por conta</p>
          <p>• Endpoint deve responder com <strong>HTTP 200</strong> em até <strong>30 segundos</strong></p>
          <p>• Após <strong>3 falhas consecutivas</strong>, o webhook é desativado automaticamente</p>
        </div>
      </div>

      {/* Webhook Ad-Hoc */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <span>⚡</span> Webhook Dinâmico (Ad-Hoc)
        </h3>
        <p className="text-sm text-gray-400 mb-3">
          Envie o campo <code className="bg-gray-800 px-1.5 py-0.5 rounded text-green-400">webhook_url</code> diretamente 
          no POST /deposits para receber callbacks naquela URL específica para aquela transação.
        </p>
        <pre className="bg-gray-950 rounded-lg p-4 text-sm font-mono text-gray-300 overflow-x-auto">
{`POST /api/v1/deposits
{
    "amount": 100.00,
    "webhook_url": "https://meu-site.com/callback"
}`}
        </pre>
      </div>

      {/* Events */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Eventos Disponíveis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {events.map((e) => (
            <div key={e.event} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
              <code className="text-xs text-purple-400 font-mono flex-shrink-0 mt-0.5">{e.event}</code>
              <span className="text-xs text-gray-500">{e.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Headers */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Headers Enviados</h3>
        <pre className="bg-gray-950 rounded-lg p-4 text-sm font-mono text-gray-300 overflow-x-auto">
{`X-Webhook-Signature: hash_hmac_sha256_do_body
X-Webhook-Event: deposit.completed
X-Webhook-Timestamp: 2026-02-20T12:00:00Z
User-Agent: BuyPix-Webhook/1.0`}
        </pre>
      </div>

      {/* Create webhook */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">POST</span>
          <code className="text-sm text-gray-300 font-mono">https://buypix.me/api/v1/webhooks</code>
        </div>
        <p className="text-sm text-gray-400">Registrar um novo endpoint de webhook (máximo 5 por conta).</p>
      </div>

      <CodeBlock
        title="Registrar Webhook"
        examples={{
          cURL: createCurl,
          JavaScript: `const response = await fetch('https://buypix.me/api/v1/webhooks', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer bpx_live_sua_chave',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://meu-site.com/webhook',
    events: ['deposit.completed', 'withdrawal.completed'],
  }),
});
const data = await response.json();
// Guarde data.data.secret em local seguro!`,
        }}
      />

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Resposta (201)</h3>
        <pre className="bg-gray-950 rounded-lg p-4 text-sm font-mono text-gray-300 overflow-x-auto">
          {responseExample}
        </pre>
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-xs text-yellow-400">
            ⚠️ <strong>Importante:</strong> O campo <code className="bg-yellow-500/20 px-1 rounded">secret</code> é retornado apenas na criação. Guarde-o em local seguro!
          </p>
        </div>
      </div>

      {/* PHP Handler Example */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <span>🛡️</span> Handler PHP Completo
        </h3>
        <pre className="bg-gray-950 rounded-lg p-4 text-sm font-mono text-gray-300 overflow-x-auto leading-relaxed">
{`<?php
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'] ?? '';
$secret = 'whsec_seu_secret_aqui';

$expected = hash_hmac('sha256', $payload, $secret);
if (!hash_equals($expected, $signature)) {
    http_response_code(401);
    exit('Assinatura inválida');
}

$event = json_decode($payload, true);

switch ($event['event']) {
    case 'deposit.completed':
        // Pagamento confirmado — liberar produto/serviço
        break;
    case 'deposit.under_review':
        // Depósito em análise — aguardar resolução
        break;
    case 'deposit.canceled':
        // Depósito cancelado
        break;
    case 'deposit.refunded':
        // Depósito reembolsado
        break;
    case 'withdrawal.completed':
        // PIX enviado com sucesso
        break;
}

http_response_code(200);
echo json_encode(['received' => true]);`}
        </pre>
      </div>
    </div>
  );
}
