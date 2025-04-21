import React from 'react';
import Header from '@/components/Header';

const AdminUsersPage = () => {
  return (
    <div>
      <Header />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
        <p className="text-gray-700">This is the admin users page.</p>
      </div>
    </div>
  );
};

export default AdminUsersPage;
