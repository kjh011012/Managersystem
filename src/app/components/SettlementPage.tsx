import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  ChevronDown, ChevronUp, CalendarDays, Download, FileText,
  ArrowUpRight, ArrowDownRight, Wallet, Receipt, Percent,
  Building2, CreditCard, CircleDollarSign, AlertCircle,
  ChevronRight, X, Check, Clock, Pause, Ban,
  ArrowLeft, RotateCcw, History, CheckCircle2,
  Landmark, FileDown, Info, Minus, Equal, Plus,
} from 'lucide-react';
import {
  settlementKpiData, settlementItems, settlementLogs,
  settlementRequests, businessInfo,
} from './settlementData';
import type {
  SettlementKpi, SettlementItem, SettlementStatus,
  SettlementLog, SettlementRequest, RequestStatus,
} from './settlementData';

// ─── Status Helpers ──────────────────────────────────────
const statusStyles: Record<SettlementStatus, { bg: string; text: string; dot: string }> = {
  '정산 대기': { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  '정산 완료': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  '정산 보류': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  '환불 반영': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
};

const requestStatusStyles: Record<RequestStatus, { bg: string; text: string; icon: React.ElementType }> = {
  '신청 완료': { bg: 'bg-blue-50', text: 'text-blue-700', icon: Check },
  '검토 중': { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
  '지급 완료': { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle2 },
  '지급 보류': { bg: 'bg-red-50', text: 'text-red-700', icon: Pause },
};

const kpiIcons: Record<string, React.ElementType> = {
  'total-revenue': Wallet,
  'refund-deduction': Ban,
  'platform-fee': Percent,
  'vat': Receipt,
  'settlement-scheduled': CalendarDays,
  'net-amount': CircleDollarSign,
  'unsettled': AlertCircle,
};

const kpiColors: Record<string, string> = {
  positive: '#5F7D65',
  negative: '#C66A6A',
  neutral: '#6B7280',
  highlight: '#5F7D65',
};

// ─── Format Currency ─────────────────────────────────────
function fmt(n: number): string {
  return n.toLocaleString('ko-KR');
}

// ─── KPI Card ────────────────────────────────────────────
function KpiCard({ kpi, index }: { kpi: SettlementKpi; index: number }) {
  const Icon = kpiIcons[kpi.id] || Wallet;
  const color = kpiColors[kpi.type];
  const isHighlight = kpi.type === 'highlight';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`rounded-2xl border p-4 shadow-sm transition-shadow hover:shadow-md ${
        isHighlight
          ? 'bg-[#5F7D65] border-[#5F7D65] text-white'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-2.5">
        <span className={`text-[0.78rem] ${isHighlight ? 'text-white/80' : 'text-gray-500'}`}>
          {kpi.label}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          isHighlight ? 'bg-white/20' : 'bg-gray-100'
        }`}>
          <Icon className={`w-4 h-4 ${isHighlight ? 'text-white' : 'text-gray-500'}`} />
        </div>
      </div>
      <div className={`text-[1.25rem] tracking-tight ${isHighlight ? 'text-white' : 'text-[#1F2937]'}`}>
        {kpi.amount < 0 ? '' : ''}{fmt(Math.abs(kpi.amount))}
        <span className={`text-[0.78rem] ml-0.5 ${isHighlight ? 'text-white/70' : 'text-gray-400'}`}>원</span>
      </div>
      <p className={`text-[0.72rem] mt-1.5 ${isHighlight ? 'text-white/60' : 'text-gray-400'}`}>
        {kpi.description}
      </p>
    </motion.div>
  );
}

// ─── Filter Bar ──────────────────────────────────────────
interface FilterState {
  period: string;
  status: string;
}

function SettlementFilterBar({
  filters, onChange, onExport, selectedCount, onBatchAction,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onExport: () => void;
  selectedCount: number;
  onBatchAction: () => void;
}) {
  const hasFilter = filters.period !== '2026년 2월' || filters.status !== '';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filters.period}
            onChange={(e) => onChange({ ...filters, period: e.target.value })}
            className="appearance-none pl-9 pr-8 py-2 text-[0.85rem] rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#5F7D65] outline-none cursor-pointer transition-all"
          >
            <option>2026년 2월</option>
            <option>2026년 1월</option>
            <option>2025년 12월</option>
            <option>2025년 11월</option>
            <option>사용자 지정</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="appearance-none pl-3 pr-8 py-2 text-[0.85rem] rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#5F7D65] outline-none cursor-pointer transition-all"
          >
            <option value="">정산 상태 전체</option>
            <option>정산 대기</option>
            <option>정산 완료</option>
            <option>정산 보류</option>
            <option>환불 반영</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>

        {hasFilter && (
          <button
            onClick={() => onChange({ period: '2026년 2월', status: '' })}
            className="flex items-center gap-1 text-[0.8rem] text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            초기화
          </button>
        )}

        {selectedCount > 0 && (
          <span className="text-[0.8rem] text-[#5F7D65]">
            {selectedCount}건 선택됨
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3.5 py-2 text-[0.85rem] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">엑셀 다운로드</span>
        </button>
        <button
          onClick={() => toast.info('PDF 생성 중...')}
          className="flex items-center gap-1.5 px-3.5 py-2 text-[0.85rem] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <FileDown className="w-4 h-4" />
          <span className="hidden sm:inline">PDF</span>
        </button>
      </div>
    </div>
  );
}

// ─── Settlement Table ────────────────────────────────────
type SortKey = 'useDate' | 'paymentAmount' | 'settlementAmount' | 'status';

function SettlementTable({
  items, selected, onToggle, onToggleAll, onViewDetail, sortKey, sortDir, onSort,
}: {
  items: SettlementItem[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onViewDetail: (item: SettlementItem) => void;
  sortKey: SortKey;
  sortDir: 'asc' | 'desc';
  onSort: (key: SortKey) => void;
}) {
  const allSelected = items.length > 0 && items.every((i) => selected.has(i.id));

  function SortHeader({ label, k, className }: { label: string; k: SortKey; className?: string }) {
    return (
      <th
        className={`py-3 px-3 text-gray-500 text-[0.75rem] cursor-pointer select-none hover:text-gray-700 transition-colors ${className || ''}`}
        onClick={() => onSort(k)}
      >
        <span className="inline-flex items-center gap-0.5">
          {label}
          {sortKey === k ? (
            sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3 opacity-30" />
          )}
        </span>
      </th>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div className="p-5 pb-3 border-b border-gray-100">
        <h3 className="text-[#1F2937]">정산 내역</h3>
        <p className="text-[0.78rem] text-gray-400 mt-0.5">예약별 정산 상세 내역</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[0.85rem] min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                  className="w-4 h-4 rounded border-gray-300 text-[#5F7D65] focus:ring-[#5F7D65] cursor-pointer accent-[#5F7D65]"
                />
              </th>
              <th className="py-3 px-3 text-gray-500 text-[0.75rem]">예약번호</th>
              <th className="py-3 px-3 text-gray-500 text-[0.75rem]">상품명</th>
              <SortHeader label="이용일" k="useDate" />
              <SortHeader label="결제금액" k="paymentAmount" className="text-right" />
              <th className="py-3 px-3 text-gray-500 text-[0.75rem] text-right hidden lg:table-cell">환불금액</th>
              <th className="py-3 px-3 text-gray-500 text-[0.75rem] text-right hidden xl:table-cell">수수료</th>
              <th className="py-3 px-3 text-gray-500 text-[0.75rem] text-right hidden xl:table-cell">부가세</th>
              <SortHeader label="정산 대상" k="settlementAmount" className="text-right" />
              <SortHeader label="상태" k="status" />
              <th className="py-3 px-3 text-gray-500 text-[0.75rem] w-10"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const s = statusStyles[item.status];
              const isRefund = item.status === '환불 반영';
              return (
                <tr
                  key={item.id}
                  className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                    selected.has(item.id) ? 'bg-[#5F7D65]/[0.03]' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() => onToggle(item.id)}
                      className="w-4 h-4 rounded border-gray-300 text-[#5F7D65] focus:ring-[#5F7D65] cursor-pointer accent-[#5F7D65]"
                    />
                  </td>
                  <td className="py-3 px-3 text-gray-500 text-[0.8rem] whitespace-nowrap">{item.reservationNo}</td>
                  <td className="py-3 px-3">
                    <div className="text-gray-800">{item.productName}</div>
                    <div className="text-[0.72rem] text-gray-400">{item.customerName}</div>
                  </td>
                  <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{item.useDate}</td>
                  <td className="py-3 px-3 text-right text-gray-700 whitespace-nowrap">{fmt(item.paymentAmount)}원</td>
                  <td className={`py-3 px-3 text-right whitespace-nowrap hidden lg:table-cell ${item.refundAmount > 0 ? 'text-[#C66A6A]' : 'text-gray-400'}`}>
                    {item.refundAmount > 0 ? `-${fmt(item.refundAmount)}원` : '-'}
                  </td>
                  <td className="py-3 px-3 text-right text-gray-500 whitespace-nowrap hidden xl:table-cell">
                    {item.platformFee > 0 ? `${fmt(item.platformFee)}원` : '-'}
                  </td>
                  <td className="py-3 px-3 text-right text-gray-500 whitespace-nowrap hidden xl:table-cell">
                    {item.vat > 0 ? `${fmt(item.vat)}원` : '-'}
                  </td>
                  <td className={`py-3 px-3 text-right whitespace-nowrap ${isRefund ? 'text-gray-400 line-through' : 'text-[#1F2937]'}`}>
                    {fmt(item.settlementAmount)}원
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[0.72rem] ${s.bg} ${s.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => onViewDetail(item)}
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {items.length === 0 && (
        <div className="py-12 text-center text-gray-400 text-[0.85rem]">해당 조건의 정산 내역이 없습니다.</div>
      )}
    </motion.div>
  );
}

// ─── Settlement Detail Drawer ────────────────────────────
function SettlementDetail({ item, onClose }: { item: SettlementItem; onClose: () => void }) {
  const s = statusStyles[item.status];
  const netPayment = item.paymentAmount - item.refundAmount;
  const finalAmount = netPayment - item.platformFee - item.vat;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 z-50 flex justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
              <div>
                <h3 className="text-[#1F2937]">정산 상세</h3>
                <p className="text-[0.75rem] text-gray-400">{item.reservationNo}</p>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.78rem] ${s.bg} ${s.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {item.status}
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-3">
              <h4 className="text-[0.78rem] text-gray-400 uppercase tracking-wider">기본 정보</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '상품명', value: item.productName },
                  { label: '상품 유형', value: item.productType },
                  { label: '고객명', value: item.customerName },
                  { label: '이용일', value: item.useDate },
                  { label: '결제일', value: item.paymentDate },
                  { label: '정산일', value: item.settlementDate || '미정산' },
                ].map((row) => (
                  <div key={row.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[0.72rem] text-gray-400 mb-0.5">{row.label}</p>
                    <p className="text-[0.85rem] text-[#1F2937]">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculation Breakdown */}
            <div className="space-y-3">
              <h4 className="text-[0.78rem] text-gray-400 uppercase tracking-wider">정산 계산 구조</h4>
              <div className="bg-gray-50 rounded-2xl p-5 space-y-0">
                {/* Row: 총 결제금액 */}
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-[0.85rem] text-gray-600">총 결제금액</span>
                  <span className="text-[0.95rem] text-[#1F2937]">{fmt(item.paymentAmount)}원</span>
                </div>

                {/* Row: 환불 차감 */}
                <div className="flex items-center justify-between py-2.5 border-t border-gray-200/60">
                  <span className="flex items-center gap-2 text-[0.85rem] text-[#C66A6A]">
                    <Minus className="w-3.5 h-3.5" />
                    환불 차감
                  </span>
                  <span className="text-[0.95rem] text-[#C66A6A]">
                    {item.refundAmount > 0 ? `-${fmt(item.refundAmount)}원` : '0원'}
                  </span>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between py-2.5 border-t border-gray-300/50 bg-white -mx-5 px-5 rounded-lg">
                  <span className="flex items-center gap-2 text-[0.85rem] text-gray-700">
                    <Equal className="w-3.5 h-3.5" />
                    실결제 매출
                  </span>
                  <span className="text-[0.95rem] text-[#1F2937]">{fmt(netPayment)}원</span>
                </div>

                {/* Row: 플랫폼 수수료 */}
                <div className="flex items-center justify-between py-2.5 border-t border-gray-200/60">
                  <span className="flex items-center gap-2 text-[0.85rem] text-gray-500">
                    <Minus className="w-3.5 h-3.5" />
                    플랫폼 수수료 (8%)
                  </span>
                  <span className="text-[0.9rem] text-gray-600">
                    {item.platformFee > 0 ? `-${fmt(item.platformFee)}원` : '0원'}
                  </span>
                </div>

                {/* Row: 부가세 */}
                <div className="flex items-center justify-between py-2.5 border-t border-gray-200/60">
                  <span className="flex items-center gap-2 text-[0.85rem] text-gray-500">
                    <Minus className="w-3.5 h-3.5" />
                    부가세 (VAT 10%)
                  </span>
                  <span className="text-[0.9rem] text-gray-600">
                    {item.vat > 0 ? `-${fmt(item.vat)}원` : '0원'}
                  </span>
                </div>

                {/* Final */}
                <div className="flex items-center justify-between py-3 border-t-2 border-[#5F7D65]/30 mt-1">
                  <span className="flex items-center gap-2 text-[0.9rem] text-[#5F7D65]">
                    <Equal className="w-4 h-4" />
                    최종 정산 금액
                  </span>
                  <span className="text-[1.1rem] text-[#5F7D65]">{fmt(finalAmount)}원</span>
                </div>
              </div>
            </div>

            {/* Refund Notice */}
            {item.refundNote && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[0.82rem] text-red-700">{item.refundNote}</p>
                  {item.status === '환불 반영' && item.refundAmount === item.paymentAmount && (
                    <p className="text-[0.75rem] text-red-500 mt-1">
                      이 예약은 환불로 인해 다음 정산에서 차감 예정입니다.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* HQ Status */}
            <div className="space-y-3">
              <h4 className="text-[0.78rem] text-gray-400 uppercase tracking-wider">본사 연동 상태</h4>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between text-[0.85rem]">
                  <span className="text-gray-500">본사 승인 상태</span>
                  <span className={`${item.status === '정산 완료' ? 'text-emerald-600' : item.status === '정산 보류' ? 'text-amber-600' : 'text-gray-500'}`}>
                    {item.status === '정산 완료' ? '승인 완료' : item.status === '정산 보류' ? '검토 중' : '대기 중'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[0.85rem]">
                  <span className="text-gray-500">지급 완료 일자</span>
                  <span className="text-gray-700">{item.settlementDate || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Settlement Calculation Summary ──────────────────────
function CalculationSummary() {
  const totalRevenue = 32450000;
  const totalRefund = 2870000;
  const netRevenue = totalRevenue - totalRefund;
  const fee = 2365600;
  const vat = 2957000;
  const finalAmount = netRevenue - fee - vat;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm"
    >
      <div className="p-5 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-[#5F7D65]" />
          <h3 className="text-[#1F2937]">정산 계산 요약</h3>
        </div>
        <p className="text-[0.78rem] text-gray-400 mt-0.5">2026년 2월 정산 기준</p>
      </div>
      <div className="p-5">
        <div className="space-y-0">
          <div className="flex items-center justify-between py-3">
            <span className="text-[0.9rem] text-gray-700">총 매출</span>
            <span className="text-[1rem] text-[#1F2937]">{fmt(totalRevenue)}원</span>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-dashed border-gray-200">
            <span className="flex items-center gap-2 text-[0.9rem] text-[#C66A6A]">
              <Minus className="w-4 h-4" />환불 차감
            </span>
            <span className="text-[1rem] text-[#C66A6A]">-{fmt(totalRefund)}원</span>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-gray-300/50 bg-gray-50 -mx-5 px-5 rounded">
            <span className="flex items-center gap-2 text-[0.9rem] text-gray-800">
              <Equal className="w-4 h-4" />실결제 매출
            </span>
            <span className="text-[1rem] text-[#1F2937]">{fmt(netRevenue)}원</span>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-dashed border-gray-200">
            <span className="flex items-center gap-2 text-[0.9rem] text-gray-500">
              <Minus className="w-4 h-4" />플랫폼 수수료 (8%)
            </span>
            <span className="text-[0.95rem] text-gray-600">-{fmt(fee)}원</span>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-dashed border-gray-200">
            <span className="flex items-center gap-2 text-[0.9rem] text-gray-500">
              <Minus className="w-4 h-4" />부가세 (VAT 10%)
            </span>
            <span className="text-[0.95rem] text-gray-600">-{fmt(vat)}원</span>
          </div>
          <div className="flex items-center justify-between py-4 border-t-2 border-[#5F7D65]/40 mt-1">
            <span className="flex items-center gap-2 text-[1rem] text-[#5F7D65]">
              <Equal className="w-4.5 h-4.5" />최종 정산 금액
            </span>
            <span className="text-[1.25rem] text-[#5F7D65]">{fmt(finalAmount)}원</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Settlement Request Modal ────────────────────────────
function RequestModal({ onClose }: { onClose: () => void }) {
  const availableAmount = 24257400;

  const handleSubmit = () => {
    toast.success('정산 신청이 완료되었습니다. 본사 검토 후 지급됩니다.');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-[#1F2937]">정산 신청</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Amount */}
            <div className="bg-[#5F7D65]/5 border border-[#5F7D65]/20 rounded-xl p-4 text-center">
              <p className="text-[0.78rem] text-[#5F7D65] mb-1">신청 가능 금액</p>
              <p className="text-[1.5rem] text-[#5F7D65] tracking-tight">{fmt(availableAmount)}원</p>
            </div>

            {/* Account Info */}
            <div className="space-y-3">
              <h4 className="text-[0.85rem] text-gray-700">입금 계좌 정보</h4>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-[0.85rem]">
                  <span className="text-gray-500">은행명</span>
                  <span className="text-gray-700">{businessInfo.bankName}</span>
                </div>
                <div className="flex justify-between text-[0.85rem]">
                  <span className="text-gray-500">계좌번호</span>
                  <span className="text-gray-700">{businessInfo.accountNo}</span>
                </div>
                <div className="flex justify-between text-[0.85rem]">
                  <span className="text-gray-500">예금주</span>
                  <span className="text-gray-700">{businessInfo.accountHolder}</span>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl p-3">
              <CalendarDays className="w-4 h-4 text-blue-500 shrink-0" />
              <p className="text-[0.82rem] text-blue-700">
                정산 예정일: <strong>2026년 3월 5일</strong> (영업일 기준 3~5일 소요)
              </p>
            </div>

            {/* Notice */}
            <div className="flex items-start gap-2 text-[0.78rem] text-gray-400">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <p>정산 신청 후 본사 검토를 거쳐 지급됩니다. 환불 미반영 건이 있을 경우 차감 후 지급됩니다.</p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-[0.85rem] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 text-[0.85rem] rounded-lg bg-[#5F7D65] text-white hover:bg-[#4e6b54] transition-colors"
            >
              정산 신청하기
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Settlement Log Timeline ─────────────────────────────
function SettlementLogTimeline() {
  const logTypeStyles: Record<string, { bg: string; icon: React.ElementType; color: string }> = {
    request: { bg: 'bg-blue-100', icon: FileText, color: 'text-blue-600' },
    approve: { bg: 'bg-emerald-100', icon: Check, color: 'text-emerald-600' },
    complete: { bg: 'bg-[#5F7D65]/10', icon: CheckCircle2, color: 'text-[#5F7D65]' },
    hold: { bg: 'bg-amber-100', icon: Pause, color: 'text-amber-600' },
    reject: { bg: 'bg-red-100', icon: X, color: 'text-red-600' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm"
    >
      <div className="p-5 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-gray-500" />
          <h3 className="text-[#1F2937]">정산 로그</h3>
        </div>
        <p className="text-[0.78rem] text-gray-400 mt-0.5">정산 처리 이력 기록</p>
      </div>
      <div className="p-5">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-3 bottom-3 w-px bg-gray-200" />

          <div className="space-y-0">
            {settlementLogs.map((log, idx) => {
              const style = logTypeStyles[log.type] || logTypeStyles.request;
              const LogIcon = style.icon;
              return (
                <div key={log.id} className="relative flex items-start gap-4 py-3">
                  <div className={`relative z-10 w-8 h-8 rounded-full ${style.bg} flex items-center justify-center shrink-0`}>
                    <LogIcon className={`w-3.5 h-3.5 ${style.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[0.85rem] text-[#1F2937]">{log.action}</span>
                      <span className="text-[0.72rem] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{log.actor}</span>
                    </div>
                    <p className="text-[0.78rem] text-gray-500 mt-0.5">{log.detail}</p>
                    <p className="text-[0.72rem] text-gray-400 mt-1">{log.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Settlement Request History ──────────────────────────
function RequestHistory() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm"
    >
      <div className="p-5 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Landmark className="w-5 h-5 text-[#5F7D65]" />
          <h3 className="text-[#1F2937]">정산 신청 내역</h3>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[0.85rem]">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="py-3 px-5 text-gray-500 text-[0.75rem]">신청일</th>
              <th className="py-3 px-4 text-gray-500 text-[0.75rem]">정산 기간</th>
              <th className="py-3 px-4 text-gray-500 text-[0.75rem] text-right">금액</th>
              <th className="py-3 px-4 text-gray-500 text-[0.75rem]">상태</th>
              <th className="py-3 px-4 text-gray-500 text-[0.75rem] hidden sm:table-cell">지급일</th>
            </tr>
          </thead>
          <tbody>
            {settlementRequests.map((req) => {
              const rs = requestStatusStyles[req.status];
              const RIcon = rs.icon;
              return (
                <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-5 text-gray-600 whitespace-nowrap">{req.requestDate}</td>
                  <td className="py-3 px-4 text-gray-700">{req.period}</td>
                  <td className="py-3 px-4 text-right text-[#1F2937] whitespace-nowrap">{fmt(req.amount)}원</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.72rem] ${rs.bg} ${rs.text}`}>
                      <RIcon className="w-3 h-3" />
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">{req.paidDate || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ─── Business Info Section ───────────────────────────────
function BusinessInfoSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm"
    >
      <div className="p-5 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-gray-500" />
          <h3 className="text-[#1F2937]">세무/사업자 정보</h3>
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: '사업자 등록번호', value: businessInfo.businessNo },
            { label: '상호명', value: businessInfo.companyName },
            { label: '대표자명', value: businessInfo.representative },
            { label: '정산 계좌', value: `${businessInfo.bankName} ${businessInfo.accountNo}` },
            { label: '예금주', value: businessInfo.accountHolder },
            { label: '세금계산서 발행', value: businessInfo.taxInvoice ? '발행 (자동)' : '미발행' },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-[0.82rem] text-gray-500">{row.label}</span>
              <span className="text-[0.85rem] text-[#1F2937]">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Settlement Page ────────────────────────────────
export function SettlementPage() {
  const [filters, setFilters] = useState<FilterState>({ period: '2026년 2월', status: '' });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>('useDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [detailItem, setDetailItem] = useState<SettlementItem | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'table' | 'request' | 'log'>('table');

  // Filtered + sorted items
  const displayItems = useMemo(() => {
    let data = [...settlementItems];
    if (filters.status) {
      data = data.filter((i) => i.status === filters.status);
    }
    data.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'useDate') cmp = a.useDate.localeCompare(b.useDate);
      else if (sortKey === 'paymentAmount') cmp = a.paymentAmount - b.paymentAmount;
      else if (sortKey === 'settlementAmount') cmp = a.settlementAmount - b.settlementAmount;
      else if (sortKey === 'status') cmp = a.status.localeCompare(b.status);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return data;
  }, [filters, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const handleToggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleToggleAll = () => {
    if (displayItems.every((i) => selected.has(i.id))) {
      setSelected(new Set());
    } else {
      setSelected(new Set(displayItems.map((i) => i.id)));
    }
  };

  const handleExport = () => {
    toast.success('엑셀 파일 다운로드가 시작됩니다.');
  };

  const tabs = [
    { key: 'table' as const, label: '정산 내역', count: settlementItems.length },
    { key: 'request' as const, label: '신청 내역', count: settlementRequests.length },
    { key: 'log' as const, label: '정산 로그', count: settlementLogs.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[#1F2937]">정산 관리</h1>
          <p className="text-[0.85rem] text-gray-500 mt-1">매출 정산 내역 관리, 정산 신청 및 지급 현황을 확인합니다.</p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#5F7D65] text-white text-[0.85rem] hover:bg-[#4e6b54] transition-colors shadow-sm shrink-0"
        >
          <CreditCard className="w-4 h-4" />
          정산 신청
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {settlementKpiData.map((kpi, i) => (
          <KpiCard key={kpi.id} kpi={kpi} index={i} />
        ))}
      </div>

      {/* Calculation Summary + Business Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CalculationSummary />
        <BusinessInfoSection />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex items-center gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-5 py-3 text-[0.85rem] transition-colors ${
                activeTab === tab.key
                  ? 'text-[#5F7D65]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-[0.72rem] px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? 'bg-[#5F7D65]/10 text-[#5F7D65]' : 'bg-gray-100 text-gray-400'
              }`}>
                {tab.count}
              </span>
              {activeTab === tab.key && (
                <motion.div
                  layoutId="settlement-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5F7D65]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'table' && (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <SettlementFilterBar
              filters={filters}
              onChange={setFilters}
              onExport={handleExport}
              selectedCount={selected.size}
              onBatchAction={() => {}}
            />
            <SettlementTable
              items={displayItems}
              selected={selected}
              onToggle={handleToggle}
              onToggleAll={handleToggleAll}
              onViewDetail={setDetailItem}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
          </motion.div>
        )}

        {activeTab === 'request' && (
          <motion.div
            key="request"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <RequestHistory />
          </motion.div>
        )}

        {activeTab === 'log' && (
          <motion.div
            key="log"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <SettlementLogTimeline />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Drawer */}
      {detailItem && (
        <SettlementDetail item={detailItem} onClose={() => setDetailItem(null)} />
      )}

      {/* Request Modal */}
      {showRequestModal && (
        <RequestModal onClose={() => setShowRequestModal(false)} />
      )}
    </div>
  );
}
