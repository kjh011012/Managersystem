import { useState } from 'react';
import { Toaster } from 'sonner';
import { Bell, ChevronDown, Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ReservationManagement } from './components/ReservationManagement';
import {
  ContentsPage,
  ProductsPage,
  OrdersPage,
  NewsPage,
  SettingsPage,
} from './components/PlaceholderPages';
import { InquiriesPage } from './components/InquiriesPage';
import { StatisticsPage } from './components/StatisticsPage';
import { SettlementPage } from './components/SettlementPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'reservations':
        return <ReservationManagement />;
      case 'contents':
        return <ContentsPage />;
      case 'products':
        return <ProductsPage />;
      case 'orders':
        return <OrdersPage />;
      case 'inquiries':
        return <InquiriesPage />;
      case 'news':
        return <NewsPage />;
      case 'settlement':
        return <SettlementPage />;
      case 'statistics':
        return <StatisticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <Toaster position="top-right" richColors />

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - desktop */}
      <div className="hidden lg:block">
        <Sidebar
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            setMobileMenuOpen(false);
          }}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Sidebar - mobile */}
      <div className={`lg:hidden fixed z-30 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            setMobileMenuOpen(false);
          }}
          collapsed={false}
          onToggleCollapse={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[240px]'
        }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="flex items-center justify-between px-4 lg:px-6 h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-[0.85rem] text-gray-400 hidden sm:block">
                {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="hidden sm:flex items-center gap-2 ml-2 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-[#5F7D65] flex items-center justify-center">
                  <span className="text-white text-[0.7rem]">관리</span>
                </div>
                <div className="flex items-center gap-1 cursor-pointer">
                  <span className="text-[0.8rem] text-gray-700">관리자</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6 max-w-[1440px]">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}