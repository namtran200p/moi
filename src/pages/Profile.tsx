import React from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Card title="Thông tin cá nhân">
          <div className="space-y-3">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>User ID:</strong> {user?.id}</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;