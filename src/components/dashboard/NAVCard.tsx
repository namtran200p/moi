import React from 'react';
import Card from '@/components/ui/Card';

interface NAVCardProps {
  total: number;
  currency: 'VND' | 'USD';
  change?: number;
}

const NAVCard: React.FC<NAVCardProps> = ({ total, currency, change }) => {
  const formatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(total);

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Tổng NAV</p>
          <p className="text-2xl font-bold text-navy-700 dark:text-navy-300">{formatted}</p>
        </div>
        {change !== undefined && (
          <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
          </span>
        )}
      </div>
    </Card>
  );
};

export default NAVCard;