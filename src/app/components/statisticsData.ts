// ─── KPI Data ────────────────────────────────────────────
export interface KpiCard {
  id: string;
  label: string;
  value: number;
  formatted: string;
  unit: string;
  change: number; // percent
  trend: 'up' | 'down';
}

export const kpiData: KpiCard[] = [
  { id: 'revenue', label: '이번 달 매출', value: 32450000, formatted: '3,245만', unit: '원', change: 8.2, trend: 'up' },
  { id: 'bookings', label: '총 예약 건수', value: 287, formatted: '287', unit: '건', change: 12.5, trend: 'up' },
  { id: 'avg-price', label: '평균 객단가', value: 113050, formatted: '113,050', unit: '원', change: -3.1, trend: 'down' },
  { id: 'occupancy', label: '객실 점유율', value: 74.2, formatted: '74.2', unit: '%', change: 5.8, trend: 'up' },
  { id: 'cancel-rate', label: '취소율', value: 8.7, formatted: '8.7', unit: '%', change: 2.1, trend: 'up' },
  { id: 'noshow-rate', label: '노쇼율', value: 3.2, formatted: '3.2', unit: '%', change: -0.5, trend: 'down' },
];

// ─── Daily Revenue Data ──────────────────────────────────
export interface DailyRevenue {
  date: string;
  revenue: number;
  bookings: number;
}

export const dailyRevenueData: DailyRevenue[] = Array.from({ length: 28 }, (_, i) => {
  const day = i + 1;
  const isWeekend = (day % 7 === 0) || (day % 7 === 6);
  const base = isWeekend ? 1800000 : 900000;
  const variance = Math.floor(Math.random() * 600000) - 200000;
  const bookingBase = isWeekend ? 16 : 8;
  const bookingVar = Math.floor(Math.random() * 6) - 2;
  return {
    date: `2월 ${day}일`,
    revenue: Math.max(base + variance, 400000),
    bookings: Math.max(bookingBase + bookingVar, 3),
  };
});

// ─── Monthly Comparison ──────────────────────────────────
export interface MonthlyComparison {
  month: string;
  thisYear: number;
  lastYear: number;
}

export const monthlyComparisonData: MonthlyComparison[] = [
  { month: '1월', thisYear: 28500000, lastYear: 24200000 },
  { month: '2월', thisYear: 32450000, lastYear: 29800000 },
  { month: '3월', thisYear: 27100000, lastYear: 31500000 },
  { month: '4월', thisYear: 35200000, lastYear: 28700000 },
  { month: '5월', thisYear: 41800000, lastYear: 36400000 },
  { month: '6월', thisYear: 38900000, lastYear: 33100000 },
  { month: '7월', thisYear: 48200000, lastYear: 42500000 },
  { month: '8월', thisYear: 52100000, lastYear: 47800000 },
  { month: '9월', thisYear: 36700000, lastYear: 34200000 },
  { month: '10월', thisYear: 33800000, lastYear: 31000000 },
  { month: '11월', thisYear: 29400000, lastYear: 27600000 },
  { month: '12월', thisYear: 34600000, lastYear: 30900000 },
];

// ─── Day-of-Week Distribution ────────────────────────────
export interface DayOfWeek {
  day: string;
  bookings: number;
  occupancy: number;
}

export const dayOfWeekData: DayOfWeek[] = [
  { day: '월', bookings: 28, occupancy: 52 },
  { day: '화', bookings: 25, occupancy: 48 },
  { day: '수', bookings: 32, occupancy: 55 },
  { day: '목', bookings: 30, occupancy: 53 },
  { day: '금', bookings: 48, occupancy: 62 },
  { day: '토', bookings: 72, occupancy: 92 },
  { day: '일', bookings: 58, occupancy: 78 },
];

// ─── Monthly Occupancy Trend ─────────────────────────────
export interface MonthlyOccupancy {
  month: string;
  occupancy: number;
}

export const monthlyOccupancyData: MonthlyOccupancy[] = [
  { month: '1월', occupancy: 62 },
  { month: '2월', occupancy: 74 },
  { month: '3월', occupancy: 58 },
  { month: '4월', occupancy: 71 },
  { month: '5월', occupancy: 82 },
  { month: '6월', occupancy: 78 },
  { month: '7월', occupancy: 91 },
  { month: '8월', occupancy: 95 },
  { month: '9월', occupancy: 73 },
  { month: '10월', occupancy: 68 },
  { month: '11월', occupancy: 55 },
  { month: '12월', occupancy: 66 },
];

// ─── Product Performance ─────────────────────────────────
export interface ProductPerformance {
  id: string;
  name: string;
  type: '체험' | '숙소' | '식사';
  bookings: number;
  revenue: number;
  avgPeople: number;
  cancelRate: number;
  changeRate: number;
}

export const productPerformanceData: ProductPerformance[] = [
  { id: 'P001', name: '오션뷰 풀빌라', type: '숙소', bookings: 42, revenue: 12600000, avgPeople: 3.2, cancelRate: 4.8, changeRate: 15.2 },
  { id: 'P002', name: '제주 감귤 따기 체험', type: '체험', bookings: 38, revenue: 3420000, avgPeople: 4.5, cancelRate: 6.2, changeRate: 8.7 },
  { id: 'P003', name: '한옥 스테이', type: '숙소', bookings: 35, revenue: 8750000, avgPeople: 2.8, cancelRate: 3.1, changeRate: -2.4 },
  { id: 'P004', name: '제주 흑돼지 BBQ', type: '식사', bookings: 31, revenue: 4030000, avgPeople: 5.1, cancelRate: 12.9, changeRate: -8.3 },
  { id: 'P005', name: '도자기 공예 체험', type: '체험', bookings: 28, revenue: 2240000, avgPeople: 3.8, cancelRate: 15.4, changeRate: -12.1 },
  { id: 'P006', name: '글램핑 A타입', type: '숙소', bookings: 26, revenue: 7800000, avgPeople: 2.4, cancelRate: 5.5, changeRate: 3.2 },
  { id: 'P007', name: '승마 체험', type: '체험', bookings: 24, revenue: 2880000, avgPeople: 2.1, cancelRate: 18.2, changeRate: -15.6 },
  { id: 'P008', name: '한정식 코스', type: '식사', bookings: 22, revenue: 3520000, avgPeople: 6.2, cancelRate: 7.1, changeRate: 4.5 },
  { id: 'P009', name: '산속 독채 펜션', type: '숙소', bookings: 20, revenue: 5000000, avgPeople: 3.5, cancelRate: 2.8, changeRate: 11.3 },
  { id: 'P010', name: '브런치 세트', type: '식사', bookings: 18, revenue: 1440000, avgPeople: 2.3, cancelRate: 9.8, changeRate: -5.7 },
];

// ─── AI Advisor Content ──────────────────────────────────
export interface AiSection {
  id: string;
  title: string;
  icon: string;
  items: string[];
  color: string;
}

export const aiAdvisorContent: AiSection[] = [
  {
    id: 'status',
    title: '현재 상태 요약',
    icon: '📊',
    items: [
      '이번 달 매출은 전월 대비 8.2% 증가하여 3,245만 원을 기록했습니다.',
      '객실 점유율 74.2%로 양호한 수준이나, 평일 점유율이 주말 대비 40% 낮습니다.',
      '총 예약 건수 287건으로 전월 대비 12.5% 증가했습니다.',
    ],
    color: '#5F7D65',
  },
  {
    id: 'cause',
    title: '원인 분석',
    icon: '🔍',
    items: [
      '주말 점유율은 평균 85% 이상으로 매우 높으나, 화·수요일 점유율이 50% 미만입니다.',
      '승마 체험·도자기 공예 체험의 취소율이 15% 이상으로 업계 평균보다 높습니다.',
      '흑돼지 BBQ 예약이 전월 대비 8.3% 감소하며 식사 부문 매출에 영향을 주고 있습니다.',
    ],
    color: '#6B7280',
  },
  {
    id: 'warning',
    title: '위험 경고',
    icon: '⚠️',
    items: [
      '승마 체험 취소율이 3개월 연속 상승 중입니다. 조기 대응이 필요합니다.',
      '평일 공실률이 지속되면 3월 전체 매출이 전년 대비 15% 하락할 수 있습니다.',
      '노쇼 고객 중 60%가 재방문 고객입니다. 리마인드 시스템 강화가 필요합니다.',
    ],
    color: '#C66A6A',
  },
  {
    id: 'strategy',
    title: '실행 전략 제안',
    icon: '💡',
    items: [
      '평일 1인 힐링 패키지 출시를 권장합니다. (목표: 평일 점유율 15% 향상)',
      '2박 이상 연박 시 10% 할인 이벤트를 제안합니다.',
      'SNS 타겟 광고를 화·수요일 체크인 상품에 집중 배치하세요.',
      '승마 체험은 날씨 연동 취소 방지 안내 강화가 필요합니다.',
    ],
    color: '#5F7D65',
  },
];

// ─── Problem Detection ───────────────────────────────────
export interface ProblemAlert {
  id: string;
  type: 'vacancy' | 'cancel' | 'noshow';
  severity: 'high' | 'medium' | 'low';
  message: string;
  detail: string;
  metric: string;
}

export const problemAlerts: ProblemAlert[] = [
  { id: 'A1', type: 'vacancy', severity: 'high', message: '화요일 공실률이 52%로 증가했습니다.', detail: '전월 대비 +8%p 상승', metric: '52%' },
  { id: 'A2', type: 'cancel', severity: 'high', message: '승마 체험 취소율이 평균보다 2배 높습니다.', detail: '취소율 18.2% (평균 8.7%)', metric: '18.2%' },
  { id: 'A3', type: 'cancel', severity: 'medium', message: '도자기 공예 체험 취소율이 상승 추세입니다.', detail: '전월 대비 +4.2%p', metric: '15.4%' },
  { id: 'A4', type: 'noshow', severity: 'medium', message: '노쇼 건수가 주말에 집중되고 있습니다.', detail: '주말 노쇼 비율 72%', metric: '72%' },
  { id: 'A5', type: 'vacancy', severity: 'low', message: '수요일 글램핑 점유율이 낮습니다.', detail: '수요일 평균 점유율 38%', metric: '38%' },
  { id: 'A6', type: 'cancel', severity: 'high', message: '흑돼지 BBQ 예약이 전월 대비 감소했습니다.', detail: '전월 대비 -8.3% 하락', metric: '-8.3%' },
];
