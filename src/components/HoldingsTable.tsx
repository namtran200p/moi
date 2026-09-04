import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatNumber } from "@/lib/display";

interface HoldingRow {
  symbol: string;
  accountName?: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnl: number;
  openTplusQty?: number;
}

export function HoldingsTable({
  rows,
}: {
  rows: HoldingRow[];
}) {
  if (rows.length === 0) {
    return (
      <Card className="p-4">
        <p className="py-8 text-center text-sm text-gray-500">Chưa có vị thế. Ghi giao dịch Buy để mở sổ.</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase text-gray-500">
          <tr className="border-b">
            <th className="px-2 py-2 font-medium">Mã</th>
            <th className="px-2 py-2 font-medium">Account</th>
            <th className="px-2 py-2 font-medium text-right">SL</th>
            <th className="px-2 py-2 font-medium text-right">Giá vốn</th>
            <th className="px-2 py-2 font-medium text-right">Giá TT</th>
            <th className="px-2 py-2 font-medium text-right">NAV</th>
            <th className="px-2 py-2 font-medium text-right">P&L</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((h, i) => (
            <tr key={i} className="border-b last:border-0">
              <td className="px-2 py-2 font-semibold">
                {h.symbol}
                {h.openTplusQty && h.openTplusQty > 0 && (
                  <Badge variant="info" className="ml-1">T+ {formatNumber(h.openTplusQty)}</Badge>
                )}
              </td>
              <td className="px-2 py-2 text-gray-500">{h.accountName || "-"}</td>
              <td className="px-2 py-2 text-right font-mono tabular-nums">{formatNumber(h.quantity)}</td>
              <td className="px-2 py-2 text-right font-mono tabular-nums">{formatCurrency(h.avgCost)}</td>
              <td className="px-2 py-2 text-right font-mono tabular-nums">{formatCurrency(h.currentPrice)}</td>
              <td className="px-2 py-2 text-right font-mono tabular-nums">{formatCurrency(h.marketValue)}</td>
              <td className={`px-2 py-2 text-right font-mono tabular-nums ${h.unrealizedPnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(h.unrealizedPnl)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}