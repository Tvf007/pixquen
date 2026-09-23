import CodeBlock from './CodeBlock';

export default function Reports() {
  const curl = `curl -X GET "https://buypix.me/api/v1/reports/summary?date_from=2026-01-01&date_to=2026-01-31" \\
  -H "Authorization: Bearer bpx_live_sua_chave"`;

  const responseExample = `{
  "success": true,
  "data": {
    "period": {
      "from": "2026-01-01",
      "to": "2026-01-31"
    },
    "deposits": {
      "count": 150,
      "total_amount": 75000.00,
      "total_fees": 1500.00,
      "total_net": 73500.00
    },
    "withdrawals": {
      "count": 20,
      "total_amount": 10000.00,
      "total_fees": 150.00,
      "total_net": 9850.00
    },
    "commissions": {
      "count": 45,
      "total_amount": 450.00
    },
    "balance": 63200.50
  }
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">📈</span> Relatórios
        </h1>
        <p className="text-gray-400 mt-1">Consulte resumos financeiros de depósitos, saques e comissões</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">GET</span>
          <code className="text-sm text-gray-300 font-mono">https://buypix.me/api/v1/reports/summary</code>
        </div>
        <p className="text-sm text-gray-400">Retorna resumo de depósitos, saques e comissões em um período.</p>
      </div>

      {/* Parameters */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Query Parameters</h3>
        <div className="space-y-3">
          {[
            { name: 'date_from', type: 'string', desc: 'Data início (YYYY-MM-DD). Padrão: início do mês atual' },
            { name: 'date_to', type: 'string', desc: 'Data fim (YYYY-MM-DD). Padrão: hoje' },
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
        title="Exemplos de Código"
        examples={{
          cURL: curl,
          JavaScript: `const params = new URLSearchParams({ date_from: '2026-01-01', date_to: '2026-01-31' });
const response = await fetch(\`https://buypix.me/api/v1/reports/summary?\${params}\`, {
  headers: { 'Authorization': 'Bearer bpx_live_sua_chave' },
});
const data = await response.json();`,
          PHP: `$ch = curl_init('https://buypix.me/api/v1/reports/summary?date_from=2026-01-01&date_to=2026-01-31');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer bpx_live_sua_chave',
    ],
]);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);`,
          Python: `import requests

response = requests.get(
    'https://buypix.me/api/v1/reports/summary',
    headers={'Authorization': 'Bearer bpx_live_sua_chave'},
    params={'date_from': '2026-01-01', 'date_to': '2026-01-31'},
)
data = response.json()`,
        }}
      />

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Resposta (200)</h3>
        <pre className="bg-gray-950 rounded-lg p-4 text-sm font-mono text-gray-300 overflow-x-auto">
          {responseExample}
        </pre>
      </div>

      {/* Account endpoint */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <span>👤</span> Consultar Conta
        </h3>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">GET</span>
          <code className="text-sm text-gray-300 font-mono">https://buypix.me/api/v1/account</code>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Retorna informações da conta autenticada, incluindo saldo, tier, taxas, limites e código de indicação.
        </p>
        <pre className="bg-gray-950 rounded-lg p-4 text-sm font-mono text-gray-300 overflow-x-auto">
{`{
  "success": true,
  "data": {
    "id": 1,
    "name": "Empresa XYZ",
    "email": "contato@empresa.com",
    "balance": 1500.50,
    "commission_balance": 25.00,
    "tier": { "name": "Prata", "max_amount": 50000 },
    "fees": {
      "deposit_percent": 2.0,
      "deposit_fixed": 0.99,
      "withdrawal_percent": 1.5
    },
    "limits": {
      "min_amount": 10,
      "max_anonymous": 500,
      "daily_per_cpf": 5000
    },
    "referral_code": "ABC123"
  }
}`}
        </pre>
      </div>
    </div>
  );
}
