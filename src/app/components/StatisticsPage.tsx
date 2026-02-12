import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Line, Area, AreaChart, ComposedChart, Legend,
} from 'recharts';
import {
  ChevronDown, CalendarDays,
  Sparkles, AlertTriangle, ArrowUpRight, ArrowDownRight,
  BedDouble, ShoppingBag, UtensilsCrossed,
  ShieldAlert, Eye, RotateCcw,
  DollarSign, Users, Percent, Ban, BarChart3, Brain,
} from 'lucide-react';
import {
  kpiData, dailyRevenueData, monthlyComparisonData,
  dayOfWeekData, monthlyOccupancyData, productPerformanceData,
  aiAdvisorContent, problemAlerts,
} from './statisticsData';
import type { KpiCard, ProductPerformance, ProblemAlert } from './statisticsData';

// ─── Animated Counter ────────────────────────────────────
function AnimatedNumber({ value, duration = 1200 }: { value: string; duration?: number }) {
  const [displayed, setDisplayed] = useState('0');
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const numericStr = value.replace(/[^0-9.]/g, '');
    const target = parseFloat(numericStr);
    if (isNaN(target)) { setDisplayed(value); return; }

    const prefix = value.match(/^[^0-9]*/)?.[0] || '';
    const suffix = value.match(/[^0-9.]*$/)?.[0] || '';
    const hasDecimal = numericStr.includes('.');
    const decimalPlaces = hasDecimal ? numericStr.split('.')[1].length : 0;
    const start = 0;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;
      const formatted = hasDecimal ? current.toFixed(decimalPlaces) : Math.round(current).toLocaleString();
      setDisplayed(`${prefix}${formatted}${suffix}`);
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [value, duration]);

  return <>{displayed}</>;
}

// ─── KPI Cards ───────────────────────────────────────────
const kpiIcons: Record<string, React.ElementType> = {
  'revenue': DollarSign,
  'bookings': Users,
  'avg-price': BarChart3,
  'occupancy': BedDouble,
  'cancel-rate': Percent,
  'noshow-rate': Ban,
};

function KpiCardComponent({ card, index }: { card: KpiCard; index: number }) {
  const Icon = kpiIcons[card.id] || BarChart3;
  const isPositiveGood = !['cancel-rate', 'noshow-rate'].includes(card.id);
  const isGood = isPositiveGood ? card.trend === 'up' : card.trend === 'down';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[0.8rem] text-gray-500">{card.label}</span>
        <div className="w-9 h-9 rounded-xl bg-[#5F7D65]/10 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-[#5F7D65]" />
        </div>
      </div>
      <div className="text-[1.6rem] text-[#1F2937] tracking-tight">
        <AnimatedNumber value={card.formatted} />
        <span className="text-[0.85rem] text-gray-400 ml-1">{card.unit}</span>
      </div>
      <div className={`flex items-center gap-1 mt-2 text-[0.78rem] ${isGood ? 'text-[#5F7D65]' : 'text-[#C66A6A]'}`}>
        {card.trend === 'up' ? (
          <ArrowUpRight className="w-3.5 h-3.5" />
        ) : (
          <ArrowDownRight className="w-3.5 h-3.5" />
        )}
        <span>전월 대비 {Math.abs(card.change)}%</span>
      </div>
    </motion.div>
  );
}

// ─── Filter Bar ──────────────────────────────────────────
interface FilterState {
  period: string;
  productType: string;
  room: string;
  status: string;
}

function StatisticsFilterBar({ filters, onChange }: { filters: FilterState; onChange: (f: FilterState) => void }) {
  const hasFilter = filters.period !== '이번 달' || filters.productType || filters.room || filters.status;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <select
          value={filters.period}
          onChange={(e) => onChange({ ...filters, period: e.target.value })}
          className="appearance-none pl-9 pr-8 py-2 text-[0.85rem] rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#5F7D65] outline-none cursor-pointer transition-all"
        >
          <option>이번 달</option>
          <option>지난 달</option>
          <option>최근 3개월</option>
          <option>최근 6개월</option>
          <option>올해</option>
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={filters.productType}
          onChange={(e) => onChange({ ...filters, productType: e.target.value })}
          className="appearance-none pl-3 pr-8 py-2 text-[0.85rem] rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#5F7D65] outline-none cursor-pointer transition-all"
        >
          <option value="">상품 유형 전체</option>
          <option value="체험">체험</option>
          <option value="숙소">숙소</option>
          <option value="식사">식사</option>
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={filters.room}
          onChange={(e) => onChange({ ...filters, room: e.target.value })}
          className="appearance-none pl-3 pr-8 py-2 text-[0.85rem] rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#5F7D65] outline-none cursor-pointer transition-all"
        >
          <option value="">객실 전체</option>
          <option value="풀빌라">오션뷰 풀빌라</option>
          <option value="한옥">한옥 스테이</option>
          <option value="글램핑">글램핑</option>
          <option value="펜션">산속 독채 펜션</option>
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className="appearance-none pl-3 pr-8 py-2 text-[0.85rem] rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#5F7D65] outline-none cursor-pointer transition-all"
        >
          <option value="">예약 상태 전체</option>
          <option value="예약확정">예약확정</option>
          <option value="결제대기">결제대기</option>
          <option value="이용완료">이용완료</option>
          <option value="취소요청">취소요청</option>
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
      </div>

      {hasFilter && (
        <button
          onClick={() => onChange({ period: '이번 달', productType: '', room: '', status: '' })}
          className="flex items-center gap-1 text-[0.8rem] text-gray-500 hover:text-gray-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          초기화
        </button>
      )}
    </div>
  );
}

// ─── Recharts Custom Tooltip ─────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-3 text-[0.8rem]">
      <p className="text-gray-500 mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.name}: {typeof entry.value === 'number' && entry.value > 10000
            ? `${(entry.value / 10000).toFixed(0)}만원`
            : entry.value}{entry.unit || ''}
        </p>
      ))}
    </div>
  );
}

// ─── Revenue Chart ───────────────────────────────────────
function RevenueChart({ chartMode }: { chartMode: 'daily' | 'monthly' }) {
  if (chartMode === 'monthly') {
    return (
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={monthlyComparisonData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
          <Bar dataKey="lastYear" name="전년" fill="#E5E7EB" radius={[4, 4, 0, 0]} barSize={18} />
          <Bar dataKey="thisYear" name="올해" fill="#5F7D65" radius={[4, 4, 0, 0]} barSize={18} />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={dailyRevenueData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#5F7D65" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#5F7D65" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} interval={3} />
        <YAxis yAxisId="revenue" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} />
        <YAxis yAxisId="bookings" orientation="right" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}건`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
        <Area yAxisId="revenue" type="monotone" dataKey="revenue" name="매출" stroke="#5F7D65" strokeWidth={2} fill="url(#revenueGrad)" />
        <Line yAxisId="bookings" type="monotone" dataKey="bookings" name="예약 건수" stroke="#6366F1" strokeWidth={2} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Day-of-week Chart ───────────────────────────────────
function DayOfWeekChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={dayOfWeekData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="bookings" name="예약 건수" fill="#5F7D65" radius={[4, 4, 0, 0]} barSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Monthly Occupancy Chart ─────────────────────────────
function OccupancyChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={monthlyOccupancyData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
        <defs>
          <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="occupancy" name="점유율" stroke="#14B8A6" strokeWidth={2} fill="url(#occGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── AI Advisor Panel ────────────────────────────────────
function AiAdvisorPanel() {
  const [expanded, setExpanded] = useState<string | null>('status');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5F7D65] to-[#4a6350] flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[#1F2937]">AI 운영 비서</h3>
            <p className="text-[0.75rem] text-gray-400">데이터 기반 운영 전략 제안</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="divide-y divide-gray-50">
        {aiAdvisorContent.map((section) => {
          const isOpen = expanded === section.id;
          return (
            <div key={section.id}>
              <button
                onClick={() => setExpanded(isOpen ? null : section.id)}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-gray-50/50 transition-colors"
              >
                <span className="text-[1rem]">{section.icon}</span>
                <span className="flex-1 text-[0.85rem] text-[#1F2937]">{section.title}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 space-y-2.5">
                      {section.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 text-[0.82rem] text-gray-600 leading-relaxed"
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                            style={{ backgroundColor: section.color }}
                          />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
        <button className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-[0.85rem] rounded-lg bg-[#5F7D65] text-white hover:bg-[#4e6b54] transition-colors">
          <Eye className="w-4 h-4" />
          전략 상세 보기
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-[0.85rem] rounded-lg border border-[#5F7D65] text-[#5F7D65] hover:bg-[#5F7D65]/5 transition-colors">
          <Sparkles className="w-4 h-4" />
          마케팅 제안 생성
        </button>
      </div>
    </motion.div>
  );
}

// ─── Product Performance Table ───────────────────────────
function ProductPerformanceTable({ data }: { data: ProductPerformance[] }) {
  const typeIcons: Record<string, React.ElementType> = {
    '체험': ShoppingBag,
    '숙소': BedDouble,
    '식사': UtensilsCrossed,
  };
  const typeColors: Record<string, { bg: string; text: string }> = {
    '체험': { bg: 'bg-violet-100', text: 'text-violet-700' },
    '숙소': { bg: 'bg-teal-100', text: 'text-teal-700' },
    '식사': { bg: 'bg-orange-100', text: 'text-orange-700' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.35 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm"
    >
      <div className="p-5 pb-3 border-b border-gray-100">
        <h3 className="text-[#1F2937]">상품 성과 분석</h3>
        <p className="text-[0.78rem] text-gray-400 mt-0.5">예약 건수, 매출, 취소율 기준 상품별 성과</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[0.85rem]">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="py-3 px-5 text-gray-500 text-[0.75rem]">상품명</th>
              <th className="py-3 px-4 text-gray-500 text-[0.75rem]">유형</th>
              <th className="py-3 px-4 text-gray-500 text-[0.75rem] text-right">예약 건수</th>
              <th className="py-3 px-4 text-gray-500 text-[0.75rem] text-right hidden md:table-cell">매출</th>
              <th className="py-3 px-4 text-gray-500 text-[0.75rem] text-right hidden lg:table-cell">평균 인원</th>
              <th className="py-3 px-4 text-gray-500 text-[0.75rem] text-right">취소율</th>
              <th className="py-3 px-4 text-gray-500 text-[0.75rem] text-right hidden sm:table-cell">전월 대비</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product, idx) => {
              const tc = typeColors[product.type];
              return (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-5 text-gray-800">{product.name}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[0.7rem] ${tc.bg} ${tc.text}`}>
                      {product.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700">{product.bookings}건</td>
                  <td className="py-3 px-4 text-right text-gray-700 hidden md:table-cell">
                    {(product.revenue / 10000).toLocaleString()}만원
                  </td>
                  <td className="py-3 px-4 text-right text-gray-500 hidden lg:table-cell">{product.avgPeople}명</td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.75rem] ${
                        product.cancelRate >= 15
                          ? 'bg-red-100 text-red-700'
                          : product.cancelRate >= 10
                          ? 'bg-amber-100 text-amber-700'
                          : 'text-gray-600'
                      }`}
                    >
                      {product.cancelRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right hidden sm:table-cell">
                    <span className={`flex items-center justify-end gap-0.5 text-[0.8rem] ${product.changeRate >= 0 ? 'text-[#5F7D65]' : 'text-[#C66A6A]'}`}>
                      {product.changeRate >= 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {Math.abs(product.changeRate)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ─── Problem Detection ───────────────────────────────────
function ProblemDetection({ alerts }: { alerts: ProblemAlert[] }) {
  const severityStyles: Record<string, { border: string; bg: string; icon: string; badge: string }> = {
    high: { border: 'border-red-200', bg: 'bg-red-50/50', icon: 'text-red-500', badge: 'bg-red-100 text-red-700' },
    medium: { border: 'border-amber-200', bg: 'bg-amber-50/50', icon: 'text-amber-500', badge: 'bg-amber-100 text-amber-700' },
    low: { border: 'border-gray-200', bg: 'bg-gray-50/50', icon: 'text-gray-400', badge: 'bg-gray-100 text-gray-600' },
  };

  const typeLabels: Record<string, string> = {
    vacancy: '공실',
    cancel: '취소',
    noshow: '노쇼',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.35 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm"
    >
      <div className="p-5 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#C66A6A]" />
          <h3 className="text-[#1F2937]">문제 감지</h3>
        </div>
        <p className="text-[0.78rem] text-gray-400 mt-0.5">공실률, 취소율, 노쇼 발생 추이 경고</p>
      </div>
      <div className="p-4 space-y-3">
        {alerts.map((alert, idx) => {
          const style = severityStyles[alert.severity];
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.05, duration: 0.25 }}
              className={`flex items-start gap-3 p-3.5 rounded-xl border ${style.border} ${style.bg} transition-colors`}
            >
              <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${style.icon}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[0.85rem] text-gray-800">{alert.message}</p>
                <p className="text-[0.75rem] text-gray-500 mt-0.5">{alert.detail}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[0.7rem] ${style.badge}`}>
                  {typeLabels[alert.type]}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Main Statistics Page ────────────────────────────────
export function StatisticsPage() {
  const [filters, setFilters] = useState<FilterState>({
    period: '이번 달',
    productType: '',
    room: '',
    status: '',
  });
  const [chartMode, setChartMode] = useState<'daily' | 'monthly'>('daily');

  const filteredProducts = useMemo(() => {
    let data = [...productPerformanceData];
    if (filters.productType) {
      data = data.filter((p) => p.type === filters.productType);
    }
    return data;
  }, [filters.productType]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[#1F2937]">통계</h1>
          <p className="text-[0.85rem] text-gray-500 mt-1">매출, 예약, 점유율 데이터를 분석하고 AI 기반 운영 전략을 확인합니다.</p>
        </div>
      </div>

      {/* Filters */}
      <StatisticsFilterBar filters={filters} onChange={setFilters} />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpiData.map((card, i) => (
          <KpiCardComponent key={card.id} card={card} index={i} />
        ))}
      </div>

      {/* Mid section: Charts + AI Advisor */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: Charts */}
        <div className="xl:col-span-2 space-y-5">
          {/* Main Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[#1F2937]">매출 및 예약 추이</h3>
                <p className="text-[0.78rem] text-gray-400 mt-0.5">
                  {chartMode === 'daily' ? '일별 매출과 예약 건수' : '월별 전년 대비 비교'}
                </p>
              </div>
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => setChartMode('daily')}
                  className={`px-3 py-1.5 text-[0.8rem] rounded-md transition-all ${
                    chartMode === 'daily'
                      ? 'bg-white text-[#5F7D65] shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  일별
                </button>
                <button
                  onClick={() => setChartMode('monthly')}
                  className={`px-3 py-1.5 text-[0.8rem] rounded-md transition-all ${
                    chartMode === 'monthly'
                      ? 'bg-white text-[#5F7D65] shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  월별 비교
                </button>
              </div>
            </div>
            <RevenueChart chartMode={chartMode} />
          </motion.div>

          {/* Sub charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.35 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
            >
              <h4 className="text-[#1F2937] mb-1">요일별 예약 분포</h4>
              <p className="text-[0.75rem] text-gray-400 mb-3">요일별 예약 건수 비교</p>
              <DayOfWeekChart />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.35 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
            >
              <h4 className="text-[#1F2937] mb-1">월별 점유율 추이</h4>
              <p className="text-[0.75rem] text-gray-400 mb-3">월별 객실 점유율 변화</p>
              <OccupancyChart />
            </motion.div>
          </div>
        </div>

        {/* Right: AI Advisor */}
        <div className="xl:col-span-1">
          <AiAdvisorPanel />
        </div>
      </div>

      {/* Product Performance */}
      <ProductPerformanceTable data={filteredProducts} />

      {/* Problem Detection */}
      <ProblemDetection alerts={problemAlerts} />
    </div>
  );
}