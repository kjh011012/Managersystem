import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircleQuestion,
  Search,
  ChevronDown,
  ChevronLeft,
  Clock,
  CheckCircle2,
  PauseCircle,
  AlertTriangle,
  Send,
  User,
  Phone,
  Mail,
  Tag,
  CalendarDays,
  Package,
  CalendarCheck,
  CornerDownRight,
  Inbox,
  MessageSquareText,
  RotateCcw,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  mockReservationInquiries,
  mockProductInquiries,
} from './inquiriesData';
import type { Inquiry, InquiryStatus, InquiryPriority } from './inquiriesData';

// ─── Status / Priority Tags ──────────────────────────────
function InquiryStatusTag({ status }: { status: InquiryStatus }) {
  const map: Record<InquiryStatus, { bg: string; text: string; icon: React.ElementType }> = {
    '답변대기': { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
    '답변완료': { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle2 },
    '보류': { bg: 'bg-gray-200', text: 'text-gray-600', icon: PauseCircle },
  };
  const c = map[status];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.75rem] ${c.bg} ${c.text}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

function PriorityTag({ priority }: { priority: InquiryPriority }) {
  const map: Record<InquiryPriority, { bg: string; text: string }> = {
    '높음': { bg: 'bg-red-100', text: 'text-red-700' },
    '보통': { bg: 'bg-blue-100', text: 'text-blue-700' },
    '낮음': { bg: 'bg-gray-100', text: 'text-gray-500' },
  };
  const c = map[priority];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[0.7rem] ${c.bg} ${c.text}`}>
      {priority}
    </span>
  );
}

function SubcategoryTag({ sub }: { sub: string }) {
  if (!sub) return null;
  const map: Record<string, { bg: string; text: string }> = {
    '체험': { bg: 'bg-violet-100', text: 'text-violet-700' },
    '숙소': { bg: 'bg-teal-100', text: 'text-teal-700' },
    '식사': { bg: 'bg-orange-100', text: 'text-orange-700' },
  };
  const c = map[sub] || { bg: 'bg-gray-100', text: 'text-gray-500' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[0.7rem] ${c.bg} ${c.text}`}>
      {sub}
    </span>
  );
}

// ─── Summary Cards ───────────────────────────────────────
function InquirySummaryCards({ data }: { data: Inquiry[] }) {
  const waiting = data.filter((d) => d.status === '답변대기').length;
  const completed = data.filter((d) => d.status === '답변완료').length;
  const held = data.filter((d) => d.status === '보류').length;
  const highPriority = data.filter((d) => d.priority === '높음' && d.status === '답변대기').length;

  const cards = [
    { label: '전체 문의', value: data.length, icon: Inbox, color: 'text-[#5F7D65]', bg: 'bg-[#5F7D65]/10' },
    { label: '답변 대기', value: waiting, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: '답변 완료', value: completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: '긴급 대기', value: highPriority, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[0.8rem] text-gray-500">{card.label}</span>
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <div className={`text-[1.5rem] ${card.color}`}>{card.value}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Filter Bar ──────────────────────────────────────────
interface InquiryFilterState {
  status: string;
  priority: string;
  search: string;
}

function InquiryFilterBar({
  filters,
  onFilterChange,
  category,
}: {
  filters: InquiryFilterState;
  onFilterChange: (f: InquiryFilterState) => void;
  category: '예약' | '특산품';
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="고객명, 제목, 상품명 검색..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="w-full pl-9 pr-3 py-2 text-[0.85rem] rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#5F7D65] focus:ring-1 focus:ring-[#5F7D65]/20 transition-all outline-none"
        />
      </div>

      {/* Status filter */}
      <div className="relative">
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          className="appearance-none pl-3 pr-8 py-2 text-[0.85rem] rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#5F7D65] transition-all outline-none cursor-pointer"
        >
          <option value="">상태 전체</option>
          <option value="답변대기">답변대기</option>
          <option value="답변완료">답변완료</option>
          <option value="보류">보류</option>
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
      </div>

      {/* Priority filter */}
      <div className="relative">
        <select
          value={filters.priority}
          onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
          className="appearance-none pl-3 pr-8 py-2 text-[0.85rem] rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#5F7D65] transition-all outline-none cursor-pointer"
        >
          <option value="">우선순위 전체</option>
          <option value="높음">높음</option>
          <option value="보통">보통</option>
          <option value="낮음">낮음</option>
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
      </div>

      {/* Reset */}
      {(filters.status || filters.priority || filters.search) && (
        <button
          onClick={() => onFilterChange({ status: '', priority: '', search: '' })}
          className="flex items-center gap-1.5 text-[0.8rem] text-gray-500 hover:text-gray-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          초기화
        </button>
      )}
    </div>
  );
}

// ─── Inquiry Table ───────────────────────────────────────
function InquiryTable({
  data,
  onViewDetail,
  category,
}: {
  data: Inquiry[];
  onViewDetail: (inquiry: Inquiry) => void;
  category: '예약' | '특산품';
}) {
  const [sortField, setSortField] = useState<'createdAt' | 'priority'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (sortField === 'createdAt') {
        return sortDir === 'desc'
          ? b.createdAt.localeCompare(a.createdAt)
          : a.createdAt.localeCompare(b.createdAt);
      }
      const priorityOrder: Record<string, number> = { '높음': 0, '보통': 1, '낮음': 2 };
      const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
      return sortDir === 'desc' ? -diff : diff;
    });
  }, [data, sortField, sortDir]);

  const toggleSort = (field: 'createdAt' | 'priority') => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-16">
        <MessageCircleQuestion className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-[0.9rem] text-gray-400">검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[0.85rem]">
        <thead>
          <tr className="border-b border-gray-100 text-left">
            <th className="py-3 px-3 text-gray-500 text-[0.75rem]">번호</th>
            {category === '예약' && (
              <th className="py-3 px-3 text-gray-500 text-[0.75rem]">유형</th>
            )}
            <th className="py-3 px-3 text-gray-500 text-[0.75rem]">제목</th>
            <th className="py-3 px-3 text-gray-500 text-[0.75rem] hidden md:table-cell">
              {category === '예약' ? '관련 상품' : '관련 특산품'}
            </th>
            <th className="py-3 px-3 text-gray-500 text-[0.75rem]">고객</th>
            <th className="py-3 px-3 text-gray-500 text-[0.75rem]">상태</th>
            <th
              className="py-3 px-3 text-gray-500 text-[0.75rem] cursor-pointer select-none hover:text-gray-700 transition-colors"
              onClick={() => toggleSort('priority')}
            >
              <span className="flex items-center gap-1">
                우선순위
                {sortField === 'priority' && (
                  <ChevronDown className={`w-3 h-3 transition-transform ${sortDir === 'asc' ? 'rotate-180' : ''}`} />
                )}
              </span>
            </th>
            <th
              className="py-3 px-3 text-gray-500 text-[0.75rem] hidden lg:table-cell cursor-pointer select-none hover:text-gray-700 transition-colors"
              onClick={() => toggleSort('createdAt')}
            >
              <span className="flex items-center gap-1">
                등록일
                {sortField === 'createdAt' && (
                  <ChevronDown className={`w-3 h-3 transition-transform ${sortDir === 'asc' ? 'rotate-180' : ''}`} />
                )}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((inquiry) => (
            <tr
              key={inquiry.id}
              onClick={() => onViewDetail(inquiry)}
              className="border-b border-gray-50 hover:bg-gray-50/60 cursor-pointer transition-colors group"
            >
              <td className="py-3 px-3 text-gray-400 text-[0.8rem]">{inquiry.id}</td>
              {category === '예약' && (
                <td className="py-3 px-3">
                  <SubcategoryTag sub={inquiry.subcategory} />
                </td>
              )}
              <td className="py-3 px-3">
                <div className="flex items-center gap-1.5">
                  {inquiry.isPrivate && <Lock className="w-3 h-3 text-gray-400 shrink-0" />}
                  <span className="text-gray-800 group-hover:text-[#5F7D65] transition-colors line-clamp-1 max-w-[200px] lg:max-w-[300px]">
                    {inquiry.subject}
                  </span>
                  {inquiry.reply && (
                    <span className="shrink-0 inline-flex items-center gap-0.5 text-[0.7rem] text-emerald-600">
                      <MessageSquareText className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3 px-3 text-gray-500 hidden md:table-cell">
                <span className="line-clamp-1 max-w-[180px]">{inquiry.relatedItemName}</span>
              </td>
              <td className="py-3 px-3 text-gray-700">{inquiry.customerName}</td>
              <td className="py-3 px-3">
                <InquiryStatusTag status={inquiry.status} />
              </td>
              <td className="py-3 px-3">
                <PriorityTag priority={inquiry.priority} />
              </td>
              <td className="py-3 px-3 text-gray-400 text-[0.8rem] hidden lg:table-cell whitespace-nowrap">
                {inquiry.createdAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Inquiry Detail ──────────────────────────────────────
function InquiryDetail({
  inquiry,
  onBack,
  onStatusChange,
  onReply,
}: {
  inquiry: Inquiry;
  onBack: () => void;
  onStatusChange: (id: string, status: InquiryStatus) => void;
  onReply: (id: string, content: string) => void;
}) {
  const [replyText, setReplyText] = useState('');
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const handleReply = () => {
    if (!replyText.trim()) {
      toast.error('답변 내용을 입력해주세요.');
      return;
    }
    onReply(inquiry.id, replyText.trim());
    setReplyText('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-[#1F2937]">문의 상세</h2>
            <InquiryStatusTag status={inquiry.status} />
            <PriorityTag priority={inquiry.priority} />
            {inquiry.isPrivate && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.7rem] bg-gray-100 text-gray-500">
                <Lock className="w-3 h-3" /> 비공개
              </span>
            )}
          </div>
          <p className="text-[0.8rem] text-gray-400 mt-0.5">{inquiry.id}</p>
        </div>
        {/* Status change */}
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="flex items-center gap-1.5 px-3 py-2 text-[0.85rem] rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            상태 변경
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showStatusMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowStatusMenu(false)} />
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-20 py-1 min-w-[120px]">
                {(['답변대기', '답변완료', '보류'] as InquiryStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      onStatusChange(inquiry.id, s);
                      setShowStatusMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-[0.85rem] hover:bg-gray-50 transition-colors ${
                      inquiry.status === s ? 'text-[#5F7D65] bg-[#5F7D65]/5' : 'text-gray-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Inquiry content */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-[#1F2937] mb-3">{inquiry.subject}</h3>
            <div className="flex items-center gap-3 mb-4 text-[0.8rem] text-gray-500">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {inquiry.customerName}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" />
                {inquiry.createdAt}
              </span>
              {inquiry.subcategory && <SubcategoryTag sub={inquiry.subcategory} />}
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-[0.85rem] text-gray-700 leading-relaxed whitespace-pre-wrap">
              {inquiry.content}
            </div>
          </div>

          {/* Existing reply */}
          {inquiry.reply && (
            <div className="bg-white rounded-xl border border-emerald-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <CornerDownRight className="w-4 h-4 text-emerald-500" />
                <span className="text-[0.9rem] text-emerald-700">관리자 답변</span>
                <span className="text-[0.75rem] text-gray-400 ml-auto">{inquiry.reply.repliedAt}</span>
              </div>
              <div className="bg-emerald-50/50 rounded-lg p-4 text-[0.85rem] text-gray-700 leading-relaxed whitespace-pre-wrap">
                {inquiry.reply.content}
              </div>
              <div className="mt-2 text-[0.75rem] text-gray-400">
                답변자: {inquiry.reply.repliedBy}
              </div>
            </div>
          )}

          {/* Reply form */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h4 className="text-gray-700 mb-3 flex items-center gap-2">
              <Send className="w-4 h-4 text-[#5F7D65]" />
              {inquiry.reply ? '추가 답변 작성' : '답변 작성'}
            </h4>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="답변 내용을 입력하세요..."
              rows={5}
              className="w-full px-4 py-3 text-[0.85rem] rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#5F7D65] focus:ring-1 focus:ring-[#5F7D65]/20 transition-all outline-none resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-[0.75rem] text-gray-400">
                답변 등록 시 고객에게 알림이 발송됩니다.
              </span>
              <button
                onClick={handleReply}
                disabled={!replyText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 text-[0.85rem] rounded-lg bg-[#5F7D65] text-white hover:bg-[#4e6b54] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                답변 등록
              </button>
            </div>
          </div>
        </div>

        {/* Right: info sidebar */}
        <div className="space-y-5">
          {/* Customer info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h4 className="text-gray-700 mb-3">고객 정보</h4>
            <div className="space-y-3 text-[0.85rem]">
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{inquiry.customerName}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{inquiry.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{inquiry.email}</span>
              </div>
            </div>
          </div>

          {/* Related item */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h4 className="text-gray-700 mb-3">
              {inquiry.category === '예약' ? '관련 예약' : '관련 특산품'}
            </h4>
            <div className="space-y-3 text-[0.85rem]">
              <div className="flex items-center gap-2.5">
                {inquiry.category === '예약' ? (
                  <CalendarCheck className="w-4 h-4 text-gray-400" />
                ) : (
                  <Package className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-gray-700">{inquiry.relatedItemName}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500 text-[0.8rem]">{inquiry.relatedItemId}</span>
              </div>
            </div>
            <button className="mt-3 text-[0.8rem] text-[#5F7D65] hover:underline transition-colors">
              {inquiry.category === '예약' ? '예약 상세 보기 →' : '상품 상세 보기 →'}
            </button>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h4 className="text-gray-700 mb-3">빠른 작업</h4>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onStatusChange(inquiry.id, '답변완료');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[0.85rem] rounded-lg border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                답변완료 처리
              </button>
              <button
                onClick={() => {
                  onStatusChange(inquiry.id, '보류');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[0.85rem] rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-700 transition-all"
              >
                <PauseCircle className="w-4 h-4" />
                보류 처리
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Tab Bar (internal) ──────────────────────────────────
function InquiryTabs({
  activeTab,
  onTabChange,
  reservationCount,
  productCount,
}: {
  activeTab: '예약' | '특산품';
  onTabChange: (tab: '예약' | '특산품') => void;
  reservationCount: number;
  productCount: number;
}) {
  const tabs = [
    { id: '예약' as const, label: '예약 문의', count: reservationCount, icon: CalendarCheck },
    { id: '특산품' as const, label: '특산품 문의', count: productCount, icon: Package },
  ];

  return (
    <div className="border-b border-gray-200">
      <div className="flex gap-0 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-5 py-3 text-[0.875rem] whitespace-nowrap transition-colors ${
                isActive ? 'text-[#5F7D65]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Icon className="w-4 h-4" />
                {tab.label}
                <span
                  className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[0.7rem] ${
                    isActive ? 'bg-[#5F7D65]/10 text-[#5F7D65]' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tab.count}
                </span>
              </span>
              {isActive && (
                <motion.div
                  layoutId="inquiryActiveTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5F7D65]"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────
export function InquiriesPage() {
  const [activeTab, setActiveTab] = useState<'예약' | '특산품'>('예약');
  const [reservationInquiries, setReservationInquiries] = useState<Inquiry[]>(mockReservationInquiries);
  const [productInquiries, setProductInquiries] = useState<Inquiry[]>(mockProductInquiries);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filters, setFilters] = useState<InquiryFilterState>({
    status: '',
    priority: '',
    search: '',
  });

  const currentData = activeTab === '예약' ? reservationInquiries : productInquiries;

  const filteredData = useMemo(() => {
    let data = [...currentData];
    if (filters.status) {
      data = data.filter((d) => d.status === filters.status);
    }
    if (filters.priority) {
      data = data.filter((d) => d.priority === filters.priority);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      data = data.filter(
        (d) =>
          d.customerName.toLowerCase().includes(s) ||
          d.subject.toLowerCase().includes(s) ||
          d.relatedItemName.toLowerCase().includes(s) ||
          d.id.toLowerCase().includes(s)
      );
    }
    return data;
  }, [currentData, filters]);

  const handleStatusChange = (id: string, status: InquiryStatus) => {
    const setter = activeTab === '예약' ? setReservationInquiries : setProductInquiries;
    setter((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry((prev) => prev ? { ...prev, status } : null);
    }
    toast.success(`문의 상태가 '${status}'(으)로 변경되었습니다.`);
  };

  const handleReply = (id: string, content: string) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const newReply = { content, repliedBy: '관리자', repliedAt: now };
    const setter = activeTab === '예약' ? setReservationInquiries : setProductInquiries;
    setter((prev) =>
      prev.map((inq) =>
        inq.id === id ? { ...inq, reply: newReply, status: '답변완료' as InquiryStatus } : inq
      )
    );
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry((prev) =>
        prev ? { ...prev, reply: newReply, status: '답변완료' as InquiryStatus } : null
      );
    }
    toast.success('답변이 등록되었습니다.');
  };

  const handleTabChange = (tab: '예약' | '특산품') => {
    setActiveTab(tab);
    setSelectedInquiry(null);
    setFilters({ status: '', priority: '', search: '' });
  };

  // Detail view
  if (selectedInquiry) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-[#1F2937]">상품 문의</h1>
          <p className="text-[0.85rem] text-gray-500 mt-1">고객 문의를 확인하고 답변합니다.</p>
        </div>
        <InquiryDetail
          inquiry={selectedInquiry}
          onBack={() => setSelectedInquiry(null)}
          onStatusChange={handleStatusChange}
          onReply={handleReply}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#1F2937]">상품 문의</h1>
        <p className="text-[0.85rem] text-gray-500 mt-1">고객 문의를 확인하고 답변합니다.</p>
      </div>

      {/* Summary cards */}
      <InquirySummaryCards data={currentData} />

      {/* Tabs + Content */}
      <div className="bg-white rounded-xl border border-gray-200">
        <InquiryTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          reservationCount={reservationInquiries.length}
          productCount={productInquiries.length}
        />

        <div className="p-5 space-y-4">
          <InquiryFilterBar filters={filters} onFilterChange={setFilters} category={activeTab} />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + filters.status + filters.priority + filters.search}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <InquiryTable data={filteredData} onViewDetail={setSelectedInquiry} category={activeTab} />
            </motion.div>
          </AnimatePresence>

          {/* Pagination hint */}
          {filteredData.length > 0 && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-[0.8rem] text-gray-400">
                총 {filteredData.length}건의 문의
              </span>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 text-[0.8rem] rounded-md bg-[#5F7D65] text-white">
                  1
                </button>
                {filteredData.length > 10 && (
                  <button className="px-3 py-1.5 text-[0.8rem] rounded-md text-gray-500 hover:bg-gray-100 transition-colors">
                    2
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}