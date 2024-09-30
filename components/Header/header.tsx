// components/Header.tsx
import React from 'react';
import Link from 'next/link';
import { FC } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';


interface HeaderProps {
  roleID: number | null;
  isLoggedIn: boolean;
}

const Header: FC<HeaderProps> = ({ roleID, isLoggedIn }) => {
  const renderMiddleButtons = () => {
    switch (roleID) {
      case 1:
        return (
          <>
            <Link href="/">Home</Link>
            <Link href="/admin/dashboard">Dashboard</Link>
            <Link href="/admin/manage-users">Manage Users</Link>
            <Link href="/admin/manage-projects">Manage Products</Link>
            <Link href="/admin/audit-logs">Audit Logs</Link>
            <Link href="/admin/system-settings">System Settings</Link>
          </>
        );
      case 2:
        return (
          <>
            <Link href="/">Home</Link>
            <Link href="/seller/dashboard">Dashboard</Link>
            <Link href="/seller/my-projects">My Products</Link>
            <Link href="/seller/create-project">Create New Product</Link>
            <Link href="/seller/my-bids">My Bids</Link>
          </>
        );
      case 3:
        return (
          <>
            <Link href="/">Home</Link>
            <Link href="/customer/dashboard">Dashboard</Link>
            <Link href="/customer/browse-projects">Vehicles</Link>
            <Link href="/customer/my-bids">My Bids</Link>
          </>
        );
      case 4:
        return (
          <>
            <Link href="/">Home</Link>
            <Link href="/auditor/dashboard">Dashboard</Link>
            <Link href="/auditor/audit-logs">View Audit Logs</Link>
            <Link href="/auditor/system-activity">System Activity</Link>
          </>
        );
      default:
        return <Link href="/">Home</Link>; // Default for non-logged-in users
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left: Logo */}
        <div className="text-2xl font-bold">
          <Link href="/">LankaBids</Link>
        </div>

        {/* Middle: Dynamic Buttons */}
        <nav className="space-x-5 font-semibold ">
          {renderMiddleButtons()}
        </nav>

        {/* Right: Login/Register or Profile/Logout */}
        <div>
          {isLoggedIn ? (
            <div className='space-x-7'>
                <Link href="/profile" className='text-2xl font-semibold'>
                <i className="fas fa-user-circle"></i>
                </Link>
                <Link href="/logout" className='text-2xl font-semibold'>
                <i className="fas fa-sign-out-alt"></i>
                </Link>
            </div>
          ) : (
            <div className='space-x-7'>
              <Link href="/login" className='text-2xl font-semibold'>
              <i className="fas fa-sign-in-alt"></i> Login
              </Link>
              <Link href="/register" className='text-2xl font-semibold'>
              <i className="fas fa-user-plus"></i> Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;