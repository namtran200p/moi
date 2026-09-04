export interface ITransaction {
  id: string;
  workspace_id: string;
  type: string; // BUY, SELL, DEPOSIT, WITHDRAWAL, CASH_DIVIDEND, STOCK_DIVIDEND, BANK_DEPOSIT, BANK_CLOSE
  asset_category: string;
  asset_code: string;
  account?: string | null; // VPS, SSI, or null
  transaction_date: string;
  quantity: number;
  price: number;
  amount: number; // used for DEPOSIT/WITHDRAWAL or Bank deposits
  fee: number;
  tax: number;
  locked_vnd_rate?: number | null;
  is_trade_tplus: boolean;
  tplus_lot_id?: string | null;
  dividend_quantity?: number | null;
  actual_received_interest?: number | null;
  note?: string | null;
}

export interface IHolding {
  asset_code: string;
  account?: string | null;
  quantity: number;
  avg_cost: number;
  ticker_capital: number; // Original Capital per ticker
}

export interface ITPlusLot {
  id: string;
  asset_code: string;
  account?: string | null;
  buy_quantity: number;
  buy_price: number;
  remaining_quantity: number;
  status: 'OPEN' | 'PARTIAL_COMPLETED' | 'COMPLETED';
}

export interface IBankDeposit {
  id: string;
  bank_name: string;
  principal_vnd: number;
  interest_rate_percent: number;
  term_months: number;
  start_date: string;
  maturity_date: string;
  auto_rollover: boolean;
  is_active: boolean;
  renewal_count: number;
}

export interface ReplayResult {
  total_original_capital: number;
  total_nav: number;
  total_pl: number;
  category_summary: Record<string, { capital: number; nav: number; pl: number }>;
  ticker_holdings: IHolding[];
  active_tplus_cards: ITPlusLot[];
  bank_warnings: IBankDeposit[];
}