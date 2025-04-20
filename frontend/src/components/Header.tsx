import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    toast.info("Logging out...");
    window.location.href = '/login';
  };

  return (
    <div>
      <header className="flex items-center justify-between border-b bg-white px-8 py-4 shadow-sm">
        <Link href="/dashboard">
          <h1 className="flex items-center gap-2 text-2xl font-extrabold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent cursor-pointer">
            <span>💬</span> Facility&apos;s Help Desk
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <div className="relative ml-4">
            <button
              className="h-10 w-10 rounded-full bg-sky-200 flex items-center justify-center text-sky-700 font-bold hover:bg-sky-300 transition"
              id="user-menu"
              aria-labelledby="user-menu"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="material-icons">
                {username?.charAt(0).toUpperCase() || '-'}
              </span>
            </button>
            {isOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-30 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Hi, {username || 'Guest'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Role {localStorage.getItem('role') || 'No role assigned'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <ToastContainer />
    </div>
  );
}
