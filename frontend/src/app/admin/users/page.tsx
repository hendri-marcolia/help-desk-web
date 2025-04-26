"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { AuthService } from '@/api/services/AuthService';
import { UserProfile } from '@/api/models/UserProfile';
import { AuthRequestByCode } from '@/api/models/AuthRequestByCode';
import RequestCodeDialog from '@/components/RequestCodeDialog';
import UserForm from '@/components/UserForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserPlus, FaEdit, FaQrcode } from 'react-icons/fa';

const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [requestCode, setRequestCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsUserFormOpen(true);
  };

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setIsUserFormOpen(true);
  };

  const handleCloseUserForm = () => {
    setIsUserFormOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (userData: UserProfile) => {
    try {
      await AuthService.createOrUpdateUser({ requestBody: userData });
      toast.success(`User ${selectedUser ? 'updated' : 'created'} successfully!`);
      handleCloseUserForm();
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Error creating/updating user:', error);
      toast.error(`Error creating/updating user: ${error}`);
    }
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
      toast.error(`Error requesting code: ${error}`);
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
      <main className="mx-auto max-w-6xl p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
        <div className="mb-4">
          <button
            className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition"
            onClick={handleCreateUser}
          >
            Create User <FaUserPlus className="inline-block ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto responsive">
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
                      className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleRequestCode(user.username || '')}
                      disabled={user.role === 'admin'}
                    >
                      Request Code <FaQrcode className="inline-block ml-1" />
                    </button>
                    <button
                      className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition ml-2"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit <FaEdit className="inline-block ml-1" />
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
        {isUserFormOpen && (
          <UserForm
            initialValues={selectedUser || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCloseUserForm}
          />
        )}
      </main>
    </div>
  );
};

export default AdminUsersPage;
