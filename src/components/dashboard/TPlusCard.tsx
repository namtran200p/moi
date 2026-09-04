import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface TPlusLot {
  id: string;
  assetCode: string;
  account?: string;
  buyQuantity: number;
  buyPrice: number;
  remainingQuantity: number;
  status: 'OPEN' | 'PARTIAL_COMPLETED' | 'COMPLETED';
  originalCost: number;
}

interface TPlusCardProps {
  lots: TPlusLot[];
  onBuy: (code: string) => void;
  onSell: (lotId: string) => void;
  onHistory: (code: string) => void;
}

const TPlusCard: React.FC<TPlusCardProps> = ({ lots, onBuy, onSell, onHistory }) => {
  if (lots.length === 0) return null;

  return (
    <Card title="Trade T+ Active" className="mb-4">
      <div className="space-y-4">
        {lots.map((lot) => (
          <div key={lot.id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">{lot.assetCode}</span>
                  {lot.account && <Badge variant="info">{lot.account}</Badge>}
                  <Badge variant={lot.status === 'OPEN' ? 'success' : 'warning'}>
                    {lot.status === 'OPEN' ? 'Mở' : 'Đã bán một phần'}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span>Mua: {lot.buyQuantity} @ {lot.buyPrice.toLocaleString()} VND</span>
                  <span className="ml-3">Còn: {lot.remainingQuantity}</span>
                  <span className="ml-3">Giá vốn gốc: {lot.originalCost.toLocaleString()} VND</span>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="primary" onClick={() => onBuy(lot.assetCode)}>Buy</Button>
                <Button size="sm" variant="outline" onClick={() => onSell(lot.id)}>Sell</Button>
                <Button size="sm" variant="secondary" onClick={() => onHistory(lot.assetCode)}>History</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TPlusCard;