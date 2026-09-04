import React from 'react';
import Card from '@/components/ui/Card';

interface CapitalCardProps {
  total: number;
  currency: 'VND' | 'USD';
}

const CapitalCard: React.FC<CapitalCardProps> = ({ total, currency }) => {
  const formatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(total);

  return (
    <Card>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Tổng vốn gốc</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">{formatted}</p>
      </div>
    </Card>
  );
};

export default CapitalCard;