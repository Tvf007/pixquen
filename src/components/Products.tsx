import CodeBlock from './CodeBlock';

export default function Products() {
  const createCurl = `curl -X POST https://buypix.me/api/v1/products \\
  -H "Authorization: Bearer bpx_live_sua_chave" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Curso de Marketing",
    "price": 197.00,
    "description": "Curso completo de marketing digital",
    "webhook_url": "https://meu-site.com/webhook",
    "redirect_url": "https://meu-site.com/obrigado",
    "show_name_field": true,
    "show_email_field": true,
    "show_cpf_field": false
  }'`;

  const responseExample = `{
  "success": true,
  "message": "Produto criado com sucesso.",
  "data": {
    "id": "uuid-do-produto",
    "name": "Curso de Marketing",
    "slug": "curso-de-marketing-xK3mN9",
    "price": 197.00,
    "is_active": true,
    "checkout_url": "https://buypix.me/checkout/curso-de-marketing-xK3mN9",
    "webhook_url": "https://meu-site.com/webhook",
    "created_at": "2026-02-25T10:00:00Z"
  }
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">📦</span> Produtos
        </h1>
        <p className="text-gray-400 mt-1">Crie produtos digitais com checkout personalizado</p>
      </div>

      {/* Endpoints overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {[
          { method: 'POST', path: '/products', desc: 'Criar' },
          { method: 'GET', path: '/products', desc: 'Listar' },
          { method: 'GET', path: '/products/{id}', desc: 'Consultar' },
          { method: 'PUT', path: '/products/{id}', desc: 'Atualizar' },
          { method: 'DELETE', path: '/products/{id}', desc: 'Desativar' },
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

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">POST</span>
          <code className="text-sm text-gray-300 font-mono">https://buypix.me/api/v1/products</code>
        </div>
        <p className="text-sm text-gray-400">Cria um novo produto e retorna a URL de checkout.</p>
      </div>

      {/* Parameters */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Parâmetros</h3>
        <div className="space-y-3">
          {[
            { name: 'name', type: 'string', required: true, desc: 'Nome do produto' },
            { name: 'price', type: 'number', required: true, desc: 'Preço em R$ (mínimo: 10)' },
            { name: 'description', type: 'string', required: false, desc: 'Descrição (máx: 1000 caracteres)' },
            { name: 'slug', type: 'string', required: false, desc: 'Slug personalizado' },
            { name: 'redirect_url', type: 'string', required: false, desc: 'URL de redirecionamento após pagamento' },
            { name: 'webhook_url', type: 'string', required: false, desc: 'URL para notificação de pagamento' },
            { name: 'coupon_code', type: 'string', required: false, desc: 'Código do cupom de desconto' },
            { name: 'coupon_percentage', type: 'number', required: false, desc: 'Porcentagem de desconto (1-100)' },
            { name: 'pass_fees_to_payer', type: 'boolean', required: false, desc: 'Repassar taxas ao comprador' },
            { name: 'show_name_field', type: 'boolean', required: false, desc: 'Exibir campo nome no checkout' },
            { name: 'show_email_field', type: 'boolean', required: false, desc: 'Exibir campo e-mail no checkout' },
            { name: 'show_phone_field', type: 'boolean', required: false, desc: 'Exibir campo telefone no checkout' },
            { name: 'show_cpf_field', type: 'boolean', required: false, desc: 'Exibir campo CPF no checkout' },
            { name: 'facebook_pixel_id', type: 'string', required: false, desc: 'ID do Facebook Pixel para tracking' },
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
        title="Exemplo de Código"
        examples={{
          cURL: createCurl,
          JavaScript: `const response = await fetch('https://buypix.me/api/v1/products', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer bpx_live_sua_chave',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Curso de Marketing',
    price: 197.00,
    webhook_url: 'https://meu-site.com/webhook',
  }),
});
const data = await response.json();`,
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
