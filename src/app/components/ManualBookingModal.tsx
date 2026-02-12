import { useState } from 'react';
import { X, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import {
  rooms,
  checkNewBookingConflict,
  type AccommodationBooking,
  type Hold,
  type BookingSource,
  type PaymentState,
  type ConflictLevel,
} from './doubleBookingData';

interface ManualBookingModalProps {
  bookings: AccommodationBooking[];
  holds: Hold[];
  onClose: () => void;
  onSubmit: (booking: AccommodationBooking) => void;
  preselectedRoomId?: string;
  preselectedDate?: string;
}

export function ManualBookingModal({
  bookings,
  holds,
  onClose,
  onSubmit,
  preselectedRoomId,
  preselectedDate,
}: ManualBookingModalProps) {
  const [roomId, setRoomId] = useState(preselectedRoomId || '');
  const [checkIn, setCheckIn] = useState(preselectedDate || '');
  const [checkOut, setCheckOut] = useState('');
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [extraGuests, setExtraGuests] = useState(0);
  const [paymentState, setPaymentState] = useState<PaymentState>('결제대기');
  const [source, setSource] = useState<BookingSource>('전화');
  const [memo, setMemo] = useState('');
  const [conflictResult, setConflictResult] = useState<{
    level: ConflictLevel;
    conflicts: { type: 'booking' | 'hold'; item: AccommodationBooking | Hold }[];
  } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleCheckConflict = () => {
    if (!roomId || !checkIn || !checkOut) return;
    const result = checkNewBookingConflict(bookings, holds, roomId, checkIn, checkOut);
    setConflictResult(result);
  };

  const handleSubmit = () => {
    if (!roomId || !checkIn || !checkOut || !guestName || !phone) return;
    
    const room = rooms.find(r => r.id === roomId);
    const newBooking: AccommodationBooking = {
      id: `ACM-2026-${String(bookings.length + 1).padStart(5, '0')}`,
      roomId,
      roomName: room?.name || '',
      checkIn,
      checkOut,
      guestName,
      phone,
      guestCount,
      extraGuests,
      amount: (room?.pricePerNight || 0) * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))),
      status: paymentState === '결제완료' ? '결제완료' : '결제대기',
      paymentState,
      source,
      channel: '수동',
      memo,
      createdAt: '2026-02-12',
    };

    onSubmit(newBooking);
    setSubmitted(true);
  };

  const isFormValid = roomId && checkIn && checkOut && guestName && phone && checkIn < checkOut;

  const conflictLevelBg: Record<ConflictLevel, string> = {
    '정상': 'bg-emerald-50 border-emerald-200',
    '위험': 'bg-amber-50 border-amber-200',
    '충돌': 'bg-red-50 border-red-200',
  };
  const conflictLevelIcon: Record<ConflictLevel, React.ReactNode> = {
    '정상': <CheckCircle className="w-5 h-5 text-emerald-500" />,
    '위험': <AlertCircle className="w-5 h-5 text-amber-500" />,
    '충돌': <AlertTriangle className="w-5 h-5 text-red-500" />,
  };
  const conflictLevelText: Record<ConflictLevel, string> = {
    '정상': '예약 가능 — 충돌 없음',
    '위험': '충돌 가능 — 홀드/미확정 건 포함',
    '충돌': '더블부킹 발생 — 즉시 조치 필요',
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl text-center">
          <CheckCircle className="w-14 h-14 text-[#5F7D65] mx-auto mb-4" />
          <h2 className="text-[#1F2937] mb-2">등록 완료</h2>
          <p className="text-[0.85rem] text-gray-500 mb-6">수동 예약이 성공적으로 등록되었습니다.</p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#5F7D65] text-white rounded-xl text-[0.85rem] hover:bg-[#4F6D55] transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-[#1F2937]">수동 예약 등록</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* 객실 선택 */}
          <div>
            <label className="text-[0.8rem] text-gray-500 block mb-1.5">객실 선택 *</label>
            <select
              value={roomId}
              onChange={e => { setRoomId(e.target.value); setConflictResult(null); }}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[0.85rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20"
            >
              <option value="">객실을 선택하세요</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.type}, 최대 {r.maxGuests}인)</option>
              ))}
            </select>
          </div>

          {/* 날짜 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[0.8rem] text-gray-500 block mb-1.5">체크인 *</label>
              <input
                type="date"
                value={checkIn}
                onChange={e => { setCheckIn(e.target.value); setConflictResult(null); }}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[0.85rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20"
              />
            </div>
            <div>
              <label className="text-[0.8rem] text-gray-500 block mb-1.5">체크아웃 *</label>
              <input
                type="date"
                value={checkOut}
                onChange={e => { setCheckOut(e.target.value); setConflictResult(null); }}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[0.85rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20"
              />
            </div>
          </div>

          {/* 겹침 검사 버튼 */}
          {roomId && checkIn && checkOut && checkIn < checkOut && (
            <button
              onClick={handleCheckConflict}
              className="w-full py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[0.85rem] text-gray-700 hover:bg-gray-100 transition-colors"
            >
              겹침 검사 실행
            </button>
          )}

          {/* 겹침 검사 결과 */}
          {conflictResult && (
            <div className={`p-4 rounded-xl border ${conflictLevelBg[conflictResult.level]}`}>
              <div className="flex items-center gap-2 mb-2">
                {conflictLevelIcon[conflictResult.level]}
                <span className="text-[0.85rem] text-[#1F2937]">{conflictLevelText[conflictResult.level]}</span>
              </div>
              {conflictResult.conflicts.length > 0 && (
                <div className="space-y-2 mt-3">
                  {conflictResult.conflicts.map((c, i) => (
                    <div key={i} className="text-[0.8rem] text-gray-600 bg-white/60 p-2.5 rounded-lg">
                      {c.type === 'booking' ? (
                        <>
                          <span className="text-[#1F2937]">예약 충돌:</span>{' '}
                          {(c.item as AccommodationBooking).id} — {(c.item as AccommodationBooking).guestName} (
                          {(c.item as AccommodationBooking).checkIn} ~ {(c.item as AccommodationBooking).checkOut}, {(c.item as AccommodationBooking).status})
                        </>
                      ) : (
                        <>
                          <span className="text-[#1F2937]">홀드 충돌:</span>{' '}
                          {(c.item as any).reason} ({(c.item as any).startDate} ~ {(c.item as any).endDate})
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 인원 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[0.8rem] text-gray-500 block mb-1.5">기본 인원</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >-</button>
                <span className="text-[0.85rem] text-[#1F2937] w-10 text-center">{guestCount}명</span>
                <button
                  onClick={() => setGuestCount(guestCount + 1)}
                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >+</button>
              </div>
            </div>
            <div>
              <label className="text-[0.8rem] text-gray-500 block mb-1.5">추가 인원</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExtraGuests(Math.max(0, extraGuests - 1))}
                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >-</button>
                <span className="text-[0.85rem] text-[#1F2937] w-10 text-center">{extraGuests}명</span>
                <button
                  onClick={() => setExtraGuests(extraGuests + 1)}
                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >+</button>
              </div>
            </div>
          </div>

          {/* 고객 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[0.8rem] text-gray-500 block mb-1.5">고객명 *</label>
              <input
                type="text"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder="홍길동"
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[0.85rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="text-[0.8rem] text-gray-500 block mb-1.5">연락처 *</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[0.85rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* 결제/채널 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[0.8rem] text-gray-500 block mb-1.5">결제 상태</label>
              <select
                value={paymentState}
                onChange={e => setPaymentState(e.target.value as PaymentState)}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[0.85rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20"
              >
                <option value="결제대기">결제대기</option>
                <option value="현장결제">현장결제</option>
                <option value="결제완료">결제완료</option>
              </select>
            </div>
            <div>
              <label className="text-[0.8rem] text-gray-500 block mb-1.5">판매 채널</label>
              <select
                value={source}
                onChange={e => setSource(e.target.value as BookingSource)}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[0.85rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20"
              >
                <option value="전화">전화</option>
                <option value="현장">현장</option>
                <option value="외부OTA">외부OTA</option>
              </select>
            </div>
          </div>

          {/* 메모 */}
          <div>
            <label className="text-[0.8rem] text-gray-500 block mb-1.5">메모</label>
            <textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="예약 관련 메모를 입력하세요..."
              className="w-full h-20 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[0.85rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20 resize-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-[0.85rem] text-gray-600 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`px-5 py-2.5 rounded-xl text-[0.85rem] transition-colors ${
              isFormValid
                ? 'bg-[#5F7D65] text-white hover:bg-[#4F6D55]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            예약 등록
          </button>
        </div>
      </div>
    </div>
  );
}
