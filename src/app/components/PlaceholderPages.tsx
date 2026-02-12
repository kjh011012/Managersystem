import { Settings, Construction, FileText, Package, ShoppingCart, Megaphone } from 'lucide-react';

function PlaceholderPage({ title, description, icon: Icon }: { title: string; description: string; icon: React.ElementType }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[#1F2937]">{title}</h1>
        <p className="text-[0.85rem] text-gray-500 mt-1">{description}</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-gray-400" />
        </div>
        <h2 className="text-gray-600 mb-2">{title}</h2>
        <p className="text-[0.85rem] text-gray-400 max-w-md">
          이 페이지는 현재 개발 중입니다. 곧 업데이트될 예정입니다.
        </p>
        <div className="flex items-center gap-1.5 mt-4 text-[0.8rem] text-amber-600">
          <Construction className="w-4 h-4" />
          <span>개발 진행 중</span>
        </div>
      </div>
    </div>
  );
}

export function ContentsPage() {
  return <PlaceholderPage title="콘텐츠 관리" description="콘텐츠 등록, 수정, 게시 상를 관리합니다." icon={FileText} />;
}

export function ProductsPage() {
  return <PlaceholderPage title="특산품 관리" description="지역 특산품 상품 등록 및 재고를 관리합니다." icon={Package} />;
}

export function OrdersPage() {
  return <PlaceholderPage title="주문 관리" description="상품 주문 접수, 배송, 반품을 관리합니다." icon={ShoppingCart} />;
}

export function NewsPage() {
  return <PlaceholderPage title="소식 관리" description="공지사항, 이벤트, 소식을 관리합니다." icon={Megaphone} />;
}

export function SettingsPage() {
  return <PlaceholderPage title="설정" description="시스템 환경을 설정합니다." icon={Settings} />;
}