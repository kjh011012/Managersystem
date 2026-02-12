// ===== 숙소 더블부킹 관련 Mock 데이터 =====

export interface Room {
  id: string;
  name: string;
  type: string;
  maxGuests: number;
  pricePerNight: number;
}

export type BookingSource = '플랫폼' | '전화' | '현장' | '외부OTA';
export type BookingChannel = '자동' | '수동';
export type AccommodationBookingStatus = '예약확정' | '결제대기' | '결제완료' | '취소요청' | '환불완료' | '이용완료' | '노쇼';
export type PaymentState = '결제대기' | '현장결제' | '결제완료';
export type ConflictLevel = '정상' | '위험' | '충돌';

export interface AccommodationBooking {
  id: string;
  roomId: string;
  roomName: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guestName: string;
  phone: string;
  guestCount: number;
  extraGuests: number;
  amount: number;
  status: AccommodationBookingStatus;
  paymentState: PaymentState;
  source: BookingSource;
  channel: BookingChannel;
  memo: string;
  createdAt: string;
}

export interface Hold {
  id: string;
  roomId: string;
  roomName: string;
  startDate: string;
  endDate: string;
  reason: '점검' | '수리' | '행사' | '사정';
  memo: string;
  createdAt: string;
  createdBy: string;
}

export interface ConflictInfo {
  level: ConflictLevel;
  bookingA: AccommodationBooking;
  bookingB?: AccommodationBooking;
  holdConflict?: Hold;
  description: string;
}

// 객실 목록
export const rooms: Room[] = [
  { id: 'room-01', name: '오션뷰 풀빌라 A', type: '풀빌라', maxGuests: 6, pricePerNight: 350000 },
  { id: 'room-02', name: '오션뷰 풀빌라 B', type: '풀빌라', maxGuests: 6, pricePerNight: 380000 },
  { id: 'room-03', name: '산속 독채 펜션', type: '독채', maxGuests: 4, pricePerNight: 250000 },
  { id: 'room-04', name: '한옥 스테이 매화', type: '한옥', maxGuests: 4, pricePerNight: 200000 },
  { id: 'room-05', name: '한옥 스테이 대나무', type: '한옥', maxGuests: 3, pricePerNight: 180000 },
  { id: 'room-06', name: '글램핑 A타입', type: '글램핑', maxGuests: 4, pricePerNight: 150000 },
  { id: 'room-07', name: '글램핑 B타입', type: '글램핑', maxGuests: 4, pricePerNight: 150000 },
  { id: 'room-08', name: '리조트 디럭스', type: '리조트', maxGuests: 2, pricePerNight: 280000 },
];

const guestNames = ['김민수', '이지은', '박서연', '최현우', '정하늘', '강도윤', '조은서', '윤서준', '임채원', '한지호', '송민지', '오태영', '배수빈', '류하은', '신동현', '장예진', '황준혁', '전소미', '권나윤', '문재현'];
const phones = ['010-1234-5678', '010-2345-6789', '010-3456-7890', '010-4567-8901', '010-5678-9012', '010-6789-0123', '010-7890-1234', '010-8901-2345'];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 2026년 2월 기준 예약 데이터 생성
export const mockAccommodationBookings: AccommodationBooking[] = [
  // room-01: 정상 예약들
  {
    id: 'ACM-2026-00001',
    roomId: 'room-01',
    roomName: '오션뷰 풀빌라 A',
    checkIn: '2026-02-03',
    checkOut: '2026-02-06',
    guestName: '김민수',
    phone: '010-1234-5678',
    guestCount: 4,
    extraGuests: 0,
    amount: 1050000,
    status: '이용완료',
    paymentState: '결제완료',
    source: '플랫폼',
    channel: '자동',
    memo: '',
    createdAt: '2026-01-25',
  },
  {
    id: 'ACM-2026-00002',
    roomId: 'room-01',
    roomName: '오션뷰 풀빌라 A',
    checkIn: '2026-02-10',
    checkOut: '2026-02-13',
    guestName: '이지은',
    phone: '010-2345-6789',
    guestCount: 3,
    extraGuests: 1,
    amount: 1050000,
    status: '예약확정',
    paymentState: '결제완료',
    source: '플랫폼',
    channel: '자동',
    memo: '조식 포함 요청',
    createdAt: '2026-02-01',
  },
  // room-01: 더블부킹 충돌! (2/12~2/15 vs 2/10~2/13 겹침)
  {
    id: 'ACM-2026-00003',
    roomId: 'room-01',
    roomName: '오션뷰 풀빌라 A',
    checkIn: '2026-02-12',
    checkOut: '2026-02-15',
    guestName: '박서연',
    phone: '010-3456-7890',
    guestCount: 2,
    extraGuests: 0,
    amount: 1050000,
    status: '결제대기',
    paymentState: '결제대기',
    source: '전화',
    channel: '수동',
    memo: '전화예약 - 더블부킹 확인 필요',
    createdAt: '2026-02-08',
  },
  {
    id: 'ACM-2026-00004',
    roomId: 'room-01',
    roomName: '오션뷰 풀빌라 A',
    checkIn: '2026-02-18',
    checkOut: '2026-02-21',
    guestName: '최현우',
    phone: '010-4567-8901',
    guestCount: 5,
    extraGuests: 1,
    amount: 1050000,
    status: '예약확정',
    paymentState: '결제완료',
    source: '플랫폼',
    channel: '자동',
    memo: '',
    createdAt: '2026-02-05',
  },
  {
    id: 'ACM-2026-00005',
    roomId: 'room-01',
    roomName: '오션뷰 풀빌라 A',
    checkIn: '2026-02-24',
    checkOut: '2026-02-27',
    guestName: '정하늘',
    phone: '010-5678-9012',
    guestCount: 4,
    extraGuests: 0,
    amount: 1050000,
    status: '결제완료',
    paymentState: '결제완료',
    source: '외부OTA',
    channel: '수동',
    memo: '',
    createdAt: '2026-02-10',
  },
  // room-02: 정상
  {
    id: 'ACM-2026-00006',
    roomId: 'room-02',
    roomName: '오션뷰 풀빌라 B',
    checkIn: '2026-02-05',
    checkOut: '2026-02-08',
    guestName: '강도윤',
    phone: '010-6789-0123',
    guestCount: 4,
    extraGuests: 0,
    amount: 1140000,
    status: '이용완료',
    paymentState: '결제완료',
    source: '플랫폼',
    channel: '자동',
    memo: '',
    createdAt: '2026-01-28',
  },
  {
    id: 'ACM-2026-00007',
    roomId: 'room-02',
    roomName: '오션뷰 풀빌라 B',
    checkIn: '2026-02-14',
    checkOut: '2026-02-17',
    guestName: '조은서',
    phone: '010-7890-1234',
    guestCount: 6,
    extraGuests: 0,
    amount: 1140000,
    status: '예약확정',
    paymentState: '결제완료',
    source: '플랫폼',
    channel: '자동',
    memo: '',
    createdAt: '2026-02-03',
  },
  // room-02: 위험 (2/16~2/19 vs 2/14~2/17 겹침) - 결제대기 상태
  {
    id: 'ACM-2026-00008',
    roomId: 'room-02',
    roomName: '오션뷰 풀빌라 B',
    checkIn: '2026-02-16',
    checkOut: '2026-02-19',
    guestName: '윤서준',
    phone: '010-8901-2345',
    guestCount: 3,
    extraGuests: 0,
    amount: 1140000,
    status: '결제대기',
    paymentState: '결제대기',
    source: '현장',
    channel: '수동',
    memo: '현장 방문 예약 — 위험 주의',
    createdAt: '2026-02-09',
  },
  // room-03
  {
    id: 'ACM-2026-00009',
    roomId: 'room-03',
    roomName: '산속 독채 펜션',
    checkIn: '2026-02-07',
    checkOut: '2026-02-10',
    guestName: '임채원',
    phone: '010-1234-5678',
    guestCount: 3,
    extraGuests: 0,
    amount: 750000,
    status: '이용완료',
    paymentState: '결제완료',
    source: '플랫폼',
    channel: '자동',
    memo: '',
    createdAt: '2026-01-30',
  },
  {
    id: 'ACM-2026-00010',
    roomId: 'room-03',
    roomName: '산속 독채 펜션',
    checkIn: '2026-02-13',
    checkOut: '2026-02-15',
    guestName: '한지호',
    phone: '010-2345-6789',
    guestCount: 2,
    extraGuests: 0,
    amount: 500000,
    status: '예약확정',
    paymentState: '결제완료',
    source: '플랫폼',
    channel: '자동',
    memo: '',
    createdAt: '2026-02-02',
  },
  {
    id: 'ACM-2026-00011',
    roomId: 'room-03',
    roomName: '산속 독채 펜션',
    checkIn: '2026-02-20',
    checkOut: '2026-02-23',
    guestName: '송민지',
    phone: '010-3456-7890',
    guestCount: 4,
    extraGuests: 0,
    amount: 750000,
    status: '결제완료',
    paymentState: '결제완료',
    source: '전화',
    channel: '수동',
    memo: '',
    createdAt: '2026-02-11',
  },
  // room-04: 한옥 스테이 매화 - 더블부킹!
  {
    id: 'ACM-2026-00012',
    roomId: 'room-04',
    roomName: '한옥 스테이 매화',
    checkIn: '2026-02-08',
    checkOut: '2026-02-11',
    guestName: '오태영',
    phone: '010-4567-8901',
    guestCount: 3,
    extraGuests: 0,
    amount: 600000,
    status: '예약확정',
    paymentState: '결제완료',
    source: '플랫폼',
    channel: '자동',
    memo: '',
    createdAt: '2026-02-01',
  },
  {
    id: 'ACM-2026-00013',
    roomId: 'room-04',
    roomName: '한옥 스테이 매화',
    checkIn: '2026-02-09',
    checkOut: '2026-02-12',
    guestName: '배수빈',
    phone: '010-5678-9012',
    guestCount: 2,
    extraGuests: 0,
    amount: 600000,
    status: '예약확정',
    paymentState: '결제완료',
    source: '외부OTA',
    channel: '수동',
    memo: 'OTA 예약 — 더블부킹 발생!',
    createdAt: '2026-02-03',
  },
  {
    id: 'ACM-2026-00014',
    roomId: 'room-04',
    roomName: '한옥 스테이 매화',
    checkIn: '2026-02-16',
    checkOut: '2026-02-19',
    guestName: '류하은',
    phone: '010-6789-0123',
    guestCount: 4,
    extraGuests: 0,
    amount: 600000,
    status: '예약확정',
    paymentState: '결제완료',
    source: '플랫폼',
    channel: '자동',
    memo: '',
    createdAt: '2026-02-06',
  },
  // room-05
  {
    id: 'ACM-2026-00015',
    roomId: 'room-05',
    roomName: '한옥 스테이 대나무',
    checkIn: '2026-02-11',
    checkOut: '2026-02-14',
    guestName: '신동현',
    phone: '010-7890-1234',
    guestCount: 2,
    extraGuests: 0,
    amount: 540000,
    status: '예약확정',
    paymentState: '결제완료',
    source: '플랫폼',
    channel: '자동',
    memo: '',
    createdAt: '2026-02-04',
  },
  {
    id: 'ACM-2026-00016',
    roomId: 'room-05',
    roomName: '한옥 스테이 대나무',
    checkIn: '2026-02-22',
    checkOut: '2026-02-25',
    guestName: '장예진',
    phone: '010-8901-2345',
    guestCount: 3,
    extraGuests: 0,
    amount: 540000,
    status: '결제대기',
    paymentState: '결제대기',
    source: '전화',
    channel: '수동',
    memo: '',
    createdAt: '2026-02-12',
  },
  // room-06: 글램핑 A
  {
    id: 'ACM-2026-00017',
    roomId: 'room-06',
    roomName: '글램핑 A타입',
    checkIn: '2026-02-06',
    checkOut: '2026-02-08',
    guestName: '황준혁',
    phone: '010-1234-5678',
    guestCount: 4,
    extraGuests: 0,
    amount: 300000,
    status: '이용완료',
    paymentState: '결제완료',
    source: '플랫폼',
    channel: '자동',
    memo: '',
    createdAt: '2026-01-29',
  },
  {
    id: 'ACM-2026-00018',
    roomId: 'room-06',
    roomName: '글램핑 A타입',
    checkIn: '2026-02-14',
    checkOut: '2026-02-16',
    guestName: '전소미',
    phone: '010-2345-6789',
    guestCount: 2,
    extraGuests: 0,
    amount: 300000,
    status: '예약확정',
    paymentState: '결제완료',
    source: '플랫폼',
    channel: '자동',
    memo: '',
    createdAt: '2026-02-05',
  },
  // room-07: 글램핑 B
  {
    id: 'ACM-2026-00019',
    roomId: 'room-07',
    roomName: '글램핑 B타입',
    checkIn: '2026-02-12',
    checkOut: '2026-02-15',
    guestName: '권나윤',
    phone: '010-3456-7890',
    guestCount: 3,
    extraGuests: 0,
    amount: 450000,
    status: '예약확정',
    paymentState: '결제완료',
    source: '플랫폼',
    channel: '자동',
    memo: '',
    createdAt: '2026-02-07',
  },
  // room-08: 리조트
  {
    id: 'ACM-2026-00020',
    roomId: 'room-08',
    roomName: '리조트 디럭스',
    checkIn: '2026-02-09',
    checkOut: '2026-02-12',
    guestName: '문재현',
    phone: '010-4567-8901',
    guestCount: 2,
    extraGuests: 0,
    amount: 840000,
    status: '예약확정',
    paymentState: '결제완료',
    source: '플랫폼',
    channel: '자동',
    memo: '',
    createdAt: '2026-02-02',
  },
  {
    id: 'ACM-2026-00021',
    roomId: 'room-08',
    roomName: '리조트 디럭스',
    checkIn: '2026-02-19',
    checkOut: '2026-02-22',
    guestName: '김민수',
    phone: '010-1234-5678',
    guestCount: 2,
    extraGuests: 0,
    amount: 840000,
    status: '결제완료',
    paymentState: '결제완료',
    source: '플랫폼',
    channel: '자동',
    memo: '',
    createdAt: '2026-02-10',
  },
];

// 홀드 데이터
export const mockHolds: Hold[] = [
  {
    id: 'HOLD-001',
    roomId: 'room-03',
    roomName: '산속 독채 펜션',
    startDate: '2026-02-16',
    endDate: '2026-02-18',
    reason: '점검',
    memo: '정기 시설 점검',
    createdAt: '2026-02-05',
    createdBy: '관리자',
  },
  {
    id: 'HOLD-002',
    roomId: 'room-06',
    roomName: '글램핑 A타입',
    startDate: '2026-02-20',
    endDate: '2026-02-23',
    reason: '수리',
    memo: '에어컨 수리',
    createdAt: '2026-02-10',
    createdBy: '관리자',
  },
  {
    id: 'HOLD-003',
    roomId: 'room-01',
    roomName: '오션뷰 풀빌라 A',
    startDate: '2026-02-28',
    endDate: '2026-03-02',
    reason: '행사',
    memo: '특별 행사 예약 차단',
    createdAt: '2026-02-08',
    createdBy: '관리자',
  },
];

// 더블부킹 검사 로직
export function checkConflicts(
  bookings: AccommodationBooking[],
  holds: Hold[],
  roomId: string
): ConflictInfo[] {
  const roomBookings = bookings.filter(b => b.roomId === roomId && b.status !== '환불완료' && b.status !== '취소요청');
  const roomHolds = holds.filter(h => h.roomId === roomId);
  const conflicts: ConflictInfo[] = [];

  // 예약 간 충돌 검사
  for (let i = 0; i < roomBookings.length; i++) {
    for (let j = i + 1; j < roomBookings.length; j++) {
      const a = roomBookings[i];
      const b = roomBookings[j];
      if (datesOverlap(a.checkIn, a.checkOut, b.checkIn, b.checkOut)) {
        const hasUnconfirmed = a.status === '결제대기' || b.status === '결제대기';
        conflicts.push({
          level: hasUnconfirmed ? '위험' : '충돌',
          bookingA: a,
          bookingB: b,
          description: hasUnconfirmed
            ? `미확정 예약 포함 — ${a.id}(${a.checkIn}~${a.checkOut})와 ${b.id}(${b.checkIn}~${b.checkOut}) 겹침`
            : `더블부킹 — ${a.id}(${a.checkIn}~${a.checkOut})와 ${b.id}(${b.checkIn}~${b.checkOut}) 충돌`,
        });
      }
    }
  }

  // 예약-홀드 충돌 검사
  for (const booking of roomBookings) {
    for (const hold of roomHolds) {
      if (datesOverlap(booking.checkIn, booking.checkOut, hold.startDate, hold.endDate)) {
        conflicts.push({
          level: '위험',
          bookingA: booking,
          holdConflict: hold,
          description: `홀드 충돌 — ${booking.id}(${booking.checkIn}~${booking.checkOut})와 홀드(${hold.startDate}~${hold.endDate}, ${hold.reason}) 겹침`,
        });
      }
    }
  }

  return conflicts;
}

// 신규 예약 충돌 검사
export function checkNewBookingConflict(
  bookings: AccommodationBooking[],
  holds: Hold[],
  roomId: string,
  checkIn: string,
  checkOut: string
): { level: ConflictLevel; conflicts: { type: 'booking' | 'hold'; item: AccommodationBooking | Hold }[] } {
  const roomBookings = bookings.filter(b => b.roomId === roomId && b.status !== '환불완료' && b.status !== '취소요청');
  const roomHolds = holds.filter(h => h.roomId === roomId);
  const foundConflicts: { type: 'booking' | 'hold'; item: AccommodationBooking | Hold }[] = [];

  for (const booking of roomBookings) {
    if (datesOverlap(checkIn, checkOut, booking.checkIn, booking.checkOut)) {
      foundConflicts.push({ type: 'booking', item: booking });
    }
  }

  for (const hold of roomHolds) {
    if (datesOverlap(checkIn, checkOut, hold.startDate, hold.endDate)) {
      foundConflicts.push({ type: 'hold', item: hold });
    }
  }

  if (foundConflicts.length === 0) return { level: '정상', conflicts: [] };
  const hasConfirmedConflict = foundConflicts.some(
    c => c.type === 'booking' && (c.item as AccommodationBooking).status === '예약확정'
  );
  return {
    level: hasConfirmedConflict ? '충돌' : '위험',
    conflicts: foundConflicts,
  };
}

// 날짜 겹침 판단 (체크아웃 = 체크인은 정상 교대로 처리)
function datesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  return startA < endB && startB < endA;
}

// 날짜 유틸
export function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0=Sun

  const days: { date: string; day: number; isCurrentMonth: boolean }[] = [];

  // Previous month padding
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    const m = month - 1 < 1 ? 12 : month - 1;
    const y = month - 1 < 1 ? year - 1 : year;
    days.push({
      date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      day: d,
      isCurrentMonth: false,
    });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      date: `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      day: d,
      isCurrentMonth: true,
    });
  }

  // Next month padding
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const m = month + 1 > 12 ? 1 : month + 1;
    const y = month + 1 > 12 ? year + 1 : year;
    days.push({
      date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      day: d,
      isCurrentMonth: false,
    });
  }

  return days;
}

// 오늘 체크인/체크아웃 건수
export function getTodayCheckInOut(bookings: AccommodationBooking[], today: string) {
  const checkIns = bookings.filter(b => b.checkIn === today && b.status !== '환불완료' && b.status !== '취소요청');
  const checkOuts = bookings.filter(b => b.checkOut === today && b.status !== '환불완료' && b.status !== '취소요청');
  return { checkIns: checkIns.length, checkOuts: checkOuts.length };
}

// 전체 충돌 건수
export function getTotalConflictCount(bookings: AccommodationBooking[], holds: Hold[]): number {
  const roomIds = [...new Set(bookings.map(b => b.roomId))];
  let total = 0;
  for (const roomId of roomIds) {
    total += checkConflicts(bookings, holds, roomId).length;
  }
  return total;
}

// 전체 충돌 목록
export function getAllConflicts(bookings: AccommodationBooking[], holds: Hold[]): ConflictInfo[] {
  const roomIds = [...new Set([...bookings.map(b => b.roomId), ...holds.map(h => h.roomId)])];
  const allConflicts: ConflictInfo[] = [];
  for (const roomId of roomIds) {
    allConflicts.push(...checkConflicts(bookings, holds, roomId));
  }
  return allConflicts;
}
