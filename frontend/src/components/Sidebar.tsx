import React from 'react';
import Link from 'next/link';
import { FaUsers, FaCog } from 'react-icons/fa';

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-50 p-4 z-10 transition-transform duration-300 ${
        isCollapsed ? '-translate-x-full' : 'translate-x-0'
      } w-64 shadow-md`}
    >
      <h2 className="text-2xl font-semibold mb-4">Admin Panel</h2>
      <ul>
        <li className="mb-2">
          <Link
            href="/admin/users"
            className="flex items-center p-2 hover:bg-gray-100 rounded transition-colors duration-200"
          >
            <FaUsers className="mr-2" />
            Manage Users
          </Link>
        </li>
        <li className="mb-2">
          <Link
            href="/admin/settings"
            className="flex items-center p-2 hover:bg-gray-100 rounded transition-colors duration-200"
          >
            <FaCog className="mr-2" />
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
