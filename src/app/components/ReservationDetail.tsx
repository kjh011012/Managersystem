import { useState } from 'react';
import {
  ArrowLeft,
  User,
  Calendar,
  CreditCard,
  Calculator,
  MessageSquare,
  Send,
  AlertTriangle,
  Clock,
  ChevronDown,
  Users,
  FileText,
} from 'lucide-react';
import type { Reservation, ReservationStatus, PaymentStatus } from './mockData';
import { ReservationStatusTag, PaymentStatusTag, TypeTag } from './StatusTag';

interface ReservationDetailProps {
  reservation: Reservation;
  onBack: () => void;
  onStatusChange: (id: string, status: ReservationStatus) => void;
}

const statusOptions: ReservationStatus[] = ['결제대기', '결제완료', '예약확정', '취소요청', '환불완료', '이용완료', '노쇼'];
const paymentStatusOptions: PaymentStatus[] = ['결제대기', '결제완료', '환불진행', '환불완료', '부분환불'];

export function ReservationDetail({ reservation, onBack, onStatusChange }: ReservationDetailProps) {
  const [currentStatus, setCurrentStatus] = useState<ReservationStatus>(reservation.reservationStatus);
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState<PaymentStatus>(reservation.paymentStatus);
  const [memo, setMemo] = useState(reservation.memo);
  const [showRefund, setShowRefund] = useState(false);
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
  const [partialAmount, setPartialAmount] = useState('');
  const [newPeople, setNewPeople] = useState(reservation.people);
  const [newDate, setNewDate] = useState(reservation.useDate);
  const [showLogs, setShowLogs] = useState(false);

  const isOverbooking = reservation.currentBooked > reservation.maxCapacity;
  const remainingCapacity = reservation.maxCapacity - reservation.currentBooked;

  // Settlement calculation
  const totalAmount = reservation.amount;
  const platformFee = Math.round(totalAmount * 0.035);
  const vat = Math.round(platformFee * 0.1);
  const settlementAmount = totalAmount - platformFee - vat;

  // Cancellation policy calculation
  const useDate = new Date(reservation.useDate);
  const today = new Date('2026-02-12');
  const diffDays = Math.ceil((useDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  let refundRate = 100;
  let refundPolicyLabel = '';
  if (diffDays >= 7) {
    refundRate = 100;
    refundPolicyLabel = '이용일 7일 전 이상 — 100% 환불';
  } else if (diffDays >= 3) {
    refundRate = 70;
    refundPolicyLabel = '이용일 3~6일 전 — 70% 환불';
  } else if (diffDays >= 1) {
    refundRate = 50;
    refundPolicyLabel = '이용일 1~2일 전 — 50% 환불';
  } else {
    refundRate = 0;
    refundPolicyLabel = '이용일 당일 — 환불 불가';
  }
  const calculatedRefund = Math.round(totalAmount * (refundRate / 100));

  const handleStatusChange = (status: ReservationStatus) => {
    setCurrentStatus(status);
    onStatusChange(reservation.id, status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-[#1F2937]">{reservation.id}</h2>
              <TypeTag type={reservation.type} />
              <ReservationStatusTag status={currentStatus} />
            </div>
            <p className="text-[0.8rem] text-gray-500 mt-0.5">{reservation.programName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value as ReservationStatus)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-[0.8rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20 cursor-pointer"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={currentPaymentStatus}
              onChange={(e) => setCurrentPaymentStatus(e.target.value as PaymentStatus)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-[0.8rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20 cursor-pointer"
            >
              {paymentStatusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-[0.8rem] text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4" /> 로그
          </button>
        </div>
      </div>

      {/* Overbooking warning */}
      {isOverbooking && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <p className="text-[0.85rem] text-red-700">오버부킹 경고</p>
            <p className="text-[0.75rem] text-red-500 mt-0.5">
              현재 예약 인원({reservation.currentBooked}명)이 최대 수용 인원({reservation.maxCapacity}명)을 초과했습니다.
            </p>
          </div>
        </div>
      )}

      {/* Log panel */}
      {showLogs && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-[#1F2937] mb-3">예약 변경 이력</h3>
          <div className="space-y-2">
            {reservation.logs.map((log, i) => (
              <div key={i} className="flex items-center gap-3 text-[0.8rem]">
                <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="text-gray-400 w-[90px] shrink-0">{log.date}</span>
                <span className="text-[#1F2937]">{log.action}</span>
                <span className="text-gray-400">— {log.by}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Customer info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4.5 h-4.5 text-[#5F7D65]" />
            <h3 className="text-[#1F2937]">고객 정보</h3>
          </div>
          <div className="space-y-3">
            <InfoRow label="고객명" value={reservation.customerName} />
            <InfoRow label="연락처" value={reservation.phone} />
            <InfoRow label="이메일" value={reservation.email} />
          </div>
        </div>

        {/* Reservation info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4.5 h-4.5 text-[#5F7D65]" />
            <h3 className="text-[#1F2937]">예약 정보</h3>
          </div>
          <div className="space-y-3">
            <InfoRow label="프로그램" value={reservation.programName} />
            <InfoRow label="예약일" value={reservation.reservationDate} />
            <InfoRow label="이용일" value={reservation.useDate} />
            <InfoRow label="인원" value={`${reservation.people}명`} />
          </div>
        </div>

        {/* Payment info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4.5 h-4.5 text-[#5F7D65]" />
            <h3 className="text-[#1F2937]">결제 정보</h3>
          </div>
          <div className="space-y-3">
            <InfoRow label="결제금액" value={`${totalAmount.toLocaleString()}원`} />
            <InfoRow label="결제수단" value={reservation.paymentMethod} />
            <div className="flex items-center justify-between">
              <span className="text-[0.8rem] text-gray-500">결제상태</span>
              <PaymentStatusTag status={currentPaymentStatus} />
            </div>
          </div>
        </div>

        {/* Settlement preview */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-4.5 h-4.5 text-[#5F7D65]" />
            <h3 className="text-[#1F2937]">정산 예정</h3>
          </div>
          <div className="space-y-3">
            <InfoRow label="총 결제금액" value={`${totalAmount.toLocaleString()}원`} />
            <InfoRow label="플랫폼 수수료 (3.5%)" value={`-${platformFee.toLocaleString()}원`} valueColor="text-red-500" />
            <InfoRow label="VAT (수수료의 10%)" value={`-${vat.toLocaleString()}원`} valueColor="text-red-500" />
            <div className="border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[0.85rem] text-[#1F2937]">가맹주 정산 예정액</span>
                <span className="text-[1.1rem] text-[#5F7D65]">{settlementAmount.toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Capacity display */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4.5 h-4.5 text-[#5F7D65]" />
          <h3 className="text-[#1F2937]">잔여 수량</h3>
        </div>
        <div className="flex items-center gap-8 flex-wrap">
          <div className="text-center">
            <p className="text-[0.75rem] text-gray-500">최대 인원</p>
            <p className="text-[1.25rem] text-[#1F2937] mt-1">{reservation.maxCapacity}명</p>
          </div>
          <div className="text-center">
            <p className="text-[0.75rem] text-gray-500">현재 예약</p>
            <p className="text-[1.25rem] text-[#1F2937] mt-1">{reservation.currentBooked}명</p>
          </div>
          <div className="text-center">
            <p className="text-[0.75rem] text-gray-500">잔여 인원</p>
            <p className={`text-[1.25rem] mt-1 ${remainingCapacity < 0 ? 'text-red-500' : remainingCapacity <= 2 ? 'text-amber-500' : 'text-[#5F7D65]'}`}>
              {remainingCapacity}명
            </p>
          </div>
          {isOverbooking && (
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-[0.75rem]">
              오버부킹 +{Math.abs(remainingCapacity)}명
            </span>
          )}
          <div className="flex-1 min-w-[200px]">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${isOverbooking ? 'bg-red-500' : remainingCapacity <= 2 ? 'bg-amber-500' : 'bg-[#5F7D65]'}`}
                style={{ width: `${Math.min((reservation.currentBooked / reservation.maxCapacity) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[0.7rem] text-gray-400 mt-1">
              {Math.round((reservation.currentBooked / reservation.maxCapacity) * 100)}% 충원
            </p>
          </div>
        </div>
      </div>

      {/* Operation actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-[#1F2937] mb-4">운영 관리</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* People change */}
          <div>
            <label className="text-[0.8rem] text-gray-500 block mb-2">인원 변경</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNewPeople(Math.max(1, newPeople - 1))}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center text-[0.9rem] text-[#1F2937]">{newPeople}명</span>
              <button
                onClick={() => setNewPeople(newPeople + 1)}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
              >
                +
              </button>
              {newPeople !== reservation.people && (
                <button className="ml-2 px-3 py-1.5 bg-[#5F7D65] text-white rounded-lg text-[0.8rem] hover:bg-[#4F6D55] transition-colors">
                  변경 저장
                </button>
              )}
            </div>
          </div>

          {/* Date change */}
          <div>
            <label className="text-[0.8rem] text-gray-500 block mb-2">일정 변경</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[0.8rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20"
              />
              {newDate !== reservation.useDate && (
                <button className="px-3 py-1.5 bg-[#5F7D65] text-white rounded-lg text-[0.8rem] hover:bg-[#4F6D55] transition-colors">
                  변경 저장
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => { setShowRefund(true); setRefundType('partial'); }}
            className="px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg text-[0.8rem] hover:bg-amber-50 transition-colors"
          >
            부분 환불
          </button>
          <button
            onClick={() => { setShowRefund(true); setRefundType('full'); }}
            className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg text-[0.8rem] hover:bg-red-50 transition-colors"
          >
            전체 취소
          </button>
          <button
            onClick={() => handleStatusChange('노쇼')}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-[0.8rem] hover:bg-gray-50 transition-colors"
          >
            노쇼 처리
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-blue-300 text-blue-600 rounded-lg text-[0.8rem] hover:bg-blue-50 transition-colors">
            <Send className="w-3.5 h-3.5" /> 문자 발송
          </button>
        </div>
      </div>

      {/* Memo */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4.5 h-4.5 text-[#5F7D65]" />
          <h3 className="text-[#1F2937]">메모</h3>
        </div>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="관리자 메모를 입력하세요..."
          className="w-full h-24 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[0.8rem] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20 resize-none"
        />
        <div className="flex justify-end mt-2">
          <button className="px-4 py-1.5 bg-[#5F7D65] text-white rounded-lg text-[0.8rem] hover:bg-[#4F6D55] transition-colors">
            메모 저장
          </button>
        </div>
      </div>

      {/* Refund modal */}
      {showRefund && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-[#1F2937] mb-5">
              {refundType === 'full' ? '전체 취소 / 환불' : '부분 환불'}
            </h2>

            {/* Cancellation policy */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <p className="text-[0.8rem] text-gray-500 mb-2">취소 규정 자동 계산</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[0.8rem]">
                  <span className="text-gray-600">이용일까지</span>
                  <span className="text-[#1F2937]">{diffDays > 0 ? `${diffDays}일 남음` : '당일'}</span>
                </div>
                <div className="flex items-center justify-between text-[0.8rem]">
                  <span className="text-gray-600">적용 규정</span>
                  <span className="text-[#1F2937]">{refundPolicyLabel}</span>
                </div>
                <div className="flex items-center justify-between text-[0.8rem]">
                  <span className="text-gray-600">환불률</span>
                  <span className={`${refundRate === 0 ? 'text-red-500' : 'text-[#5F7D65]'}`}>{refundRate}%</span>
                </div>
              </div>
            </div>

            {refundType === 'full' ? (
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-[0.85rem]">
                  <span className="text-gray-600">결제금액</span>
                  <span className="text-[#1F2937]">{totalAmount.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-[0.85rem]">
                  <span className="text-gray-600">환불 예정 금액</span>
                  <span className="text-[#5F7D65] text-[1rem]">{calculatedRefund.toLocaleString()}원</span>
                </div>
                {refundRate < 100 && (
                  <div className="flex justify-between text-[0.85rem]">
                    <span className="text-gray-600">위약금</span>
                    <span className="text-red-500">{(totalAmount - calculatedRefund).toLocaleString()}원</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-[0.85rem]">
                  <span className="text-gray-600">결제금액</span>
                  <span className="text-[#1F2937]">{totalAmount.toLocaleString()}원</span>
                </div>
                <div>
                  <label className="text-[0.8rem] text-gray-500 block mb-1.5">환불 금액 입력</label>
                  <input
                    type="number"
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(e.target.value)}
                    placeholder="환불할 금액을 입력하세요"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[0.85rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20"
                  />
                </div>
                {partialAmount && (
                  <div className="flex justify-between text-[0.85rem]">
                    <span className="text-gray-600">환불 후 잔액</span>
                    <span className="text-[#1F2937]">{(totalAmount - Number(partialAmount)).toLocaleString()}원</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRefund(false)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-[0.85rem] text-gray-600 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setShowRefund(false);
                  if (refundType === 'full') {
                    handleStatusChange('환불완료');
                    setCurrentPaymentStatus('환불완료');
                  } else {
                    setCurrentPaymentStatus('부분환불');
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-[0.85rem] hover:bg-red-600 transition-colors"
              >
                {refundType === 'full' ? '전체 환불 처리' : '부분 환불 처리'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, valueColor = 'text-[#1F2937]' }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[0.8rem] text-gray-500">{label}</span>
      <span className={`text-[0.85rem] ${valueColor}`}>{value}</span>
    </div>
  );
}
