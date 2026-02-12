import { useState, useMemo, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Shield,
  Lock,
  Plus,
  LogIn,
  LogOut,
  CalendarDays,
  ArrowRightLeft,
  Ban,
  RefreshCw,
  ShieldAlert,
  Eye,
  X,
  Unlock,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  rooms,
  mockAccommodationBookings,
  mockHolds,
  getMonthDays,
  getTodayCheckInOut,
  getAllConflicts,
  checkConflicts,
  type AccommodationBooking,
  type Hold,
  type ConflictInfo,
  type ConflictLevel,
} from './doubleBookingData';
import { ManualBookingModal } from './ManualBookingModal';
import { HoldModal } from './HoldModal';

type ViewFilter = '전체' | '자동' | '수동';
type ConflictFilter = '전체' | '충돌' | '위험' | '홀드';

export function DoubleBookingTab() {
  const today = '2026-02-12';
  const [bookings, setBookings] = useState<AccommodationBooking[]>(mockAccommodationBookings);
  const [holds, setHolds] = useState<Hold[]>(mockHolds);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('all');
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(2);
  const [viewFilter, setViewFilter] = useState<ViewFilter>('전체');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [conflictFilter, setConflictFilter] = useState<ConflictFilter>('전체');
  const [showManualModal, setShowManualModal] = useState(false);
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState<ConflictInfo | null>(null);
  const [showForceApproval, setShowForceApproval] = useState(false);
  const [forceReason, setForceReason] = useState('');
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<AccommodationBooking | null>(null);

  // 월 변경
  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
  };

  // 필터된 예약
  const filteredBookings = useMemo(() => {
    let data = [...bookings];
    if (selectedRoomId !== 'all') data = data.filter(b => b.roomId === selectedRoomId);
    if (viewFilter === '자동') data = data.filter(b => b.channel === '자동');
    if (viewFilter === '수동') data = data.filter(b => b.channel === '수동');
    return data;
  }, [bookings, selectedRoomId, viewFilter]);

  // 필터된 홀드
  const filteredHolds = useMemo(() => {
    if (selectedRoomId === 'all') return holds;
    return holds.filter(h => h.roomId === selectedRoomId);
  }, [holds, selectedRoomId]);

  // 충돌 목록
  const allConflicts = useMemo(() => {
    if (selectedRoomId === 'all') return getAllConflicts(bookings, holds);
    return checkConflicts(bookings, holds, selectedRoomId);
  }, [bookings, holds, selectedRoomId]);

  const filteredConflicts = useMemo(() => {
    let data = [...allConflicts];
    if (conflictFilter === '충돌') data = data.filter(c => c.level === '충돌');
    else if (conflictFilter === '위험') data = data.filter(c => c.level === '위험');
    else if (conflictFilter === '홀드') data = data.filter(c => c.holdConflict);
    if (selectedDate) {
      data = data.filter(c => {
        const aIn = c.bookingA.checkIn <= selectedDate && c.bookingA.checkOut > selectedDate;
        const bIn = c.bookingB ? c.bookingB.checkIn <= selectedDate && c.bookingB.checkOut > selectedDate : false;
        const hIn = c.holdConflict ? c.holdConflict.startDate <= selectedDate && c.holdConflict.endDate > selectedDate : false;
        return aIn || bIn || hIn;
      });
    }
    return data;
  }, [allConflicts, conflictFilter, selectedDate]);

  // 오늘 통계
  const todayStats = useMemo(() => getTodayCheckInOut(bookings, today), [bookings]);

  // 캘린더 데이터
  const calendarDays = useMemo(() => getMonthDays(year, month), [year, month]);

  // 날짜별 예약/홀드 가져오기
  const getDateBookings = useCallback((date: string) => {
    return filteredBookings.filter(b => b.checkIn <= date && b.checkOut > date);
  }, [filteredBookings]);

  const getDateHolds = useCallback((date: string) => {
    return filteredHolds.filter(h => h.startDate <= date && h.endDate > date);
  }, [filteredHolds]);

  // 날짜별 충돌 여부
  const getDateConflictLevel = useCallback((date: string): ConflictLevel | null => {
    for (const c of allConflicts) {
      const aCovers = c.bookingA.checkIn <= date && c.bookingA.checkOut > date;
      const bCovers = c.bookingB ? c.bookingB.checkIn <= date && c.bookingB.checkOut > date : false;
      const hCovers = c.holdConflict ? c.holdConflict.startDate <= date && c.holdConflict.endDate > date : false;
      if ((aCovers && bCovers) || (aCovers && hCovers)) {
        if (c.level === '충돌') return '충돌';
      }
    }
    for (const c of allConflicts) {
      const aCovers = c.bookingA.checkIn <= date && c.bookingA.checkOut > date;
      const bCovers = c.bookingB ? c.bookingB.checkIn <= date && c.bookingB.checkOut > date : false;
      const hCovers = c.holdConflict ? c.holdConflict.startDate <= date && c.holdConflict.endDate > date : false;
      if ((aCovers && bCovers) || (aCovers && hCovers)) {
        return c.level;
      }
    }
    return null;
  }, [allConflicts]);

  // 체크인/아웃 임박 판단
  const isCheckInSoon = (booking: AccommodationBooking) => {
    const d = new Date(booking.checkIn);
    const t = new Date(today);
    const diff = (d.getTime() - t.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 2;
  };

  // 수동 예약 등록
  const handleManualSubmit = (booking: AccommodationBooking) => {
    setBookings(prev => [...prev, booking]);
    toast.success('수동 예약이 등록되었습니다.');
  };

  // 홀드 생성
  const handleHoldSubmit = (hold: Hold) => {
    setHolds(prev => [...prev, hold]);
    setShowHoldModal(false);
    toast.success('홀드가 생성되었습니다.');
  };

  // 홀드 해제
  const handleHoldRelease = (holdId: string) => {
    setHolds(prev => prev.filter(h => h.id !== holdId));
    toast.success('홀드가 해제되었습니다.');
  };

  // 강제 승인
  const handleForceApproval = () => {
    if (!forceReason.trim()) {
      toast.error('강제 승인 사유를 입력해 주세요.');
      return;
    }
    toast.success('관리자 강제 승인이 처리되었습니다. 승인 로그가 기록되었습니다.');
    setShowForceApproval(false);
    setForceReason('');
    setSelectedConflict(null);
  };

  // 상태 배지
  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      '예약확정': 'bg-emerald-100 text-emerald-700',
      '결제대기': 'bg-amber-100 text-amber-700',
      '결제완료': 'bg-blue-100 text-blue-700',
      '취소요청': 'bg-red-100 text-red-700',
      '이용완료': 'bg-sky-100 text-sky-700',
      '노쇼': 'bg-rose-200 text-rose-900',
      '환불완료': 'bg-gray-200 text-gray-600',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.7rem] ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
        {status}
      </span>
    );
  };

  const conflictBadge = (level: ConflictLevel) => {
    const cfg: Record<ConflictLevel, { bg: string; text: string }> = {
      '정상': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
      '위험': { bg: 'bg-amber-100', text: 'text-amber-700' },
      '충돌': { bg: 'bg-red-100', text: 'text-red-700' },
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.7rem] ${cfg[level].bg} ${cfg[level].text}`}>
        {level}
      </span>
    );
  };

  // 캘린더 셀 안 표시 요소들
  const renderCalendarCell = (day: { date: string; day: number; isCurrentMonth: boolean }) => {
    const dateBookings = getDateBookings(day.date);
    const dateHolds = getDateHolds(day.date);
    const conflictLevel = getDateConflictLevel(day.date);
    const isToday = day.date === today;
    const isSelected = day.date === selectedDate;
    const hasCheckIn = filteredBookings.some(b => b.checkIn === day.date);
    const hasCheckOut = filteredBookings.some(b => b.checkOut === day.date);

    return (
      <button
        key={day.date}
        onClick={() => setSelectedDate(selectedDate === day.date ? null : day.date)}
        className={`
          relative min-h-[72px] sm:min-h-[84px] p-1 border-b border-r border-gray-100 text-left transition-colors
          ${!day.isCurrentMonth ? 'bg-gray-50/50 text-gray-300' : 'hover:bg-gray-50'}
          ${isSelected ? 'ring-2 ring-[#5F7D65] ring-inset bg-[#5F7D65]/5 z-10' : ''}
          ${conflictLevel === '충돌' ? 'ring-2 ring-red-300 ring-inset' : ''}
          ${conflictLevel === '위험' ? 'ring-1 ring-amber-300 ring-inset' : ''}
        `}
      >
        <div className="flex items-center justify-between mb-0.5">
          <span className={`
            text-[0.7rem] sm:text-[0.75rem] w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full
            ${isToday ? 'bg-[#5F7D65] text-white' : day.isCurrentMonth ? 'text-[#1F2937]' : 'text-gray-300'}
          `}>
            {day.day}
          </span>
          {conflictLevel === '충돌' && day.isCurrentMonth && (
            <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500" />
          )}
          {conflictLevel === '위험' && day.isCurrentMonth && (
            <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
          )}
        </div>
        {day.isCurrentMonth && (
          <div className="space-y-0.5">
            {dateBookings.slice(0, 2).map(b => (
              <div
                key={b.id}
                className={`
                  text-[0.6rem] sm:text-[0.65rem] px-1 py-0.5 rounded truncate
                  ${b.status === '이용완료' ? 'bg-sky-50 text-sky-600' :
                    b.status === '예약확정' ? 'bg-[#5F7D65]/10 text-[#5F7D65]' :
                    b.status === '결제대기' ? 'bg-amber-50 text-amber-600' :
                    b.status === '결제완료' ? 'bg-blue-50 text-blue-600' :
                    'bg-gray-50 text-gray-500'}
                  ${isCheckInSoon(b) ? 'ring-1 ring-[#5F7D65]' : ''}
                `}
              >
                {b.guestName}
              </div>
            ))}
            {dateBookings.length > 2 && (
              <div className="text-[0.6rem] text-gray-400 px-1">+{dateBookings.length - 2}건</div>
            )}
            {dateHolds.map(h => (
              <div
                key={h.id}
                className="text-[0.6rem] sm:text-[0.65rem] px-1 py-0.5 rounded bg-gray-200 text-gray-500 truncate"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(156,163,175,0.2) 2px, rgba(156,163,175,0.2) 4px)' }}
              >
                홀드: {h.reason}
              </div>
            ))}
          </div>
        )}
        {/* 체크인/아웃 배지 */}
        {day.isCurrentMonth && (hasCheckIn || hasCheckOut) && (
          <div className="absolute bottom-0.5 right-0.5 flex gap-0.5">
            {hasCheckIn && <div className="w-1.5 h-1.5 rounded-full bg-[#5F7D65]" title="체크인" />}
            {hasCheckOut && <div className="w-1.5 h-1.5 rounded-full bg-amber-400" title="체크아웃" />}
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-5">
      {/* ===== 상단 요약 바 ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 숙소 선택 */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-1">
          <label className="text-[0.7rem] text-gray-400 block mb-1">객실 선택</label>
          <div className="relative">
            <select
              value={selectedRoomId}
              onChange={e => { setSelectedRoomId(e.target.value); setSelectedDate(null); setSelectedConflict(null); }}
              className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-[0.8rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20"
            >
              <option value="all">전체 객실</option>
              {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* 날짜 표시 */}
        <div>
          <label className="text-[0.7rem] text-gray-400 block mb-1">기준월</label>
          <div className="flex items-center gap-1 h-[38px]">
            <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <span className="text-[0.85rem] text-[#1F2937] whitespace-nowrap">{year}년 {month}월</span>
            <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100 transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* 오늘 체크인 */}
        <div className="bg-white border border-gray-200 rounded-xl px-3 py-2">
          <div className="flex items-center gap-1.5">
            <LogIn className="w-3.5 h-3.5 text-[#5F7D65]" />
            <span className="text-[0.7rem] text-gray-400">오늘 체크인</span>
          </div>
          <span className="text-[1rem] text-[#1F2937]">{todayStats.checkIns}건</span>
        </div>

        {/* 오늘 체크아웃 */}
        <div className="bg-white border border-gray-200 rounded-xl px-3 py-2">
          <div className="flex items-center gap-1.5">
            <LogOut className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[0.7rem] text-gray-400">오늘 체크아웃</span>
          </div>
          <span className="text-[1rem] text-[#1F2937]">{todayStats.checkOuts}건</span>
        </div>

        {/* 더블부킹 위험 */}
        <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            <span className="text-[0.7rem] text-red-400">더블부킹 위험</span>
          </div>
          <span className="text-[1rem] text-red-600">{allConflicts.length}건</span>
        </div>

        {/* 홀드 */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[0.7rem] text-gray-400">홀드(임시차단)</span>
          </div>
          <span className="text-[1rem] text-gray-700">{filteredHolds.length}건</span>
        </div>
      </div>

      {/* ===== 토글 + 액션 바 ===== */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center bg-gray-100 rounded-xl p-0.5">
          {(['전체', '자동', '수동'] as ViewFilter[]).map(v => (
            <button
              key={v}
              onClick={() => setViewFilter(v)}
              className={`px-4 py-1.5 rounded-lg text-[0.8rem] transition-all ${
                viewFilter === v
                  ? 'bg-white text-[#1F2937] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {v === '전체' ? '전체 보기' : v === '자동' ? '자동 예약' : '수동 입력(전화/현장)'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHoldModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 text-gray-600 rounded-xl text-[0.8rem] hover:bg-gray-200 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" /> 홀드 생성
          </button>
          <button
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#5F7D65] text-white rounded-xl text-[0.8rem] hover:bg-[#4F6D55] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> 수동 예약 등록
          </button>
        </div>
      </div>

      {/* ===== 메인 레이아웃: 캘린더 + 충돌 패널 ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* === 좌측: 캘린더 === */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4.5 h-4.5 text-[#5F7D65]" />
              <h3 className="text-[0.85rem] text-[#1F2937]">
                숙소 캘린더 — {year}년 {month}월
                {selectedRoomId !== 'all' && (
                  <span className="text-gray-400 ml-2">({rooms.find(r => r.id === selectedRoomId)?.name})</span>
                )}
              </h3>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-[0.7rem] text-gray-400">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#5F7D65]" /> 체크인</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400" /> 체크아웃</div>
              <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded bg-gray-200" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(156,163,175,0.3) 1px, rgba(156,163,175,0.3) 2px)' }} /> 홀드</div>
              <div className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-red-500" /> 충돌</div>
            </div>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
              <div key={d} className={`text-center py-2 text-[0.75rem] ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-500'}`}>
                {d}
              </div>
            ))}
          </div>

          {/* 캘린더 그리드 */}
          <div className="grid grid-cols-7">
            {calendarDays.map(day => renderCalendarCell(day))}
          </div>
        </div>

        {/* === 우측: 충돌/위험 리스트 + 상세 패널 === */}
        <div className="space-y-4">
          {/* 선택된 날짜 정보 */}
          {selectedDate && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[0.85rem] text-[#1F2937]">{selectedDate} 상세</h4>
                <button onClick={() => setSelectedDate(null)} className="p-1 rounded hover:bg-gray-100">
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
              {/* 해당 날짜 예약 목록 */}
              {getDateBookings(selectedDate).length === 0 && getDateHolds(selectedDate).length === 0 ? (
                <p className="text-[0.8rem] text-gray-400 py-3 text-center">해당 날짜에 예약/홀드가 없습니다.</p>
              ) : (
                <div className="space-y-2">
                  {getDateBookings(selectedDate).map(b => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => setSelectedBookingDetail(b)}
                    >
                      <div className="min-w-0">
                        <p className="text-[0.8rem] text-[#1F2937] truncate">{b.guestName} — {b.roomName}</p>
                        <p className="text-[0.7rem] text-gray-400">{b.checkIn} ~ {b.checkOut} · {b.channel}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {statusBadge(b.status)}
                        <Eye className="w-3.5 h-3.5 text-gray-300" />
                      </div>
                    </div>
                  ))}
                  {getDateHolds(selectedDate).map(h => (
                    <div key={h.id} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-100">
                      <div>
                        <p className="text-[0.8rem] text-gray-600">홀드: {h.reason} — {h.roomName}</p>
                        <p className="text-[0.7rem] text-gray-400">{h.startDate} ~ {h.endDate}</p>
                      </div>
                      <button
                        onClick={() => handleHoldRelease(h.id)}
                        className="flex items-center gap-1 px-2 py-1 text-[0.7rem] text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                      >
                        <Unlock className="w-3 h-3" /> 해제
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 충돌/위험 리스트 */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  <h4 className="text-[0.85rem] text-[#1F2937]">충돌/위험 예약</h4>
                </div>
                <span className="text-[0.75rem] text-gray-400">{filteredConflicts.length}건</span>
              </div>
              <div className="flex gap-1">
                {(['전체', '충돌', '위험', '홀드'] as ConflictFilter[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setConflictFilter(f)}
                    className={`px-2.5 py-1 rounded-lg text-[0.7rem] transition-colors ${
                      conflictFilter === f
                        ? 'bg-[#5F7D65]/10 text-[#5F7D65]'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {f === '전체' ? '전체' : f === '충돌' ? '충돌만' : f === '위험' ? '위험만' : '홀드 포함'}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {filteredConflicts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Shield className="w-10 h-10 text-emerald-200 mb-2" />
                  <p className="text-[0.85rem] text-gray-400">충돌/위험 건이 없습니다.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {filteredConflicts.map((conflict, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedConflict(selectedConflict === conflict ? null : conflict)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                        selectedConflict === conflict ? 'bg-gray-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[0.8rem] text-[#1F2937]">
                          {conflict.bookingA.roomName}
                        </span>
                        {conflictBadge(conflict.level)}
                      </div>
                      <p className="text-[0.7rem] text-gray-400 truncate">{conflict.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 충돌 상세 비교 패널 */}
          {selectedConflict && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[0.85rem] text-[#1F2937]">충돌 상세 비교</h4>
                <button onClick={() => setSelectedConflict(null)} className="p-1 rounded hover:bg-gray-100">
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-3">
                {/* 예약 A */}
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[0.75rem] text-gray-400">예약 A</span>
                    {statusBadge(selectedConflict.bookingA.status)}
                  </div>
                  <p className="text-[0.85rem] text-[#1F2937]">{selectedConflict.bookingA.id}</p>
                  <p className="text-[0.8rem] text-gray-600">{selectedConflict.bookingA.guestName} · {selectedConflict.bookingA.phone}</p>
                  <p className="text-[0.75rem] text-gray-400 mt-1">
                    {selectedConflict.bookingA.checkIn} ~ {selectedConflict.bookingA.checkOut} · {selectedConflict.bookingA.channel} ({selectedConflict.bookingA.source})
                  </p>
                </div>

                {/* 중간 화살표 */}
                <div className="flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4 text-red-400" />
                </div>

                {/* 예약 B 또는 홀드 */}
                {selectedConflict.bookingB ? (
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[0.75rem] text-gray-400">예약 B</span>
                      {statusBadge(selectedConflict.bookingB.status)}
                    </div>
                    <p className="text-[0.85rem] text-[#1F2937]">{selectedConflict.bookingB.id}</p>
                    <p className="text-[0.8rem] text-gray-600">{selectedConflict.bookingB.guestName} · {selectedConflict.bookingB.phone}</p>
                    <p className="text-[0.75rem] text-gray-400 mt-1">
                      {selectedConflict.bookingB.checkIn} ~ {selectedConflict.bookingB.checkOut} · {selectedConflict.bookingB.channel} ({selectedConflict.bookingB.source})
                    </p>
                  </div>
                ) : selectedConflict.holdConflict ? (
                  <div className="p-3 rounded-xl bg-gray-100 border border-gray-200" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(156,163,175,0.1) 3px, rgba(156,163,175,0.1) 6px)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[0.75rem] text-gray-400">홀드</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.7rem] bg-gray-200 text-gray-600">
                        {selectedConflict.holdConflict.reason}
                      </span>
                    </div>
                    <p className="text-[0.85rem] text-gray-700">{selectedConflict.holdConflict.roomName}</p>
                    <p className="text-[0.75rem] text-gray-400 mt-1">
                      {selectedConflict.holdConflict.startDate} ~ {selectedConflict.holdConflict.endDate}
                    </p>
                    <p className="text-[0.75rem] text-gray-400">{selectedConflict.holdConflict.memo}</p>
                  </div>
                ) : null}
              </div>

              {/* 처리 버튼 */}
              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => toast.info('날짜 변경 요청이 발송되었습니다.')}
                  className="flex items-center gap-1 px-3 py-1.5 text-[0.75rem] bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <CalendarDays className="w-3 h-3" /> 날짜 변경 요청
                </button>
                <button
                  onClick={() => toast.info('가능 객실을 조회합니다.')}
                  className="flex items-center gap-1 px-3 py-1.5 text-[0.75rem] bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> 객실 변경
                </button>
                <button
                  onClick={() => toast.info('예약 취소/환불 화면으로 이동합니다.')}
                  className="flex items-center gap-1 px-3 py-1.5 text-[0.75rem] bg-white border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Ban className="w-3 h-3" /> 취소/환불
                </button>
                {selectedConflict.holdConflict && (
                  <button
                    onClick={() => handleHoldRelease(selectedConflict.holdConflict!.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-[0.75rem] bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Unlock className="w-3 h-3" /> 홀드 해제
                  </button>
                )}
                <button
                  onClick={() => toast.info('홀드로 전환되었습니다.')}
                  className="flex items-center gap-1 px-3 py-1.5 text-[0.75rem] bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Lock className="w-3 h-3" /> 홀드 전환
                </button>
                <button
                  onClick={() => setShowForceApproval(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-[0.75rem] bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <ShieldAlert className="w-3 h-3" /> 강제 승인
                </button>
              </div>
            </div>
          )}

          {/* 홀드 목록 */}
          {filteredHolds.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-500" />
                <h4 className="text-[0.85rem] text-[#1F2937]">홀드 목록</h4>
              </div>
              <div className="divide-y divide-gray-50">
                {filteredHolds.map(h => (
                  <div key={h.id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-[0.8rem] text-[#1F2937]">{h.roomName}</p>
                      <p className="text-[0.7rem] text-gray-400">{h.startDate} ~ {h.endDate} · {h.reason}</p>
                      {h.memo && <p className="text-[0.7rem] text-gray-400 mt-0.5">{h.memo}</p>}
                    </div>
                    <button
                      onClick={() => handleHoldRelease(h.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-[0.75rem] text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                    >
                      <Unlock className="w-3 h-3" /> 해제
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== 모달들 ===== */}
      {showManualModal && (
        <ManualBookingModal
          bookings={bookings}
          holds={holds}
          onClose={() => setShowManualModal(false)}
          onSubmit={handleManualSubmit}
          preselectedRoomId={selectedRoomId !== 'all' ? selectedRoomId : undefined}
          preselectedDate={selectedDate || undefined}
        />
      )}

      {showHoldModal && (
        <HoldModal
          onClose={() => setShowHoldModal(false)}
          onSubmit={handleHoldSubmit}
          preselectedRoomId={selectedRoomId !== 'all' ? selectedRoomId : undefined}
          preselectedDate={selectedDate || undefined}
          existingHolds={holds}
        />
      )}

      {/* 강제 승인 모달 */}
      {showForceApproval && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
                <h2 className="text-[#1F2937]">관리자 강제 승인</h2>
              </div>
              <button onClick={() => setShowForceApproval(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-[0.8rem] text-red-600">
                  더블부킹 상태에서 강제로 예약을 승인합니다. 이 작업은 관리자 권한으로만 수행 가능하며, 모든 로그가 기록됩니다.
                </p>
              </div>
              <div>
                <label className="text-[0.8rem] text-gray-500 block mb-1.5">강제 승인 사유 (필수)</label>
                <textarea
                  value={forceReason}
                  onChange={e => setForceReason(e.target.value)}
                  placeholder="강제 승인 사유를 상세히 입력하세요..."
                  className="w-full h-24 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[0.85rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-200 resize-none placeholder:text-gray-400"
                />
              </div>
              <div className="text-[0.75rem] text-gray-400">
                승인자: 관리자 · 승인일시: 2026-02-12 {new Date().toLocaleTimeString('ko-KR')}
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setShowForceApproval(false)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[0.85rem] text-gray-600 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleForceApproval}
                className="px-4 py-2 bg-red-500 text-white rounded-xl text-[0.85rem] hover:bg-red-600 transition-colors"
              >
                강제 승인 확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 예약 상세 모달 */}
      {selectedBookingDetail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-[#1F2937]">예약 상세</h2>
              <button onClick={() => setSelectedBookingDetail(null)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[0.85rem] text-[#1F2937]">{selectedBookingDetail.id}</span>
                {statusBadge(selectedBookingDetail.status)}
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.7rem] ${
                  selectedBookingDetail.channel === '자동' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                }`}>{selectedBookingDetail.channel}</span>
              </div>
              <div className="grid grid-cols-2 gap-y-3 text-[0.85rem]">
                <div>
                  <span className="text-gray-400 text-[0.8rem] block">객실</span>
                  <span className="text-[#1F2937]">{selectedBookingDetail.roomName}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[0.8rem] block">고객명</span>
                  <span className="text-[#1F2937]">{selectedBookingDetail.guestName}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[0.8rem] block">체크인</span>
                  <span className="text-[#1F2937]">{selectedBookingDetail.checkIn}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[0.8rem] block">체크아웃</span>
                  <span className="text-[#1F2937]">{selectedBookingDetail.checkOut}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[0.8rem] block">인원</span>
                  <span className="text-[#1F2937]">기본 {selectedBookingDetail.guestCount}명 + 추가 {selectedBookingDetail.extraGuests}명</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[0.8rem] block">금액</span>
                  <span className="text-[#1F2937]">{selectedBookingDetail.amount.toLocaleString()}원</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[0.8rem] block">연락처</span>
                  <span className="text-[#1F2937]">{selectedBookingDetail.phone}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[0.8rem] block">판매채널</span>
                  <span className="text-[#1F2937]">{selectedBookingDetail.source}</span>
                </div>
              </div>
              {selectedBookingDetail.memo && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <span className="text-gray-400 text-[0.75rem] block mb-1">메모</span>
                  <p className="text-[0.8rem] text-gray-600">{selectedBookingDetail.memo}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedBookingDetail(null)}
                className="px-5 py-2 bg-[#5F7D65] text-white rounded-xl text-[0.85rem] hover:bg-[#4F6D55] transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
