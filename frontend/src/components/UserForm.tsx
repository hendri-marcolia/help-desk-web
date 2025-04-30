"use client";

import React, { useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog';

import type { UserProfile } from '@/api/models/UserProfile';

interface UserFormProps {
  onSubmit: (data: UserProfile) => void;
  onCancel: () => void;
  initialValues?: UserProfile;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, onCancel, initialValues }) => {
  const [username, setUsername] = useState(initialValues?.username || '');
  const [name, setName] = useState(initialValues?.name || '');
  const [role, setRole] = useState(initialValues?.role || '');
  const [password, setPassword] = useState('');

  React.useEffect(() => {
    setUsername(initialValues?.username || '');
    setName(initialValues?.name || '');
    setRole(initialValues?.role || '');
    setPassword('');
  }, [initialValues]);

  const roles = ['admin', 'user'];
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const isUpdate = !!initialValues;
  const formTitle = isUpdate ? 'Update User' : 'Create New User';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmationOpen(true);
  };

  const handleConfirm = () => {
    onSubmit({ username, name, password, role } as UserProfile);
    setIsConfirmationOpen(false);
  };

  const handleCancelConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 space-y-6 border-t-4 border-sky-500">
      <h2 className="text-lg font-semibold text-gray-800">{formTitle}</h2>

      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        title={formTitle}
        message={`Are you sure you want to ${isUpdate ? 'update' : 'create'} this user?`}
        onConfirm={handleConfirm}
        onCancel={handleCancelConfirmation}
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isUpdate} // Disable if updating
            required
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <select
            id="role"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!isUpdate}
          />
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="rounded-full px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition">
            Cancel
          </button>
          <button type="submit" className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition">
            {isUpdate ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
