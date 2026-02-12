import { useState } from 'react';
import { Search, Download, Plus, ChevronDown, X } from 'lucide-react';
import type { ReservationStatus, PaymentMethod } from './mockData';

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
  onExcelDownload: () => void;
  onNewReservation: () => void;
}

export interface FilterState {
  status: ReservationStatus | '';
  dateFrom: string;
  dateTo: string;
  people: string;
  paymentMethod: PaymentMethod | '';
  search: string;
}

const statusOptions: ReservationStatus[] = ['결제대기', '결제완료', '예약확정', '취소요청', '환불완료', '이용완료', '노쇼'];
const paymentOptions: PaymentMethod[] = ['카드', '계좌이체', '네이버페이', '카카오페이', '토스페이'];
const peopleOptions = ['1명', '2명', '3~4명', '5~8명', '9명 이상'];

export function FilterBar({ onFilterChange, onExcelDownload, onNewReservation }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    dateFrom: '',
    dateTo: '',
    people: '',
    paymentMethod: '',
    search: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const empty: FilterState = { status: '', dateFrom: '', dateTo: '', people: '', paymentMethod: '', search: '' };
    setFilters(empty);
    onFilterChange(empty);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="예약번호 / 고객명 / 전화번호 검색"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-[0.8rem] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20 focus:border-[#5F7D65]"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-[0.8rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20 cursor-pointer"
          >
            <option value="">예약 상태</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* More filters toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-[0.8rem] text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span>상세 필터</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-2.5 py-2 text-[0.8rem] text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            필터 초기화
          </button>
        )}

        {/* Right buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onExcelDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-[0.8rem] text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">엑셀 다운로드</span>
          </button>
          <button
            onClick={onNewReservation}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#5F7D65] text-white rounded-lg text-[0.8rem] hover:bg-[#4F6D55] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">신규 예약 등록</span>
          </button>
        </div>
      </div>

      {/* Extended filters */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <label className="text-[0.8rem] text-gray-500 shrink-0">기간</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => updateFilter('dateFrom', e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-[0.8rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20"
            />
            <span className="text-gray-400 text-[0.8rem]">~</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => updateFilter('dateTo', e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-[0.8rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20"
            />
          </div>

          <div className="relative">
            <select
              value={filters.people}
              onChange={(e) => updateFilter('people', e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-[0.8rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20 cursor-pointer"
            >
              <option value="">인원</option>
              {peopleOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filters.paymentMethod}
              onChange={(e) => updateFilter('paymentMethod', e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-[0.8rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20 cursor-pointer"
            >
              <option value="">결제수단</option>
              {paymentOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );
}
