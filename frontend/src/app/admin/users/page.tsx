"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { AuthService } from '@/api/services/AuthService';
import { UserProfile } from '@/api/models/UserProfile';
import { AuthRequestByCode } from '@/api/models/AuthRequestByCode';
import RequestCodeDialog from '@/components/RequestCodeDialog';

const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [requestCode, setRequestCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await AuthService.getUsersList();
        if (userList) {
          setUsers(userList.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = () => {
    // TODO: Implement create user functionality
    alert('Create user functionality not yet implemented.');
  };

  const handleRequestCode = async (username: string) => {
    try {
      const requestBody = { username };
      const authRequestByCode: AuthRequestByCode = await AuthService.getUserLoginCode({ requestBody });
      setRequestCode(authRequestByCode.code || '');
      setExpiresAt(authRequestByCode.expires_at ? parseInt(authRequestByCode.expires_at) : 0);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error requesting code:', error);
      alert(`Error requesting code: ${error}`);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setRequestCode(null);
    setExpiresAt(null);
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
        <div className="mb-4">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleCreateUser}
          >
            Create User
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">User ID</th>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-100">
                  <td className="px-4 py-2">{user.user_id}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleRequestCode(user.username || '')}
                      disabled={user.role === 'admin'}
                    >
                      Request Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isDialogOpen && requestCode && expiresAt && (
          <RequestCodeDialog code={requestCode} expires_at={expiresAt} onClose={handleCloseDialog} />
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
