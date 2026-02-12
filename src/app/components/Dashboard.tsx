import { useMemo } from 'react';
import {
  CalendarCheck,
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { mockReservations } from './mockData';
import { ReservationStatusTag, TypeTag } from './StatusTag';

const weeklyData = [
  { name: '월', 체험: 12, 숙소: 8, 식사: 15 },
  { name: '화', 체험: 19, 숙소: 11, 식사: 13 },
  { name: '수', 체험: 15, 숙소: 9, 식사: 18 },
  { name: '목', 체험: 22, 숙소: 14, 식사: 16 },
  { name: '금', 체험: 28, 숙소: 18, 식사: 24 },
  { name: '토', 체험: 35, 숙소: 22, 식사: 30 },
  { name: '일', 체험: 31, 숙소: 19, 식사: 27 },
];

const revenueData = [
  { name: '1월', revenue: 18500000 },
  { name: '2월', revenue: 24300000 },
  { name: '3월', revenue: 21200000 },
  { name: '4월', revenue: 27800000 },
  { name: '5월', revenue: 32100000 },
  { name: '6월', revenue: 29500000 },
];

const pieData = [
  { name: '체험', value: 42, color: '#8B5CF6' },
  { name: '숙소', value: 33, color: '#14B8A6' },
  { name: '식사', value: 25, color: '#F97316' },
];

export function Dashboard() {
  const recentReservations = useMemo(() => mockReservations.slice(0, 8), []);
  const pendingCancels = useMemo(
    () => mockReservations.filter((r) => r.reservationStatus === '취소요청').slice(0, 3),
    []
  );

  const stats = [
    {
      label: '이번 달 예약',
      value: '482건',
      change: '+12.5%',
      isUp: true,
      icon: CalendarCheck,
      color: 'text-[#5F7D65]',
      bgColor: 'bg-[#5F7D65]/10',
    },
    {
      label: '이번 달 매출',
      value: '2,430만원',
      change: '+8.3%',
      isUp: true,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: '신규 고객',
      value: '156명',
      change: '+23.1%',
      isUp: true,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: '예약 전환율',
      value: '68.4%',
      change: '-2.1%',
      isUp: false,
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[#1F2937]">대시보드</h1>
        <p className="text-[0.85rem] text-gray-500 mt-1">오늘의 운영 현황을 확인합니다.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className={`flex items-center gap-0.5 text-[0.75rem] ${stat.isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stat.isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-[1.35rem] text-[#1F2937]">{stat.value}</p>
              <p className="text-[0.75rem] text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-[#1F2937] mb-4">주간 예약 현황</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }}
              />
              <Bar dataKey="체험" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="숙소" fill="#14B8A6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="식사" fill="#F97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-[#1F2937] mb-4">유형별 비율</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[0.75rem] text-gray-500">{item.name} {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-[#1F2937] mb-4">월별 매출 추이</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
            <YAxis
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              tickFormatter={(val) => `${(val / 10000).toLocaleString()}만`}
            />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px' }}
              formatter={(value: number) => [`${value.toLocaleString()}원`, '매출']}
            />
            <Line type="monotone" dataKey="revenue" stroke="#5F7D65" strokeWidth={2.5} dot={{ fill: '#5F7D65', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent reservations */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#1F2937]">최근 예약</h3>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentReservations.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3 min-w-0">
                  <TypeTag type={r.type} />
                  <div className="min-w-0">
                    <p className="text-[0.8rem] text-[#1F2937] truncate">{r.programName}</p>
                    <p className="text-[0.7rem] text-gray-400">{r.customerName} · {r.useDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[0.8rem] text-[#1F2937]">{r.amount.toLocaleString()}원</span>
                  <ReservationStatusTag status={r.reservationStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending cancellations */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#1F2937]">처리 대기</h3>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          {pendingCancels.length > 0 ? (
            <div className="space-y-3">
              {pendingCancels.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-red-50/50 rounded-lg">
                  <div>
                    <p className="text-[0.8rem] text-[#1F2937]">{r.customerName} — {r.programName}</p>
                    <p className="text-[0.7rem] text-gray-400">{r.id} · {r.useDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[0.75rem] text-gray-600 hover:bg-gray-50 transition-colors">
                      거절
                    </button>
                    <button className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[0.75rem] hover:bg-red-600 transition-colors">
                      승인
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[0.85rem] text-gray-400 py-8 text-center">처리 대기 건이 없습니다.</p>
          )}

          <div className="mt-4 p-3 bg-amber-50 rounded-lg">
            <p className="text-[0.8rem] text-amber-700">금일 확인 필요 사항</p>
            <ul className="mt-2 space-y-1">
              <li className="text-[0.75rem] text-amber-600">· 노쇼 예정 2건 확인 필요</li>
              <li className="text-[0.75rem] text-amber-600">· 결제대기 5건 미결제 알림 발송 필요</li>
              <li className="text-[0.75rem] text-amber-600">· 내일 체험 프로그램 최소인원 미달 1건</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
