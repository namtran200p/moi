import { formatBrokerPrice, formatUsd, formatVnd } from "@/engine/money";
import type { DisplayCurrency } from "./ui-store";

export function displayMoney(vnd: number, currency: DisplayCurrency, usdVnd: number): string {
  if (currency === "USD") return formatUsd(usdVnd > 0 ? vnd / usdVnd : 0);
  return formatVnd(vnd);
}

export function displayPrice(
  stored: number,
  assetType: string,
  currency: DisplayCurrency,
  usdVnd: number,
): string {
  if (assetType === "CRYPTO") {
    if (currency === "VND") return formatVnd(stored * usdVnd);
    return formatUsd(stored, stored < 1 ? 6 : 2);
  }
  if (currency === "USD") return formatUsd(usdVnd > 0 ? stored / usdVnd : 0);
  if (assetType === "DCDS") return formatVnd(stored);
  return formatBrokerPrice(stored);
}

export function priceHint(assetType: string): string {
  if (assetType === "CRYPTO") return "USD";
  if (assetType === "DCDS") return "VND / CCQ";
  return "13.5 = 13.500 ₫";
}

// ========== CÁC HÀM HỖ TRỢ ĐỊNH DẠNG ==========
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value);
}

export function formatCurrency(value: number, currency: string = 'VND'): string {
  if (currency === 'VND') return `${formatNumber(value)} VND`;
  return `${formatNumber(value)} USD`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('vi-VN');
}