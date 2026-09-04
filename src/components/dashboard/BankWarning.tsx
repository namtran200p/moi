import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { AlertTriangle } from 'lucide-react';

interface BankDeposit {
  id: string;
  bankName: string;
  principalVnd: number;
  maturityDate: string;
  daysLeft: number;
}

interface BankWarningProps {
  deposits: BankDeposit[];
}

const BankWarning: React.FC<BankWarningProps> = ({ deposits }) => {
  if (deposits.length === 0) return null;

  return (
    <Card title="Cảnh báo đáo hạn ngân hàng" className="mb-4">
      <div className="space-y-3">
        {deposits.map((dep) => (
          <div key={dep.id} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
            <div>
              <span className="font-medium">{dep.bankName}</span>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {dep.principalVnd.toLocaleString()} VND
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {dep.daysLeft <= 1 ? 'Hôm nay' : `${dep.daysLeft} ngày`}
              </span>
              {dep.daysLeft <= 5 && <AlertTriangle size={16} className="text-yellow-500" />}
              <Badge variant={dep.daysLeft <= 1 ? 'danger' : 'warning'}>
                Đáo hạn {new Date(dep.maturityDate).toLocaleDateString('vi-VN')}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BankWarning;