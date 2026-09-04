import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Kpi } from "@/components/Kpi";
import { AllocChart } from "@/components/AllocChart";
import { HoldingsTable } from "@/components/HoldingsTable";
import { TplusOpenCard } from "@/components/TplusOpenCard";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  // Dữ liệu mẫu (sau sẽ thay bằng API)
  const [kpiData] = useState({
    totalCapital: 1000000000,
    totalNAV: 1200000000,
    totalPL: 200000000,
  });

  const [allocData] = useState([
    { key: "STOCK", label: "Cổ phiếu", value: 600000000, pct: 50 },
    { key: "CRYPTO", label: "Tiền mã hóa", value: 400000000, pct: 33.3 },
    { key: "BANK", label: "Ngân hàng", value: 200000000, pct: 16.7 },
  ]);

  const [holdings] = useState([
    { symbol: "VCI", accountName: "VPS", quantity: 1000, avgCost: 30000, currentPrice: 35000, marketValue: 35000000, unrealizedPnl: 5000000, openTplusQty: 200 },
    { symbol: "HPG", accountName: "SSI", quantity: 500, avgCost: 28000, currentPrice: 30000, marketValue: 15000000, unrealizedPnl: 1000000 },
    { symbol: "BTC", quantity: 0.5, avgCost: 600000000, currentPrice: 700000000, marketValue: 350000000, unrealizedPnl: 50000000 },
  ]);

  const [tplusCard] = useState({
    code: "VCI",
    accountName: "VPS",
    openTplusQty: 200,
    coreQty: 1000,
    tradePrice: 32000,
    adjustedAvgCost: 30000,
    originalAvgCost: 30000,
    suggestedSell: 32960,
    breakEvenPrice: 31500,
    remainingUnrealized: 500000,
    openLots: [
      { buyTxId: "1", buyDate: "2026-09-01", qtyRemaining: 200, buyPrice: 32000 },
    ],
  });

  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
          {user && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({user.email})
            </span>
          )}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Kpi label="Tổng vốn gốc" value={kpiData.totalCapital.toLocaleString("vi-VN") + " VND"} />
          <Kpi label="NAV" value={kpiData.totalNAV.toLocaleString("vi-VN") + " VND"} tone="profit" />
          <Kpi label="P/L" value={kpiData.totalPL.toLocaleString("vi-VN") + " VND"} tone={kpiData.totalPL >= 0 ? "profit" : "loss"} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AllocChart data={allocData} />
          <HoldingsTable rows={holdings} />
        </div>

        <TplusOpenCard card={tplusCard} />
      </div>
    </Layout>
  );
};

export default Dashboard;