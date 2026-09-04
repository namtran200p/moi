import { ITransaction, IHolding, ITPlusLot, IBankDeposit, ReplayResult } from './types';

// Helper: tạo key cho holding (asset_code + account)
function holdingKey(asset: string, account?: string | null): string {
  return account ? `${asset}-${account}` : asset;
}

export function runReplayEngine(
  transactions: ITransaction[],
  tplusLots: ITPlusLot[],
  bankDeposits: IBankDeposit[]
): ReplayResult {
  // Khởi tạo các biến trạng thái
  const holdings: Record<string, IHolding> = {};
  const categoryCapital: Record<string, number> = {};
  const categoryNAV: Record<string, number> = {};
  
  // Sắp xếp theo thời gian
  const sorted = [...transactions].sort((a, b) => 
    new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()
  );

  // Duyệt từng giao dịch
  for (const tx of sorted) {
    const cat = tx.asset_category;
    // Đảm bảo category đã tồn tại
    if (!categoryCapital[cat]) categoryCapital[cat] = 0;
    if (!categoryNAV[cat]) categoryNAV[cat] = 0;

    const key = holdingKey(tx.asset_code, tx.account);

    if (tx.type === 'DEPOSIT') {
      // Nạp vốn vào danh mục
      categoryCapital[cat] += tx.amount;
      // Không ảnh hưởng holdings
    } else if (tx.type === 'WITHDRAWAL') {
      categoryCapital[cat] -= tx.amount;
    } else if (tx.type === 'BUY') {
      // Mua thường (hoặc T+)
      const cost = tx.quantity * tx.price + tx.fee + tx.tax;
      if (!holdings[key]) {
        holdings[key] = { asset_code: tx.asset_code, account: tx.account, quantity: 0, avg_cost: 0, ticker_capital: 0 };
      }
      const h = holdings[key];
      // Cập nhật average cost
      const totalCost = h.quantity * h.avg_cost + cost;
      h.quantity += tx.quantity;
      h.avg_cost = totalCost / h.quantity;
      h.ticker_capital += cost; // tăng vốn gốc của mã
      // Nếu là T+ BUY, cần tạo lot (xử lý riêng)
    } else if (tx.type === 'SELL') {
      // Bán thường (không phải T+)
      if (!holdings[key]) continue;
      const h = holdings[key];
      const avgCost = h.avg_cost;
      const realizedPnL = (tx.price - avgCost) * tx.quantity - tx.fee - tx.tax;
      // Giảm quantity và giảm vốn gốc theo avg cost
      h.quantity -= tx.quantity;
      h.ticker_capital -= avgCost * tx.quantity;
      // Ghi nhận realized P/L (có thể lưu vào biến khác)
    } else if (tx.type === 'STOCK_DIVIDEND') {
      // Cổ tức cổ phiếu: tăng quantity, điều chỉnh avg cost
      if (!holdings[key]) continue;
      const h = holdings[key];
      const divQty = tx.dividend_quantity || 0;
      if (divQty > 0) {
        // Dilute avg cost: tổng giá trị không đổi, số lượng tăng
        const totalValue = h.quantity * h.avg_cost;
        h.quantity += divQty;
        h.avg_cost = totalValue / h.quantity;
      }
    } else if (tx.type === 'BANK_DEPOSIT') {
      // Tạo sổ ngân hàng (xử lý riêng)
    } // ... còn BANK_CLOSE, CASH_DIVIDEND, v.v.
  }

  // Tính NAV: cần giá thị trường hiện tại (lấy từ bảng market_prices)
  // Tạm thời bỏ qua

  // Xử lý T+ lots (active)
  const activeCards = tplusLots.filter(lot => lot.status === 'OPEN' || lot.status === 'PARTIAL_COMPLETED');

  // Cảnh báo ngân hàng: sắp đáo hạn
  const now = new Date();
  const warnings = bankDeposits.filter(dep => {
    const maturity = new Date(dep.maturity_date);
    const diffDays = (maturity.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diffDays <= 5 && diffDays >= 0 && dep.is_active;
  });

  // Tổng hợp
  const totalCapital = Object.values(categoryCapital).reduce((a, b) => a + b, 0);
  const totalNav = Object.values(categoryNAV).reduce((a, b) => a + b, 0);
  const totalPl = totalNav - totalCapital;

  return {
    total_original_capital: totalCapital,
    total_nav: totalNav,
    total_pl: totalPl,
    category_summary: Object.keys(categoryCapital).reduce((acc, cat) => {
      acc[cat] = { capital: categoryCapital[cat], nav: categoryNAV[cat] || 0, pl: (categoryNAV[cat] || 0) - categoryCapital[cat] };
      return acc;
    }, {} as Record<string, any>),
    ticker_holdings: Object.values(holdings),
    active_tplus_cards: activeCards,
    bank_warnings: warnings,
  };
}