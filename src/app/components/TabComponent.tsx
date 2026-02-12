import { motion } from 'motion/react';

interface Tab {
  id: string;
  label: string;
  count?: number;
  isWarning?: boolean;
}

interface TabComponentProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function TabComponent({ tabs, activeTab, onTabChange }: TabComponentProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex gap-0 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isWarning = tab.isWarning && (tab.count ?? 0) > 0;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-5 py-3 text-[0.875rem] whitespace-nowrap transition-colors ${
                isActive
                  ? isWarning ? 'text-[#C66A6A]' : 'text-[#5F7D65]'
                  : isWarning ? 'text-[#C66A6A]/70 hover:text-[#C66A6A]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[0.7rem] ${
                      isWarning
                        ? isActive ? 'bg-red-100 text-red-600' : 'bg-red-50 text-red-400'
                        : isActive ? 'bg-[#5F7D65]/10 text-[#5F7D65]' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${isWarning ? 'bg-[#C66A6A]' : 'bg-[#5F7D65]'}`}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}