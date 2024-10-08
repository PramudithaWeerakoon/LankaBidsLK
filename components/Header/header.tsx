import React, { FC } from 'react';
import Link from 'next/link';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface HeaderProps {
  isLoggedIn: boolean;
  roleID: number | null; // Add roleID to HeaderProps
}

const Header: FC<HeaderProps> = ({ isLoggedIn, roleID }) => {
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
            <Link href="/seller/dashboard">Dashboard</Link> {/*ryan*/}
            <Link href="/seller/products">Products</Link> {/*vihanga*/}
            <Link href="/seller/sales">Sales</Link> {/*vihanga + ayesh*/}
          </>
        );
      case 3:
        return (
          <>
            <Link href="/">Home</Link>{/*ayesh*/}
            <Link href="/products">Products</Link>{/*ayesh*/}
            <Link href="/mybids">My Bids</Link> {/*pramudita*/}
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
                <Link href="/profile" className='text-xl font-semibold'>
                <i className="fas fa-user-circle"></i>
                </Link>
                <Link href="/logout" className='text-xl font-semibold'>
                <i className="fas fa-sign-out-alt"></i>
                </Link>
            </div>
          ) : (
            <div className='space-x-7'>
              <Link href="/auth/login" className='text-xl font-semibold'>
              <i className="fas fa-sign-in-alt"></i>
              </Link>
              <Link href="/auth/register" className='text-xl font-semibold'>
              <i className="fas fa-user-plus"></i>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;