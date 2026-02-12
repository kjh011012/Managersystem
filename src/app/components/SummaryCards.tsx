import { CalendarCheck, DollarSign, XCircle, AlertTriangle } from 'lucide-react';
import { todayStats } from './mockData';

export function SummaryCards() {
  const cards = [
    {
      label: '오늘 예약 건수',
      value: `${todayStats.todayReservations}건`,
      icon: CalendarCheck,
      color: 'text-[#5F7D65]',
      bgColor: 'bg-[#5F7D65]/10',
    },
    {
      label: '오늘 매출',
      value: `${(todayStats.todayRevenue / 10000).toLocaleString()}만원`,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: '취소 요청',
      value: `${todayStats.cancelRequests}건`,
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      label: '노쇼 예정',
      value: `${todayStats.noShowExpected}건`,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4"
          >
            <div className={`w-11 h-11 rounded-xl ${card.bgColor} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-[0.8rem] text-gray-500">{card.label}</p>
              <p className="text-[1.25rem] text-[#1F2937] mt-0.5">{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
