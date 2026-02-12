import type { ReservationStatus, PaymentStatus } from './mockData';

const reservationStatusColors: Record<ReservationStatus, { bg: string; text: string }> = {
  '예약확정': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  '결제대기': { bg: 'bg-amber-100', text: 'text-amber-700' },
  '결제완료': { bg: 'bg-blue-100', text: 'text-blue-700' },
  '취소요청': { bg: 'bg-red-100', text: 'text-red-700' },
  '이용완료': { bg: 'bg-sky-100', text: 'text-sky-700' },
  '노쇼': { bg: 'bg-rose-200', text: 'text-rose-900' },
  '환불완료': { bg: 'bg-gray-200', text: 'text-gray-600' },
};

const paymentStatusColors: Record<PaymentStatus, { bg: string; text: string }> = {
  '결제대기': { bg: 'bg-amber-100', text: 'text-amber-700' },
  '결제완료': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  '환불진행': { bg: 'bg-orange-100', text: 'text-orange-700' },
  '환불완료': { bg: 'bg-gray-200', text: 'text-gray-600' },
  '부분환불': { bg: 'bg-purple-100', text: 'text-purple-700' },
};

export function ReservationStatusTag({ status }: { status: ReservationStatus }) {
  const colors = reservationStatusColors[status] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.75rem] ${colors.bg} ${colors.text}`}>
      {status}
    </span>
  );
}

export function PaymentStatusTag({ status }: { status: PaymentStatus }) {
  const colors = paymentStatusColors[status] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.75rem] ${colors.bg} ${colors.text}`}>
      {status}
    </span>
  );
}

export function TypeTag({ type }: { type: '체험' | '숙소' | '식사' }) {
  const colors = {
    '체험': { bg: 'bg-violet-100', text: 'text-violet-700' },
    '숙소': { bg: 'bg-teal-100', text: 'text-teal-700' },
    '식사': { bg: 'bg-orange-100', text: 'text-orange-700' },
  };
  const c = colors[type];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[0.75rem] ${c.bg} ${c.text}`}>
      {type}
    </span>
  );
}
