import { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const navItems: { page: Page; label: string; icon: string; group: string }[] = [
  { page: 'dashboard', label: 'Visão Geral', icon: '📊', group: 'Principal' },
  { page: 'deposits', label: 'Depósitos', icon: '💰', group: 'Transações' },
  { page: 'withdrawals', label: 'Saques', icon: '💸', group: 'Transações' },
  { page: 'payment-links', label: 'Links de Pagamento', icon: '🔗', group: 'Transações' },
  { page: 'products', label: 'Produtos', icon: '📦', group: 'Transações' },
  { page: 'webhooks', label: 'Webhooks', icon: '🔔', group: 'Configuração' },
  { page: 'reports', label: 'Relatórios', icon: '📈', group: 'Configuração' },
  { page: 'playground', label: 'API Playground', icon: '🚀', group: 'Ferramentas' },
  { page: 'webhook-verifier', label: 'Verificar Webhook', icon: '🔐', group: 'Ferramentas' },
];

export default function Sidebar({ currentPage, onNavigate, isOpen, onToggle }: SidebarProps) {
  const groups = ['Principal', 'Transações', 'Configuração', 'Ferramentas'];

  return (
    <aside className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 z-50 ${isOpen ? 'w-64' : 'w-16'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center font-bold text-sm text-white">
              BP
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              BuyPix
            </span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
        >
          <i className={`fas ${isOpen ? 'fa-chevron-left' : 'fa-chevron-right'} text-xs`}></i>
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-2 overflow-y-auto h-[calc(100%-80px)]">
        {groups.map((group) => (
          <div key={group} className="mb-4">
            {isOpen && (
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-3 mb-1">
                {group}
              </p>
            )}
            {navItems
              .filter((item) => item.group === group)
              .map((item) => (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-200 text-left ${
                    currentPage === item.page
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/10 text-green-400 border border-green-500/30'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  {isOpen && <span className="text-sm font-medium truncate">{item.label}</span>}
                </button>
              ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>API v1 • buypix.me</span>
          </div>
        </div>
      )}
    </aside>
  );
}
