import React from 'react';

interface DashboardStatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  color?: string; // Tailwind bg color class
}

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({ icon, value, label, color = 'bg-gray-50' }) => (
  <div className={`flex items-center gap-4 p-5 rounded-2xl shadow bg-white ${color}`}>
    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-inner">
      {icon}
    </div>
    <div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-xs font-semibold text-gray-500 mt-1">{label}</div>
    </div>
  </div>
);

export default DashboardStatCard; 