import React from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const Reports = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Báo cáo</h2>
          <Button variant="outline">Xuất Excel</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Phân bổ vốn">
            <div className="h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
              [Chart Placeholder]
            </div>
          </Card>
          <Card title="Vốn nạp vs NAV">
            <div className="h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
              [Chart Placeholder]
            </div>
          </Card>
        </div>
        <Card title="Chi tiết P/L theo danh mục">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Danh mục</th>
                <th className="text-right py-2">Vốn nạp</th>
                <th className="text-right py-2">NAV</th>
                <th className="text-right py-2">P/L</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">DCDS</td>
                <td className="text-right">0</td>
                <td className="text-right">0</td>
                <td className="text-right">0</td>
              </tr>
              {/* Thêm các dòng khác */}
            </tbody>
          </table>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;