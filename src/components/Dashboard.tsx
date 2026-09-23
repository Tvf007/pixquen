import { Page } from '../App';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const endpoints = [
    { method: 'GET', path: '/account', desc: 'Informações da conta, saldo e taxas', color: 'blue' },
    { method: 'POST', path: '/deposits', desc: 'Criar novo depósito PIX', color: 'green' },
    { method: 'GET', path: '/deposits', desc: 'Listar depósitos', color: 'blue' },
    { method: 'GET', path: '/deposits/{id}', desc: 'Consultar depósito', color: 'blue' },
    { method: 'POST', path: '/withdrawals', desc: 'Criar novo saque', color: 'green' },
    { method: 'GET', path: '/withdrawals', desc: 'Listar saques', color: 'blue' },
    { method: 'GET', path: '/withdrawals/{id}', desc: 'Consultar saque', color: 'blue' },
    { method: 'POST', path: '/payment-links', desc: 'Criar link de pagamento', color: 'green' },
    { method: 'GET', path: '/payment-links', desc: 'Listar links', color: 'blue' },
    { method: 'GET', path: '/payment-links/{id}', desc: 'Consultar link', color: 'blue' },
    { method: 'PUT', path: '/payment-links/{id}', desc: 'Atualizar link', color: 'yellow' },
    { method: 'DELETE', path: '/payment-links/{id}', desc: 'Desativar link', color: 'red' },
    { method: 'POST', path: '/products', desc: 'Criar produto', color: 'green' },
    { method: 'GET', path: '/products', desc: 'Listar produtos', color: 'blue' },
    { method: 'GET', path: '/products/{id}', desc: 'Consultar produto', color: 'blue' },
    { method: 'PUT', path: '/products/{id}', desc: 'Atualizar produto', color: 'yellow' },
    { method: 'DELETE', path: '/products/{id}', desc: 'Desativar produto', color: 'red' },
    { method: 'GET', path: '/reports/summary', desc: 'Resumo financeiro', color: 'blue' },
    { method: 'POST', path: '/webhooks', desc: 'Registrar webhook', color: 'green' },
    { method: 'GET', path: '/webhooks', desc: 'Listar webhooks', color: 'blue' },
    { method: 'DELETE', path: '/webhooks/{id}', desc: 'Remover webhook', color: 'red' },
  ];

  const methodColors: Record<string, string> = {
    GET: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    POST: 'bg-green-500/20 text-green-400 border-green-500/30',
    PUT: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent border border-green-500/20 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              BuyPix API
            </span>{' '}
            Integration Dashboard
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Integre operações PIX ↔ DePix (Liquid Network) diretamente no seu sistema.
            Crie depósitos, gerencie saques, links de pagamento e receba webhooks em tempo real.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => onNavigate('playground')}
              className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25"
            >
              🚀 API Playground
            </button>
            <button
              onClick={() => onNavigate('webhook-verifier')}
              className="px-5 py-2.5 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-all border border-gray-700"
            >
              🔐 Verificar Webhook
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Base URL', value: 'buypix.me/api/v1', icon: '🌐' },
          { label: 'Autenticação', value: 'Bearer Token', icon: '🔑' },
          { label: 'Rate Limit', value: '1.000 req/hora', icon: '⚡' },
          { label: 'Endpoints', value: '21 disponíveis', icon: '📡' },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
                <p className="text-sm font-semibold text-gray-200">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Start */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>⚡</span> Quick Start
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="text-sm font-medium">Obtenha sua API Key</p>
                <p className="text-xs text-gray-500">Gere em buypix.me/app/api-keys</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="text-sm font-medium">Configure autenticação</p>
                <p className="text-xs text-gray-500">Use header Authorization: Bearer bpx_live_xxx</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p className="text-sm font-medium">Crie seu primeiro depósito</p>
                <p className="text-xs text-gray-500">POST /deposits com amount e payer_document</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold">4</span>
              <div>
                <p className="text-sm font-medium">Configure webhooks</p>
                <p className="text-xs text-gray-500">Receba notificações em tempo real</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📋</span> Primeiro Request
          </h3>
          <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <div className="text-gray-500"># Criar depósito PIX</div>
            <div className="mt-1">
              <span className="text-green-400">curl</span> -X POST \<br />
              <span className="text-gray-400">  https://buypix.me/api/v1/deposits</span> \<br />
              <span className="text-gray-400">  -H "Authorization: Bearer bpx_live_xxx"</span> \<br />
              <span className="text-gray-400">  -H "Content-Type: application/json"</span> \<br />
              <span className="text-gray-400">  -H "X-Idempotency-Key: uuid-unico"</span> \<br />
              <span className="text-gray-400">  -d &apos;{'{'}"amount": 100.00, "payer_document": "12345678900", "payer_name": "Cliente Teste"{'}'}&apos;</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-xs text-yellow-400">
              💡 <strong>Dica:</strong> Use o header <code className="bg-yellow-500/20 px-1 rounded">X-Idempotency-Key</code> para prevenir transações duplicadas.
            </p>
          </div>
        </div>
      </div>

      {/* API Endpoints Reference */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span>📡</span> Todos os Endpoints
          </h3>
          <p className="text-sm text-gray-500 mt-1">Referência completa da API REST BuyPix v1</p>
        </div>
        <div className="divide-y divide-gray-800/50">
          {endpoints.map((ep, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-800/30 transition-colors">
              <span className={`text-xs font-bold px-2.5 py-1 rounded border ${methodColors[ep.method]} min-w-[60px] text-center`}>
                {ep.method}
              </span>
              <code className="text-sm text-gray-300 font-mono flex-1">
                /api/v1{ep.path}
              </code>
              <span className="text-xs text-gray-500 hidden md:block">{ep.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deposit Status Reference */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>📊</span> Status dos Depósitos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { status: 'pending', desc: 'Aguardando pagamento PIX', color: 'yellow' },
            { status: 'depix_sent', desc: 'PIX recebido, DePix enviado', color: 'green' },
            { status: 'under_review', desc: 'Em análise pela equipe', color: 'blue' },
            { status: 'canceled', desc: 'Cancelado', color: 'red' },
            { status: 'error', desc: 'Erro no processamento', color: 'red' },
            { status: 'refunded', desc: 'Reembolsado via PIX', color: 'purple' },
            { status: 'expired', desc: 'QR Code expirado', color: 'gray' },
            { status: 'pending_pix2fa', desc: 'Aguardando Pix 2FA', color: 'orange' },
            { status: 'delayed', desc: 'Processamento atrasado', color: 'orange' },
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
