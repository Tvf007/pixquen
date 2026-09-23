import { useState } from 'react';

export default function WebhookVerifier() {
  const [payload, setPayload] = useState('');
  const [secret, setSecret] = useState('');
  const [signature, setSignature] = useState('');
  const [result, setResult] = useState<{ valid: boolean; expected: string } | null>(null);

  const verifySignature = async () => {
    if (!payload || !secret || !signature) return;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(payload);

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const sig = await crypto.subtle.sign('HMAC', key, messageData);
    const hashArray = Array.from(new Uint8Array(sig));
    const expected = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    setResult({
      valid: expected === signature.toLowerCase(),
      expected,
    });
  };

  const samplePayload = `{
  "event": "deposit.completed",
  "data": {
    "id": "uuid-do-deposito",
    "amount": 100.00,
    "status": "depix_sent",
    "confirmed_at": "2026-02-20T12:05:00Z"
  },
  "timestamp": "2026-02-20T12:05:00Z"
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">🔐</span> Verificador de Webhook
        </h1>
        <p className="text-gray-400 mt-1">Verifique a assinatura HMAC-SHA256 dos webhooks recebidos da BuyPix</p>
      </div>

      {/* Info */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-indigo-400 mb-3">🛡️ Como funciona a verificação</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p>1. Cada webhook inclui o header <code className="bg-indigo-500/20 px-1 rounded text-indigo-300">X-Webhook-Signature</code></p>
          <p>2. A assinatura é um hash <strong>HMAC-SHA256</strong> do body usando o <code className="bg-indigo-500/20 px-1 rounded text-indigo-300">secret</code> do webhook</p>
          <p>3. Compare a assinatura calculada com a recebida para validar a origem</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          {/* Secret */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              🔑 Webhook Secret
            </label>
            <input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-gray-300 focus:outline-none focus:border-indigo-500/50"
              placeholder="whsec_abc123..."
            />
            <p className="text-xs text-gray-500 mt-2">
              Obtido na criação do webhook (campo <code className="text-indigo-400">secret</code>)
            </p>
          </div>

          {/* Received Signature */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              📝 Assinatura Recebida (X-Webhook-Signature)
            </label>
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-gray-300 focus:outline-none focus:border-indigo-500/50"
              placeholder="hash_hmac_sha256_do_body"
            />
          </div>

          {/* Payload */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">
                📦 Payload (Body do Webhook)
              </label>
              <button
                onClick={() => setPayload(samplePayload)}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Usar exemplo
              </button>
            </div>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              rows={10}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm font-mono text-gray-300 focus:outline-none focus:border-indigo-500/50 resize-none"
              placeholder='{"event": "deposit.completed", "data": {...}}'
            />
          </div>

          <button
            onClick={verifySignature}
            disabled={!payload || !secret || !signature}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔍 Verificar Assinatura
          </button>
        </div>

        {/* Result */}
        <div className="space-y-4">
          {result && (
            <div className={`rounded-xl border p-6 ${
              result.valid
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{result.valid ? '✅' : '❌'}</span>
                <div>
                  <h3 className={`text-lg font-bold ${result.valid ? 'text-green-400' : 'text-red-400'}`}>
                    {result.valid ? 'Assinatura Válida!' : 'Assinatura Inválida!'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {result.valid
                      ? 'O webhook é autêntico e veio da BuyPix.'
                      : 'A assinatura não confere. O webhook pode ser fraudulento.'}
                  </p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-950 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Assinatura esperada:</p>
                <code className="text-xs text-gray-300 font-mono break-all">{result.expected}</code>
              </div>
              <div className="mt-3 p-3 bg-gray-950 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Assinatura recebida:</p>
                <code className="text-xs text-gray-300 font-mono break-all">{signature}</code>
              </div>
            </div>
          )}

          {!result && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
              <span className="text-4xl mb-3 block">🔐</span>
              <p className="text-gray-400 text-sm">
                Preencha os campos ao lado e clique em "Verificar Assinatura" para validar o webhook.
              </p>
            </div>
          )}

          {/* PHP verification code */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <span>💻</span> Verificação em PHP
            </h3>
            <pre className="bg-gray-950 rounded-lg p-4 text-sm font-mono text-gray-300 overflow-x-auto leading-relaxed">
{`$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'];
$secret = 'whsec_seu_secret_aqui';

$expected = hash_hmac('sha256', $payload, $secret);

if (hash_equals($expected, $signature)) {
    // Webhook válido ✅
    $data = json_decode($payload, true);
} else {
    // Assinatura inválida ❌
    http_response_code(401);
}`}
            </pre>
          </div>

          {/* Node.js verification */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <span>💻</span> Verificação em Node.js
            </h3>
            <pre className="bg-gray-950 rounded-lg p-4 text-sm font-mono text-gray-300 overflow-x-auto leading-relaxed">
{`const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  );
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
