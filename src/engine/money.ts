// ========== ĐỊNH DẠNG SỐ TIỀN ==========

export function formatVnd(value: number): string {
  if (!Number.isFinite(value)) return '0 ₫';
  const formatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
  return formatted;
}

export function formatUsd(value: number, decimals: number = 2): string {
  if (!Number.isFinite(value)) return '$0.00';
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
  return formatted;
}

export function formatBrokerPrice(value: number): string {
  // Giá chứng khoán Việt Nam: hiển thị theo nghìn đồng (13.5 = 13.500 VND)
  if (!Number.isFinite(value)) return '0';
  const inThousands = value / 1000;
  // Nếu là số nguyên, hiển thị không có phần thập phân
  if (Number.isInteger(inThousands)) {
    return inThousands.toFixed(0);
  }
  // Nếu có phần thập phân, hiển thị 1 hoặc 2 số lẻ tùy theo giá trị
  const decimalPlaces = inThousands < 1 ? 2 : 1;
  return inThousands.toFixed(decimalPlaces);
}

// ========== TIỆN ÍCH KHÁC ==========

export function formatPct(value: number): string {
  if (!Number.isFinite(value)) return '0%';
  return `${value.toFixed(2)}%`;
}

export function formatQty(value: number, assetType: string): string {
  if (!Number.isFinite(value)) return '0';
  if (assetType === 'CRYPTO') {
    return value < 1 ? value.toFixed(6) : value.toFixed(2);
  }
  if (assetType === 'DCDS') {
    return value.toFixed(4);
  }
  return value.toFixed(0); // Stock, ETF: số nguyên
}

export function signedClass(value: number): string {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-500';
}

export function parseBrokerPrice(input: string): number {
  // Chuyển chuỗi giá dạng "13.5" thành số VND (13.500)
  const num = parseFloat(input);
  if (isNaN(num)) return 0;
  return num * 1000;
}

export function parseDecimal(input: string): number {
  const num = parseFloat(input);
  return isNaN(num) ? 0 : num;
}