import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { mockReservations } from './mockData';
import type { Reservation, ReservationType, ReservationStatus } from './mockData';
import { SummaryCards } from './SummaryCards';
import { TabComponent } from './TabComponent';
import { FilterBar } from './FilterBar';
import type { FilterState } from './FilterBar';
import { ReservationTable } from './ReservationTable';
import { ReservationDetail } from './ReservationDetail';
import { DoubleBookingTab } from './DoubleBookingTab';
import { toast } from 'sonner';
import { getAllConflicts } from './doubleBookingData';
import { mockAccommodationBookings, mockHolds } from './doubleBookingData';

export function ReservationManagement() {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    dateFrom: '',
    dateTo: '',
    people: '',
    paymentMethod: '',
    search: '',
  });
  const [selectedDetail, setSelectedDetail] = useState<Reservation | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const tabCounts = useMemo(() => {
    const all = reservations.length;
    const experience = reservations.filter((r) => r.type === '체험').length;
    const accommodation = reservations.filter((r) => r.type === '숙소').length;
    const meal = reservations.filter((r) => r.type === '식사').length;
    const conflicts = getAllConflicts(mockAccommodationBookings, mockHolds).length;
    return { all, experience, accommodation, meal, conflicts };
  }, [reservations]);

  const tabs = [
    { id: 'all', label: '전체 예약', count: tabCounts.all },
    { id: 'experience', label: '체험 예약', count: tabCounts.experience },
    { id: 'accommodation', label: '숙소 예약', count: tabCounts.accommodation },
    { id: 'meal', label: '식사 예약', count: tabCounts.meal },
    { id: 'double-booking', label: '더블부킹(숙소)', count: tabCounts.conflicts, isWarning: true },
  ];

  const typeMap: Record<string, ReservationType | undefined> = {
    all: undefined,
    experience: '체험',
    accommodation: '숙소',
    meal: '식사',
  };

  const filteredData = useMemo(() => {
    let data = [...reservations];

    // Tab filter
    const typeFilter = typeMap[activeTab];
    if (typeFilter) {
      data = data.filter((r) => r.type === typeFilter);
    }

    // Status filter
    if (filters.status) {
      data = data.filter((r) => r.reservationStatus === filters.status);
    }

    // Date range
    if (filters.dateFrom) {
      data = data.filter((r) => r.useDate >= filters.dateFrom);
    }
    if (filters.dateTo) {
      data = data.filter((r) => r.useDate <= filters.dateTo);
    }

    // People filter
    if (filters.people) {
      data = data.filter((r) => {
        switch (filters.people) {
          case '1명': return r.people === 1;
          case '2명': return r.people === 2;
          case '3~4명': return r.people >= 3 && r.people <= 4;
          case '5~8명': return r.people >= 5 && r.people <= 8;
          case '9명 이상': return r.people >= 9;
          default: return true;
        }
      });
    }

    // Payment method
    if (filters.paymentMethod) {
      data = data.filter((r) => r.paymentMethod === filters.paymentMethod);
    }

    // Search
    if (filters.search) {
      const search = filters.search.toLowerCase();
      data = data.filter(
        (r) =>
          r.id.toLowerCase().includes(search) ||
          r.customerName.toLowerCase().includes(search) ||
          r.phone.includes(search)
      );
    }

    return data;
  }, [reservations, activeTab, filters]);

  const handleStatusChange = (id: string, status: ReservationStatus) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reservationStatus: status } : r))
    );
    toast.success(`예약 상태가 '${status}'(으)로 변경되었습니다.`);
  };

  const handleExcelDownload = () => {
    toast.success('엑셀 파일 다운로드가 시작됩니다.');
  };

  const handleNewReservation = () => {
    toast.info('신규 예약 등록 화면으로 이동합니다.');
  };

  if (selectedDetail) {
    return (
      <ReservationDetail
        reservation={selectedDetail}
        onBack={() => setSelectedDetail(null)}
        onStatusChange={handleStatusChange}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#1F2937]">예약 관리</h1>
        <p className="text-[0.85rem] text-gray-500 mt-1">체험, 숙소, 식사 예약을 통합 관리합니다.</p>
      </div>

      {/* Summary cards */}
      <SummaryCards />

      {/* Tabs + Content */}
      <div className="bg-white rounded-xl border border-gray-200">
        <TabComponent tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'double-booking' ? (
          <div className="p-5">
            <DoubleBookingTab />
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <FilterBar
              onFilterChange={setFilters}
              onExcelDownload={handleExcelDownload}
              onNewReservation={handleNewReservation}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ReservationTable
                  data={filteredData}
                  onViewDetail={setSelectedDetail}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
