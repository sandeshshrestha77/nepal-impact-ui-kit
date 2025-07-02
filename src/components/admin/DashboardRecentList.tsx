import React from 'react';

interface DashboardRecentListProps {
  title: string;
  items: { id: string | number; primary: string; secondary?: string }[];
  itemType?: string;
}

const DashboardRecentList: React.FC<DashboardRecentListProps> = ({ title, items, itemType }) => (
  <div className="bg-white rounded-2xl shadow p-6">
    <div className="font-bold text-gray-700 mb-4">{title}</div>
    <ul className="divide-y" aria-label={itemType ? `Recent ${itemType}` : undefined}>
      {items.map(item => (
        <li key={item.id} className="py-3 flex flex-col">
          <span className="font-semibold text-primary/90">{item.primary}</span>
          {item.secondary && <span className="text-xs text-gray-500">{item.secondary}</span>}
        </li>
      ))}
    </ul>
  </div>
);

export default DashboardRecentList; 