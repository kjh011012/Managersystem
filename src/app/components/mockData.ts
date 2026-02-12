export type ReservationType = '체험' | '숙소' | '식사';
export type ReservationStatus = '결제대기' | '결제완료' | '예약확정' | '취소요청' | '환불완료' | '이용완료' | '노쇼';
export type PaymentStatus = '결제대기' | '결제완료' | '환불진행' | '환불완료' | '부분환불';
export type PaymentMethod = '카드' | '계좌이체' | '네이버페이' | '카카오페이' | '토스페이';

export interface Reservation {
  id: string;
  type: ReservationType;
  programName: string;
  customerName: string;
  phone: string;
  email: string;
  reservationDate: string;
  useDate: string;
  people: number;
  amount: number;
  paymentStatus: PaymentStatus;
  reservationStatus: ReservationStatus;
  paymentMethod: PaymentMethod;
  maxCapacity: number;
  currentBooked: number;
  memo: string;
  logs: { date: string; action: string; by: string }[];
}

const names = ['김민수', '이지은', '박서연', '최현우', '정하늘', '강도윤', '조은서', '윤서준', '임채원', '한지호', '송민지', '오태영', '배수빈', '류하은', '신동현', '장예진', '황준혁', '전소미', '권나윤', '문재현'];
const phones = ['010-1234-5678', '010-2345-6789', '010-3456-7890', '010-4567-8901', '010-5678-9012', '010-6789-0123', '010-7890-1234', '010-8901-2345', '010-9012-3456', '010-0123-4567'];

const experiencePrograms = ['제주 감귤 따기 체험', '도자기 공예 체험', '승마 체험', '서핑 레슨', '전통 한지 공예', '숲 속 명상 체험', '치즈 만들기 체험', '카약 투어'];
const accommodationPrograms = ['오션뷰 풀빌라', '산속 독채 펜션', '한옥 스테이', '글램핑 A타입', '글램핑 B타입', '리조트 디럭스', '게스트하우스 도미토리', '풀빌라 프리미엄'];
const mealPrograms = ['제주 흑돼지 BBQ', '해물 코스 요리', '한정식 코스', '브런치 세트', '와인 디너', '전통 떡 만들기', '로컬 푸드 투어', '시골 밥상'];

const statuses: ReservationStatus[] = ['결제대기', '결제완료', '예약확정', '취소요청', '환불완료', '이용완료', '노쇼'];
const paymentStatuses: PaymentStatus[] = ['결제대기', '결제완료', '환불진행', '환불완료', '부분환불'];
const paymentMethods: PaymentMethod[] = ['카드', '계좌이체', '네이버페이', '카카오페이', '토스페이'];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateReservation(index: number): Reservation {
  const types: ReservationType[] = ['체험', '숙소', '식사'];
  const type = types[index % 3];
  const programs = type === '체험' ? experiencePrograms : type === '숙소' ? accommodationPrograms : mealPrograms;
  const program = randomFrom(programs);
  const status = randomFrom(statuses);
  const people = Math.floor(Math.random() * 8) + 1;
  const basePrice = type === '숙소' ? 150000 + Math.floor(Math.random() * 350000) : type === '체험' ? 25000 + Math.floor(Math.random() * 75000) : 30000 + Math.floor(Math.random() * 70000);
  const amount = basePrice * people;
  const maxCapacity = type === '숙소' ? Math.floor(Math.random() * 5) + 4 : Math.floor(Math.random() * 15) + 10;
  const currentBooked = Math.floor(Math.random() * (maxCapacity + 3));

  const reservationDate = `2026-02-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}`;
  const useDay = Math.floor(Math.random() * 28) + 1;
  const useMonth = Math.random() > 0.5 ? '02' : '03';
  const useDate = `2026-${useMonth}-${String(useDay).padStart(2, '0')}`;

  let paymentStatus: PaymentStatus = '결제완료';
  if (status === '결제대기') paymentStatus = '결제대기';
  else if (status === '환불완료') paymentStatus = '환불완료';
  else if (status === '취소요청') paymentStatus = '환불진행';

  return {
    id: `RSV-2026-${String(index + 1).padStart(5, '0')}`,
    type,
    programName: program,
    customerName: randomFrom(names),
    phone: randomFrom(phones),
    email: `user${index + 1}@email.com`,
    reservationDate,
    useDate,
    people,
    amount,
    paymentStatus,
    reservationStatus: status,
    paymentMethod: randomFrom(paymentMethods),
    maxCapacity,
    currentBooked,
    memo: '',
    logs: [
      { date: reservationDate, action: '예약 생성', by: '시스템' },
      ...(status !== '결제대기' ? [{ date: reservationDate, action: '결제 완료', by: '시스템' }] : []),
      ...(status === '예약확정' ? [{ date: reservationDate, action: '예약 확정', by: '관리자' }] : []),
    ],
  };
}

export const mockReservations: Reservation[] = Array.from({ length: 50 }, (_, i) => generateReservation(i));

// Today stats
export const todayStats = {
  todayReservations: 24,
  todayRevenue: 4850000,
  cancelRequests: 3,
  noShowExpected: 2,
};
