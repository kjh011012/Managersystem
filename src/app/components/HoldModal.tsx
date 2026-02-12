import { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { rooms, type Hold } from './doubleBookingData';

interface HoldModalProps {
  onClose: () => void;
  onSubmit: (hold: Hold) => void;
  preselectedRoomId?: string;
  preselectedDate?: string;
  existingHolds: Hold[];
}

export function HoldModal({ onClose, onSubmit, preselectedRoomId, preselectedDate, existingHolds }: HoldModalProps) {
  const [roomId, setRoomId] = useState(preselectedRoomId || '');
  const [startDate, setStartDate] = useState(preselectedDate || '');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState<'점검' | '수리' | '행사' | '사정'>('점검');
  const [memo, setMemo] = useState('');

  const room = rooms.find(r => r.id === roomId);
  const isValid = roomId && startDate && endDate && startDate < endDate;

  const handleSubmit = () => {
    if (!isValid) return;
    const newHold: Hold = {
      id: `HOLD-${String(existingHolds.length + 1).padStart(3, '0')}`,
      roomId,
      roomName: room?.name || '',
      startDate,
      endDate,
      reason,
      memo,
      createdAt: '2026-02-12',
      createdBy: '관리자',
    };
    onSubmit(newHold);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Lock className="w-4.5 h-4.5 text-gray-500" />
            <h2 className="text-[#1F2937]">홀드(임시차단) 생성</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="text-[0.8rem] text-gray-500 block mb-1.5">객실 선택</label>
            <select
              value={roomId}
              onChange={e => setRoomId(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[0.85rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20"
            >
              <option value="">객실을 선택하세요</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[0.8rem] text-gray-500 block mb-1.5">시작일</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[0.85rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20"
              />
            </div>
            <div>
              <label className="text-[0.8rem] text-gray-500 block mb-1.5">종료일</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[0.85rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20"
              />
            </div>
          </div>

          <div>
            <label className="text-[0.8rem] text-gray-500 block mb-1.5">홀드 사유</label>
            <div className="grid grid-cols-4 gap-2">
              {(['점검', '수리', '행사', '사정'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`py-2 rounded-lg text-[0.8rem] border transition-colors ${
                    reason === r
                      ? 'bg-[#5F7D65]/10 border-[#5F7D65] text-[#5F7D65]'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[0.8rem] text-gray-500 block mb-1.5">메모</label>
            <textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="홀드 사유를 상세히 입력하세요..."
              className="w-full h-20 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[0.85rem] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5F7D65]/20 resize-none placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-[0.85rem] text-gray-600 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`px-5 py-2.5 rounded-xl text-[0.85rem] transition-colors ${
              isValid
                ? 'bg-gray-600 text-white hover:bg-gray-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            홀드 생성
          </button>
        </div>
      </div>
    </div>
  );
}
