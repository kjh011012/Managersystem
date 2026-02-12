import {
  LayoutDashboard,
  CalendarCheck,
  FileText,
  Package,
  ShoppingCart,
  MessageCircleQuestion,
  Megaphone,
  Wallet,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Leaf,
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
  { id: 'contents', label: '콘텐츠 관리', icon: FileText },
  { id: 'reservations', label: '예약 관리', icon: CalendarCheck },
  { id: 'products', label: '특산품 관리', icon: Package },
  { id: 'orders', label: '주문 관리', icon: ShoppingCart },
  { id: 'inquiries', label: '상품 문의', icon: MessageCircleQuestion },
  { id: 'news', label: '소식 관리', icon: Megaphone },
  { id: 'settlement', label: '정산 관리', icon: Wallet },
  { id: 'statistics', label: '통계', icon: BarChart3 },
  { id: 'settings', label: '설정', icon: Settings },
];

export function Sidebar({ currentPage, onPageChange, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 flex flex-col z-30 transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-[240px]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-gray-100 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[#5F7D65] flex items-center justify-center shrink-0">
          <Leaf className="w-4.5 h-4.5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-[#1F2937] text-[1rem] tracking-tight whitespace-nowrap">
            통합 관리 시스템
          </span>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-[0.875rem] ${
                    isActive
                      ? 'bg-[#5F7D65]/10 text-[#5F7D65]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#5F7D65]' : ''}`} />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors text-[0.8rem]"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span>사이드바 접기</span>}
        </button>
      </div>
    </aside>
  );
}
