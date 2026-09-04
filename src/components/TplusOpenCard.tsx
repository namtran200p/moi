import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatNumber } from "@/lib/display";

interface TplusLot {
  id: string;
  code: string;
  accountName?: string;
  openTplusQty: number;
  coreQty: number;
  tradePrice: number;
  adjustedAvgCost: number;
  originalAvgCost?: number;
  suggestedSell: number;
  breakEvenPrice: number;
  remainingUnrealized: number;
  openLots: { buyTxId: string; buyDate: string; qtyRemaining: number; buyPrice: number }[];
}

export function TplusOpenCard({
  card,
}: {
  card: TplusLot;
}) {
  const c = card;
  const costLabel =
    c.originalAvgCost && c.originalAvgCost !== c.adjustedAvgCost
      ? `${formatCurrency(c.adjustedAvgCost)} / ${formatCurrency(c.originalAvgCost)}`
      : formatCurrency(c.adjustedAvgCost);

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-lg font-semibold">
            {c.code} <span className="text-sm font-normal text-gray-500">{c.accountName || ""}</span>
          </p>
        </div>
        <Badge variant={c.remainingUnrealized >= 0 ? "success" : "danger"}>
          {c.remainingUnrealized >= 0 ? "Có lãi" : "Đang lỗ"}
        </Badge>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-xs text-gray-500">Số lượng Trade</dt>
          <dd className="font-mono tabular-nums">
            {formatNumber(c.openTplusQty)} / {formatNumber(c.coreQty)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">Giá Trade</dt>
          <dd className="font-mono tabular-nums">
            {formatCurrency(c.tradePrice)} / {formatCurrency(c.adjustedAvgCost)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">Giá vốn (mới / gốc)</dt>
          <dd className="font-mono tabular-nums">{costLabel}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">Giá bán đề xuất</dt>
          <dd className="font-mono tabular-nums">{formatCurrency(c.suggestedSell)}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">Hòa vốn</dt>
          <dd className="font-mono tabular-nums">{formatCurrency(c.breakEvenPrice)}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">Còn lỗ / lãi</dt>
          <dd className={`font-mono tabular-nums ${c.remainingUnrealized >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatCurrency(c.remainingUnrealized)}
          </dd>
        </div>
      </dl>
      <ul className="space-y-1 text-xs text-gray-500">
        {c.openLots.map((l) => (
          <li key={l.buyTxId}>
            OPEN {new Date(l.buyDate).toLocaleDateString("vi-VN")} · {formatNumber(l.qtyRemaining)} @ {formatCurrency(l.buyPrice)}
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Button className="flex-1">Buy</Button>
        <Button variant="outline" className="flex-1">Sell</Button>
      </div>
    </Card>
  );
}