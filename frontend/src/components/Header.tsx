import React from 'react';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';

export default function Header() {
  const handleLogout = () => {
    localStorage.removeItem('token');
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
          <button className="h-8 w-8 rounded-full bg-sky-200 flex items-center justify-center text-sky-700 font-bold hover:bg-sky-300 transition">
            U
          </button>
          <div className="relative ml-4">
            <button className="h-8 w-8 rounded-full bg-sky-200 flex items-center justify-center text-sky-700 font-bold hover:bg-sky-300 transition" id="user-menu" aria-labelledby="user-menu">
              {/* <span className="material-icons">account_circle</span> */}
            </button>
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
              <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition" role="menuitem">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <ToastContainer />
    </div>
  );
}
