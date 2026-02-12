export type InquiryCategory = '예약' | '특산품';
export type InquirySubcategory = '체험' | '숙소' | '식사' | '';
export type InquiryStatus = '답변대기' | '답변완료' | '보류';
export type InquiryPriority = '높음' | '보통' | '낮음';

export interface InquiryReply {
  content: string;
  repliedBy: string;
  repliedAt: string;
}

export interface Inquiry {
  id: string;
  category: InquiryCategory;
  subcategory: InquirySubcategory;
  customerName: string;
  phone: string;
  email: string;
  subject: string;
  content: string;
  relatedItemName: string;
  relatedItemId: string;
  status: InquiryStatus;
  priority: InquiryPriority;
  createdAt: string;
  reply: InquiryReply | null;
  isPrivate: boolean;
}

const names = ['김민수', '이지은', '박서연', '최현우', '정하늘', '강도윤', '조은서', '윤서준', '임채원', '한지호', '송민지', '오태영', '배수빈', '류하은', '신동현', '장예진', '황준혁', '전소미', '권나윤', '문재현'];
const phones = ['010-1234-5678', '010-2345-6789', '010-3456-7890', '010-4567-8901', '010-5678-9012', '010-6789-0123', '010-7890-1234', '010-8901-2345', '010-9012-3456', '010-0123-4567'];

// Reservation inquiry subjects & content
const reservationInquiries = [
  {
    subcategory: '체험' as const,
    item: '제주 감귤 따기 체험',
    subject: '감귤 따기 체험 가능 인원 문의',
    content: '안녕하세요, 감귤 따기 체험을 8명이서 예약하려고 하는데 가능한가요? 아이 3명 포함입니다.',
  },
  {
    subcategory: '체험' as const,
    item: '도자기 공예 체험',
    subject: '도자기 공예 소요시간 및 준비물',
    content: '도자기 공예 체험 소요시간이 어느 정도 되나요? 혹시 앞치마 같은 거 준비해야 하나요?',
  },
  {
    subcategory: '숙소' as const,
    item: '오션뷰 풀빌라',
    subject: '체크인 시간 변경 가능 여부',
    content: '예약한 풀빌라 체크인을 14시에서 12시로 앞당길 수 있을까요? 비행기가 일찍 도착합니다.',
  },
  {
    subcategory: '숙소' as const,
    item: '한옥 스테이',
    subject: '반려동물 동반 가능한가요?',
    content: '소형견(말티즈, 3kg)과 함께 투숙 가능한지 궁금합니다. 추가 요금이 있다면 알려주세요.',
  },
  {
    subcategory: '숙소' as const,
    item: '글램핑 A타입',
    subject: '바베큐 장비 대여 문의',
    content: '글램핑장에서 바베큐 가능한가요? 장비와 숯은 제공되는지, 추가 비용은 얼마인지 알고 싶습니다.',
  },
  {
    subcategory: '식사' as const,
    item: '제주 흑돼지 BBQ',
    subject: '알러지 관련 메뉴 변경 가능 여부',
    content: '일행 중 해산물 알러지가 있는 분이 계신데, 해산물 없는 메뉴로 변경 가능한가요?',
  },
  {
    subcategory: '식사' as const,
    item: '한정식 코스',
    subject: '단체 예약 할인 문의',
    content: '15명 단체 예약인데 할인 혜택이 있을까요? 법인카드 결제도 가능한지요.',
  },
  {
    subcategory: '체험' as const,
    item: '승마 체험',
    subject: '우천 시 취소/변경 정책',
    content: '비가 올 경우 승마 체험이 취소되나요? 취소 시 전액 환불 되는지, 날짜 변경은 가능한지요.',
  },
  {
    subcategory: '숙소' as const,
    item: '산속 독채 펜션',
    subject: '추가 침구 요청 가능한가요?',
    content: '성인 4명이 숙박하는데, 기본 침구 외에 이불 1세트 추가 가능할까요?',
  },
  {
    subcategory: '식사' as const,
    item: '브런치 세트',
    subject: '채식 메뉴 가능 여부',
    content: '비건 식단이 가능한지 궁금합니다. 가능하다면 어떤 메뉴로 대체 가능한가요?',
  },
  {
    subcategory: '체험' as const,
    item: '서핑 레슨',
    subject: '초보자도 참여 가능한가요?',
    content: '서핑을 한번도 해본 적 없는 완전 초보인데 레슨 참여가 가능할까요? 장비 렌탈 포함인가요?',
  },
  {
    subcategory: '숙소' as const,
    item: '리조트 디럭스',
    subject: '레이트 체크아웃 가능 여부',
    content: '체크아웃을 11시에서 14시로 연장할 수 있을까요? 추가 비용이 얼마나 되는지 알려주세요.',
  },
];

// Specialty product inquiry subjects & content
const productInquiries = [
  {
    item: '제주 감귤 선물세트 (5kg)',
    itemId: 'PRD-001',
    subject: '감귤 당도 보증 관련 문의',
    content: '선물용으로 구매하려는데 당도 보증이 되나요? 혹시 당도가 낮으면 교환 가능한가요?',
  },
  {
    item: '한라봉 프리미엄 (3kg)',
    itemId: 'PRD-002',
    subject: '배송 기간 및 신선도 보장',
    content: '주문 후 배송까지 얼마나 걸리나요? 아이스박스로 배송되나요? 신선도 보장 기간이 궁금합니다.',
  },
  {
    item: '제주 녹차 세트',
    itemId: 'PRD-003',
    subject: '유통기한 확인 부탁드립니다',
    content: '녹차 세트 유통기한이 얼마나 남은 제품이 배송되나요? 선물용인데 최소 6개월 이상 남은 걸로 부탁드립니다.',
  },
  {
    item: '흑돼지 모듬 세트 (1kg)',
    itemId: 'PRD-004',
    subject: '냉동 배송 관련 문의',
    content: '냉동 상태로 배송되나요? 해동 후 재냉동해도 괜찮은지, 보관 방법 안내 부탁드립니다.',
  },
  {
    item: '제주 유채꿀 (500ml)',
    itemId: 'PRD-005',
    subject: '순수 제주산 꿀인지 확인',
    content: '100% 제주산 벌꿀인가요? 혼합 여부와 원산지 표기가 어떻게 되는지 확인하고 싶습니다.',
  },
  {
    item: '한라산 소주 기프트세트',
    itemId: 'PRD-006',
    subject: '대량 주문 할인 가능 여부',
    content: '회사 행사용으로 50세트 주문하려는데 대량 구매 할인 가능한가요? 견적서 발행도 가능한지요.',
  },
  {
    item: '제주 건어물 세트',
    itemId: 'PRD-007',
    subject: '포장 방법 문의',
    content: '명절 선물용인데 포장지 옵션이 있나요? 보자기 포장이나 고급 포장 가능한지 확인 부탁드립니다.',
  },
  {
    item: '감귤 초콜릿 세트',
    itemId: 'PRD-008',
    subject: '알러지 성분 확인',
    content: '견과류 알러지가 있어서요. 감귤 초콜릿에 견과류 성분이 포함되어 있는지 확인 부탁드립니다.',
  },
  {
    item: '제주 말고기 육포',
    itemId: 'PRD-009',
    subject: '제품 원산지 및 부위 문의',
    content: '말고기 육포의 원산지와 사용 부위가 어디인지 궁금합니다. HACCP 인증 여부도 알려주세요.',
  },
  {
    item: '제주 수제 쿠키 세트',
    itemId: 'PRD-010',
    subject: '쿠키 수량 및 종류',
    content: '세트에 몇 개 들어있나요? 어떤 맛이 포함되어 있는지 구성이 궁금합니다.',
  },
  {
    item: '제주 감귤 잼 (3병 세트)',
    itemId: 'PRD-011',
    subject: '개봉 후 보관 방법',
    content: '감귤 잼 개봉 후 냉장 보관 시 얼마나 보관 가능한가요? 무첨가 제품인가요?',
  },
  {
    item: '제주 흑돼지 소시지',
    itemId: 'PRD-012',
    subject: '배송지 변경 요청',
    content: '이미 주문했는데 배송지 변경이 가능한가요? 주문번호는 ORD-2026-00045입니다.',
  },
];

const replyContents = [
  '안녕하세요, 문의해주셔서 감사합니다. 확인 후 안내 드리겠습니다. 가능하오니 예약 진행해 주세요.',
  '안녕하세요! 해당 상품/프로그램은 요청하신 사항이 가능합니다. 추가 문의는 언제든 연락 주세요.',
  '고객님 안녕하세요. 담당 부서에 확인한 결과, 말씀하신 내용은 아래와 같이 안내 드립니다. 감사합니다.',
  '안녕하세요, 자세한 문의 감사합니다. 해당 건은 현재 확인 중이며, 추가 안내를 위해 연락드리겠습니다.',
  '안녕하세요! 문의하신 내용 확인되었습니다. 해당 옵션은 추가 비용 없이 제공됩니다. 감사합니다.',
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDate(dayOffset: number): string {
  const base = new Date(2026, 1, 12);
  base.setDate(base.getDate() - dayOffset);
  return base.toISOString().split('T')[0];
}

function generateDateTime(dayOffset: number, hour: number): string {
  const base = new Date(2026, 1, 12, hour, Math.floor(Math.random() * 60));
  base.setDate(base.getDate() - dayOffset);
  return base.toISOString().slice(0, 16).replace('T', ' ');
}

export function generateReservationInquiries(): Inquiry[] {
  return reservationInquiries.map((item, idx) => {
    const statuses: InquiryStatus[] = ['답변대기', '답변완료', '보류'];
    const priorities: InquiryPriority[] = ['높음', '보통', '낮음'];
    const status = idx < 4 ? '답변대기' : idx < 9 ? '답변완료' : '보류';
    const priority = idx < 2 ? '높음' : idx < 7 ? '보통' : '낮음';
    const dayOffset = Math.floor(Math.random() * 14);

    return {
      id: `INQ-RSV-${String(idx + 1).padStart(4, '0')}`,
      category: '예약',
      subcategory: item.subcategory,
      customerName: randomFrom(names),
      phone: randomFrom(phones),
      email: `customer${idx + 1}@email.com`,
      subject: item.subject,
      content: item.content,
      relatedItemName: item.item,
      relatedItemId: `RSV-2026-${String(idx + 100).padStart(5, '0')}`,
      status,
      priority,
      createdAt: generateDateTime(dayOffset, 9 + Math.floor(Math.random() * 10)),
      reply: status === '답변완료' ? {
        content: randomFrom(replyContents),
        repliedBy: '관리자',
        repliedAt: generateDateTime(dayOffset - 1, 10 + Math.floor(Math.random() * 8)),
      } : null,
      isPrivate: Math.random() > 0.7,
    };
  });
}

export function generateProductInquiries(): Inquiry[] {
  return productInquiries.map((item, idx) => {
    const status: InquiryStatus = idx < 4 ? '답변대기' : idx < 9 ? '답변완료' : '보류';
    const priority: InquiryPriority = idx < 2 ? '높음' : idx < 8 ? '보통' : '낮음';
    const dayOffset = Math.floor(Math.random() * 14);

    return {
      id: `INQ-PRD-${String(idx + 1).padStart(4, '0')}`,
      category: '특산품',
      subcategory: '',
      customerName: randomFrom(names),
      phone: randomFrom(phones),
      email: `buyer${idx + 1}@email.com`,
      subject: item.subject,
      content: item.content,
      relatedItemName: item.item,
      relatedItemId: item.itemId,
      status,
      priority,
      createdAt: generateDateTime(dayOffset, 9 + Math.floor(Math.random() * 10)),
      reply: status === '답변완료' ? {
        content: randomFrom(replyContents),
        repliedBy: '관리자',
        repliedAt: generateDateTime(dayOffset - 1, 10 + Math.floor(Math.random() * 8)),
      } : null,
      isPrivate: Math.random() > 0.7,
    };
  });
}

export const mockReservationInquiries = generateReservationInquiries();
export const mockProductInquiries = generateProductInquiries();
