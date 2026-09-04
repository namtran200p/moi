import React from 'react';
import Card from '@/components/ui/Card';

interface PLCardProps {
  pl: number;
  currency: 'VND' | 'USD';
}

const PLCard: React.FC<PLCardProps> = ({ pl, currency }) => {
  const formatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(pl);

  const isPositive = pl >= 0;

  return (
    <Card>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">P/L</p>
        <p className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {formatted}
        </p>
      </div>
    </Card>
  );
};

export default PLCard;