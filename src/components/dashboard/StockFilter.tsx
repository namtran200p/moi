import React from 'react';
import Button from '@/components/ui/Button';

interface StockFilterProps {
  activeFilter: 'All' | 'VPS' | 'SSI';
  onChange: (filter: 'All' | 'VPS' | 'SSI') => void;
}

const StockFilter: React.FC<StockFilterProps> = ({ activeFilter, onChange }) => {
  const filters: Array<{ value: 'All' | 'VPS' | 'SSI'; label: string }> = [
    { value: 'All', label: 'Tất cả' },
    { value: 'VPS', label: 'VPS' },
    { value: 'SSI', label: 'SSI' },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {filters.map((f) => (
        <Button
          key={f.value}
          variant={activeFilter === f.value ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onChange(f.value)}
        >
          {f.label}
        </Button>
      ))}
    </div>
  );
};

export default StockFilter;