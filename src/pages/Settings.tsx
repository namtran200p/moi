import React from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const Settings = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">Cài đặt</h2>
        <Card title="Phí & Thuế">
          <div className="space-y-4">
            <Input label="Phí mua (%)" type="number" defaultValue="0" step="0.01" />
            <Input label="Phí bán (%)" type="number" defaultValue="0" step="0.01" />
            <Input label="Thuế bán (%)" type="number" defaultValue="0" step="0.01" />
            <Button>Lưu thay đổi</Button>
          </div>
        </Card>
        <Card title="Workspace">
          <p className="text-gray-600 dark:text-gray-400">Workspace ID: abc-123</p>
          <p className="text-gray-600 dark:text-gray-400">Tất cả thành viên có quyền bình đẳng.</p>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;