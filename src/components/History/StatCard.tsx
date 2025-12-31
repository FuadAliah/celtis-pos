import { BarChart3, DollarSign, Calendar, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: "chart" | "cash" | "calendar" | "trending";
}

export function StatCard({ title, value, icon }: StatCardProps) {
  const icons = {
    chart: BarChart3,
    cash: DollarSign,
    calendar: Calendar,
    trending: TrendingUp,
  };

  const IconComponent = icons[icon];

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-5'>
      <div className='flex items-center justify-between mb-3'>
        <p className='text-sm font-medium text-gray-600'>{title}</p>
        <IconComponent className='w-5 h-5 text-primary-500' />
      </div>
      <p className='text-3xl font-extrabold text-gray-900'>{value}</p>
    </div>
  );
}
