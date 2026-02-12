// ─── Settlement Summary KPIs ─────────────────────────────
export interface SettlementKpi {
  id: string;
  label: string;
  amount: number;
  formatted: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral' | 'highlight';
}

export const settlementKpiData: SettlementKpi[] = [
  { id: 'total-revenue', label: '이번 달 총 매출', amount: 32450000, formatted: '32,450,000', description: '2026년 2월 기준', type: 'neutral' },
  { id: 'refund-deduction', label: '취소/환불 차감', amount: -2870000, formatted: '-2,870,000', description: '환불 12건 반영', type: 'negative' },
  { id: 'platform-fee', label: '플랫폼 수수료', amount: -2365600, formatted: '-2,365,600', description: '수수료율 8%', type: 'negative' },
  { id: 'vat', label: '부가세 (VAT)', amount: -2957000, formatted: '-2,957,000', description: '매출 기준 10%', type: 'negative' },
  { id: 'settlement-scheduled', label: '정산 예정 금액', amount: 24257400, formatted: '24,257,400', description: '다음 정산: 2026.03.05', type: 'positive' },
  { id: 'net-amount', label: '실수령 예상 금액', amount: 21892400, formatted: '21,892,400', description: '세후 최종 금액', type: 'highlight' },
  { id: 'unsettled', label: '미정산 잔액', amount: 3480000, formatted: '3,480,000', description: '전월 이월분 포함', type: 'neutral' },
];

// ─── Settlement Items ────────────────────────────────────
export type SettlementStatus = '정산 대기' | '정산 완료' | '정산 보류' | '환불 반영';

export interface SettlementItem {
  id: string;
  reservationNo: string;
  productName: string;
  productType: '체험' | '숙소' | '식사';
  useDate: string;
  paymentAmount: number;
  refundAmount: number;
  platformFee: number;
  vat: number;
  settlementAmount: number;
  status: SettlementStatus;
  customerName: string;
  paymentDate: string;
  settlementDate: string | null;
  refundNote: string | null;
}

export const settlementItems: SettlementItem[] = [
  {
    id: 'S001', reservationNo: 'RSV-2026-0201', productName: '오션뷰 풀빌라', productType: '숙소',
    useDate: '2026-02-01', paymentAmount: 350000, refundAmount: 0, platformFee: 28000, vat: 35000,
    settlementAmount: 287000, status: '정산 완료', customerName: '김*현', paymentDate: '2026-01-28',
    settlementDate: '2026-02-05', refundNote: null,
  },
  {
    id: 'S002', reservationNo: 'RSV-2026-0202', productName: '제주 감귤 따기 체험', productType: '체험',
    useDate: '2026-02-02', paymentAmount: 90000, refundAmount: 0, platformFee: 7200, vat: 9000,
    settlementAmount: 73800, status: '정산 완료', customerName: '이*수', paymentDate: '2026-01-30',
    settlementDate: '2026-02-05', refundNote: null,
  },
  {
    id: 'S003', reservationNo: 'RSV-2026-0203', productName: '한옥 스테이', productType: '숙소',
    useDate: '2026-02-03', paymentAmount: 280000, refundAmount: 280000, platformFee: 0, vat: 0,
    settlementAmount: 0, status: '환불 반영', customerName: '박*준', paymentDate: '2026-01-29',
    settlementDate: null, refundNote: '고객 사유 전액 환불 – 다음 정산에서 차감 예정',
  },
  {
    id: 'S004', reservationNo: 'RSV-2026-0204', productName: '제주 흑돼지 BBQ', productType: '식사',
    useDate: '2026-02-04', paymentAmount: 156000, refundAmount: 0, platformFee: 12480, vat: 15600,
    settlementAmount: 127920, status: '정산 대기', customerName: '최*영', paymentDate: '2026-02-01',
    settlementDate: null, refundNote: null,
  },
  {
    id: 'S005', reservationNo: 'RSV-2026-0205', productName: '도자기 공예 체험', productType: '체험',
    useDate: '2026-02-05', paymentAmount: 80000, refundAmount: 40000, platformFee: 3200, vat: 4000,
    settlementAmount: 32800, status: '환불 반영', customerName: '정*민', paymentDate: '2026-02-02',
    settlementDate: null, refundNote: '부분 환불(50%) – 잔여 금액 정산 대기',
  },
  {
    id: 'S006', reservationNo: 'RSV-2026-0206', productName: '글램핑 A타입', productType: '숙소',
    useDate: '2026-02-06', paymentAmount: 320000, refundAmount: 0, platformFee: 25600, vat: 32000,
    settlementAmount: 262400, status: '정산 보류', customerName: '한*지', paymentDate: '2026-02-03',
    settlementDate: null, refundNote: '결제 검증 대기 – 본사 확인 필요',
  },
  {
    id: 'S007', reservationNo: 'RSV-2026-0207', productName: '승마 체험', productType: '체험',
    useDate: '2026-02-07', paymentAmount: 120000, refundAmount: 120000, platformFee: 0, vat: 0,
    settlementAmount: 0, status: '환불 반영', customerName: '서*우', paymentDate: '2026-02-04',
    settlementDate: null, refundNote: '우천 취소 전액 환불 – 이미 정산된 건 차감 예정',
  },
  {
    id: 'S008', reservationNo: 'RSV-2026-0208', productName: '한정식 코스', productType: '식사',
    useDate: '2026-02-08', paymentAmount: 198000, refundAmount: 0, platformFee: 15840, vat: 19800,
    settlementAmount: 162360, status: '정산 완료', customerName: '윤*호', paymentDate: '2026-02-05',
    settlementDate: '2026-02-10', refundNote: null,
  },
  {
    id: 'S009', reservationNo: 'RSV-2026-0209', productName: '산속 독채 펜션', productType: '숙소',
    useDate: '2026-02-09', paymentAmount: 250000, refundAmount: 0, platformFee: 20000, vat: 25000,
    settlementAmount: 205000, status: '정산 대기', customerName: '강*빈', paymentDate: '2026-02-06',
    settlementDate: null, refundNote: null,
  },
  {
    id: 'S010', reservationNo: 'RSV-2026-0210', productName: '브런치 세트', productType: '식사',
    useDate: '2026-02-10', paymentAmount: 82000, refundAmount: 0, platformFee: 6560, vat: 8200,
    settlementAmount: 67240, status: '정산 대기', customerName: '임*은', paymentDate: '2026-02-07',
    settlementDate: null, refundNote: null,
  },
  {
    id: 'S011', reservationNo: 'RSV-2026-0211', productName: '오션뷰 풀빌라', productType: '숙소',
    useDate: '2026-02-11', paymentAmount: 350000, refundAmount: 0, platformFee: 28000, vat: 35000,
    settlementAmount: 287000, status: '정산 대기', customerName: '조*서', paymentDate: '2026-02-08',
    settlementDate: null, refundNote: null,
  },
  {
    id: 'S012', reservationNo: 'RSV-2026-0212', productName: '제주 감귤 따기 체험', productType: '체험',
    useDate: '2026-02-12', paymentAmount: 72000, refundAmount: 0, platformFee: 5760, vat: 7200,
    settlementAmount: 59040, status: '정산 보류', customerName: '신*경', paymentDate: '2026-02-09',
    settlementDate: null, refundNote: '카드 결제 이의제기 접수',
  },
  {
    id: 'S013', reservationNo: 'RSV-2026-0213', productName: '글램핑 A타입', productType: '숙소',
    useDate: '2026-02-13', paymentAmount: 320000, refundAmount: 0, platformFee: 25600, vat: 32000,
    settlementAmount: 262400, status: '정산 완료', customerName: '오*원', paymentDate: '2026-02-09',
    settlementDate: '2026-02-15', refundNote: null,
  },
  {
    id: 'S014', reservationNo: 'RSV-2026-0214', productName: '한옥 스테이', productType: '숙소',
    useDate: '2026-02-14', paymentAmount: 280000, refundAmount: 0, platformFee: 22400, vat: 28000,
    settlementAmount: 229600, status: '정산 대기', customerName: '백*아', paymentDate: '2026-02-10',
    settlementDate: null, refundNote: null,
  },
  {
    id: 'S015', reservationNo: 'RSV-2026-0215', productName: '제주 흑돼지 BBQ', productType: '식사',
    useDate: '2026-02-15', paymentAmount: 130000, refundAmount: 130000, platformFee: 0, vat: 0,
    settlementAmount: 0, status: '환불 반영', customerName: '유*은', paymentDate: '2026-02-11',
    settlementDate: null, refundNote: '노쇼 후 환불 요청 – 규정에 따라 전액 환불',
  },
];

// ─── Settlement Logs ─────────────────────────────────────
export interface SettlementLog {
  id: string;
  date: string;
  action: string;
  actor: string;
  detail: string;
  type: 'request' | 'approve' | 'complete' | 'hold' | 'reject';
}

export const settlementLogs: SettlementLog[] = [
  { id: 'L001', date: '2026-02-15 14:32', action: '정산 신청', actor: '가맹주', detail: '2월 1차 정산 신청 (24,257,400원)', type: 'request' },
  { id: 'L002', date: '2026-02-16 09:15', action: '본사 검토 시작', actor: '본사 정산팀', detail: '신청 내역 확인 중', type: 'approve' },
  { id: 'L003', date: '2026-02-16 11:20', action: '환불 건 확인', actor: '본사 정산팀', detail: 'RSV-2026-0203 환불 차감 확인 완료', type: 'approve' },
  { id: 'L004', date: '2026-02-17 10:00', action: '본사 승인', actor: '본사 정산팀', detail: '정산 승인 – 지급 예정일: 2026.03.05', type: 'approve' },
  { id: 'L005', date: '2026-02-10 09:00', action: '정산 신청', actor: '가맹주', detail: '1월 2차 정산 신청 (18,920,000원)', type: 'request' },
  { id: 'L006', date: '2026-02-10 14:30', action: '본사 승인', actor: '본사 정산팀', detail: '정산 승인 완료', type: 'approve' },
  { id: 'L007', date: '2026-02-13 10:00', action: '지급 완료', actor: '시스템', detail: '국민은행 ***-****-1234 입금 완료 (18,920,000원)', type: 'complete' },
  { id: 'L008', date: '2026-01-28 16:45', action: '정산 보류', actor: '본사 정산팀', detail: 'RSV-2026-0106 카드 이의제기 접수로 보류', type: 'hold' },
  { id: 'L009', date: '2026-02-02 11:00', action: '보류 해제', actor: '본사 정산팀', detail: '카드사 확인 완료 – 정산 재개', type: 'approve' },
  { id: 'L010', date: '2026-02-05 09:30', action: '지급 완료', actor: '시스템', detail: '국민은행 ***-****-1234 입금 완료 (22,150,000원)', type: 'complete' },
];

// ─── Settlement Request History ──────────────────────────
export type RequestStatus = '신청 완료' | '검토 중' | '지급 완료' | '지급 보류';

export interface SettlementRequest {
  id: string;
  requestDate: string;
  period: string;
  amount: number;
  status: RequestStatus;
  approvedDate: string | null;
  paidDate: string | null;
  account: string;
}

export const settlementRequests: SettlementRequest[] = [
  { id: 'REQ-001', requestDate: '2026-02-15', period: '2026년 2월 1차', amount: 24257400, status: '검토 중', approvedDate: '2026-02-17', paidDate: null, account: '국민은행 ***-****-1234' },
  { id: 'REQ-002', requestDate: '2026-02-10', period: '2026년 1월 2차', amount: 18920000, status: '지급 완료', approvedDate: '2026-02-10', paidDate: '2026-02-13', account: '국민은행 ***-****-1234' },
  { id: 'REQ-003', requestDate: '2026-01-25', period: '2026년 1월 1차', amount: 22150000, status: '지급 완료', approvedDate: '2026-01-26', paidDate: '2026-02-05', account: '국민은행 ***-****-1234' },
  { id: 'REQ-004', requestDate: '2026-01-10', period: '2025년 12월 2차', amount: 19870000, status: '지급 완료', approvedDate: '2026-01-11', paidDate: '2026-01-15', account: '국민은행 ***-****-1234' },
];

// ─── Business Info ───────────────────────────────────────
export interface BusinessInfo {
  businessNo: string;
  companyName: string;
  representative: string;
  bankName: string;
  accountNo: string;
  accountHolder: string;
  taxInvoice: boolean;
}

export const businessInfo: BusinessInfo = {
  businessNo: '123-45-67890',
  companyName: '(주)자연힐링스테이',
  representative: '김자연',
  bankName: '국민은행',
  accountNo: '***-****-1234',
  accountHolder: '(주)자연힐링스테이',
  taxInvoice: true,
};
