import { useState } from 'react';
import { ChevronUp, ChevronDown, MoreHorizontal, Eye, Edit, Ban } from 'lucide-react';
import type { Reservation } from './mockData';
import { ReservationStatusTag, PaymentStatusTag, TypeTag } from './StatusTag';

interface ReservationTableProps {
  data: Reservation[];
  onViewDetail: (reservation: Reservation) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

type SortKey = 'reservationDate' | 'useDate' | 'amount' | 'people' | 'reservationStatus';
type SortDir = 'asc' | 'desc';

export function ReservationTable({ data, onViewDetail, selectedIds, onSelectionChange }: ReservationTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('reservationDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    if (sortKey === 'amount' || sortKey === 'people') {
      return (a[sortKey] - b[sortKey]) * dir;
    }
    return a[sortKey].localeCompare(b[sortKey]) * dir;
  });

  const allSelected = data.length > 0 && selectedIds.length === data.length;

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map((r) => r.id));
    }
  };

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((sid) => sid !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ChevronUp className="w-3 h-3 text-gray-300" />;
    return sortDir === 'asc' ? (
      <ChevronUp className="w-3 h-3 text-[#5F7D65]" />
    ) : (
      <ChevronDown className="w-3 h-3 text-[#5F7D65]" />
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Batch actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-[#5F7D65]/5 border-b border-gray-200">
          <span className="text-[0.8rem] text-[#5F7D65]">{selectedIds.length}건 선택됨</span>
          <button className="px-3 py-1 bg-[#5F7D65] text-white rounded text-[0.75rem] hover:bg-[#4F6D55] transition-colors">
            일괄 확정
          </button>
          <button className="px-3 py-1 bg-white border border-gray-300 text-gray-600 rounded text-[0.75rem] hover:bg-gray-50 transition-colors">
            일괄 취소
          </button>
          <button className="px-3 py-1 bg-white border border-gray-300 text-gray-600 rounded text-[0.75rem] hover:bg-gray-50 transition-colors">
            문자 발송
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-gray-300 text-[#5F7D65] focus:ring-[#5F7D65] cursor-pointer accent-[#5F7D65]"
                />
              </th>
              <th className="px-3 py-3 text-left text-[0.75rem] text-gray-500 whitespace-nowrap">예약번호</th>
              <th className="px-3 py-3 text-left text-[0.75rem] text-gray-500 whitespace-nowrap">유형</th>
              <th className="px-3 py-3 text-left text-[0.75rem] text-gray-500 whitespace-nowrap">프로그램명</th>
              <th className="px-3 py-3 text-left text-[0.75rem] text-gray-500 whitespace-nowrap">고객명</th>
              <th className="px-3 py-3 text-left text-[0.75rem] text-gray-500 whitespace-nowrap">연락처</th>
              <th
                className="px-3 py-3 text-left text-[0.75rem] text-gray-500 whitespace-nowrap cursor-pointer select-none"
                onClick={() => handleSort('reservationDate')}
              >
                <span className="inline-flex items-center gap-1">
                  예약일 <SortIcon column="reservationDate" />
                </span>
              </th>
              <th
                className="px-3 py-3 text-left text-[0.75rem] text-gray-500 whitespace-nowrap cursor-pointer select-none"
                onClick={() => handleSort('useDate')}
              >
                <span className="inline-flex items-center gap-1">
                  이용일 <SortIcon column="useDate" />
                </span>
              </th>
              <th
                className="px-3 py-3 text-center text-[0.75rem] text-gray-500 whitespace-nowrap cursor-pointer select-none"
                onClick={() => handleSort('people')}
              >
                <span className="inline-flex items-center gap-1">
                  인원 <SortIcon column="people" />
                </span>
              </th>
              <th
                className="px-3 py-3 text-right text-[0.75rem] text-gray-500 whitespace-nowrap cursor-pointer select-none"
                onClick={() => handleSort('amount')}
              >
                <span className="inline-flex items-center gap-1">
                  결제금액 <SortIcon column="amount" />
                </span>
              </th>
              <th className="px-3 py-3 text-center text-[0.75rem] text-gray-500 whitespace-nowrap">결제상태</th>
              <th
                className="px-3 py-3 text-center text-[0.75rem] text-gray-500 whitespace-nowrap cursor-pointer select-none"
                onClick={() => handleSort('reservationStatus')}
              >
                <span className="inline-flex items-center gap-1">
                  예약상태 <SortIcon column="reservationStatus" />
                </span>
              </th>
              <th className="w-12 px-3 py-3 text-center text-[0.75rem] text-gray-500">관리</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((reservation) => (
              <tr
                key={reservation.id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                onClick={() => onViewDetail(reservation)}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(reservation.id)}
                    onChange={() => toggleOne(reservation.id)}
                    className="w-4 h-4 rounded border-gray-300 text-[#5F7D65] focus:ring-[#5F7D65] cursor-pointer accent-[#5F7D65]"
                  />
                </td>
                <td className="px-3 py-3 text-[0.8rem] text-[#1F2937] whitespace-nowrap">{reservation.id}</td>
                <td className="px-3 py-3">
                  <TypeTag type={reservation.type} />
                </td>
                <td className="px-3 py-3 text-[0.8rem] text-[#1F2937] max-w-[180px] truncate">
                  {reservation.programName}
                </td>
                <td className="px-3 py-3 text-[0.8rem] text-[#1F2937] whitespace-nowrap">{reservation.customerName}</td>
                <td className="px-3 py-3 text-[0.8rem] text-gray-500 whitespace-nowrap">{reservation.phone}</td>
                <td className="px-3 py-3 text-[0.8rem] text-gray-500 whitespace-nowrap">{reservation.reservationDate}</td>
                <td className="px-3 py-3 text-[0.8rem] text-[#1F2937] whitespace-nowrap">{reservation.useDate}</td>
                <td className="px-3 py-3 text-[0.8rem] text-center text-[#1F2937]">{reservation.people}명</td>
                <td className="px-3 py-3 text-[0.8rem] text-right text-[#1F2937] whitespace-nowrap">
                  {reservation.amount.toLocaleString()}원
                </td>
                <td className="px-3 py-3 text-center">
                  <PaymentStatusTag status={reservation.paymentStatus} />
                </td>
                <td className="px-3 py-3 text-center">
                  <ReservationStatusTag status={reservation.reservationStatus} />
                </td>
                <td className="px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="relative">
                    <button
                      onClick={() => setActionMenuId(actionMenuId === reservation.id ? null : reservation.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                    {actionMenuId === reservation.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActionMenuId(null)} />
                        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 min-w-[120px]">
                          <button
                            onClick={() => {
                              onViewDetail(reservation);
                              setActionMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-[0.8rem] text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="w-3.5 h-3.5" /> 상세보기
                          </button>
                          <button
                            onClick={() => setActionMenuId(null)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-[0.8rem] text-gray-700 hover:bg-gray-50"
                          >
                            <Edit className="w-3.5 h-3.5" /> 수정
                          </button>
                          <button
                            onClick={() => setActionMenuId(null)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-[0.8rem] text-red-500 hover:bg-red-50"
                          >
                            <Ban className="w-3.5 h-3.5" /> 취소
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedData.length === 0 && (
        <div className="flex items-center justify-center py-16 text-gray-400 text-[0.875rem]">
          검색 결과가 없습니다.
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <span className="text-[0.8rem] text-gray-500">총 {data.length}건</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`w-8 h-8 rounded-lg text-[0.8rem] transition-colors ${
                page === 1 ? 'bg-[#5F7D65] text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
