import React from 'react';
import { navbar } from '@/data/navbar';

const Header = async () => {
    const role = await navbar();

    return (
        <header className="bg-gradient-to-r from-blue-600 to-blue-900 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <h1 className="text-xl font-bold">Lankabidslk</h1>

                {/* Navigation */}
                <nav>
                    <ul className="flex space-x-4">
                        {/* Links based on role */}
                        {(() => {
                            switch (role) {
                                case 3: // Customer
                                    return (
                                        <>
                                            <li>
                                                <a href="/" className="hover:underline">Home</a>
                                            </li>
                                            <li>
                                                <a href="/products" className="hover:underline">Products</a>
                                            </li>
                                            <li>
                                                <a href="/mybids" className="hover:underline">My Bids</a>
                                            </li>
                                        </>
                                    );
                                case 2: // Seller
                                    return (
                                        <>
                                            <li>
                                                <a href="/dashboard" className="hover:underline">Dashboard</a>
                                            </li>
                                            <li>
                                                <a href="/manageproducts" className="hover:underline">Manage Products</a>
                                            </li>
                                            <li>
                                                <a href="/sales" className="hover:underline">Sales</a>
                                            </li>
                                        </>
                                    );
                                default:
                                    return (
                                        <>
                                            <li>
                                                <a href="/" className="hover:underline">Home</a>
                                            </li>
                                            <li>
                                                <a href="/products" className="hover:underline">Products</a>
                                            </li>
                                        </>
                                    );
                            }
                        })()}
                    </ul>
                </nav>

                {/* Settings and Logout Links when role is defined */}
                <div className="flex space-x-4">
                    {role !== 'guest' && role !== null ? (
                        <>
                            <a href="/settings" className="hover:underline">Settings</a>
                            <a href="/logout" className="hover:underline">Logout</a>
                        </>
                    ) : (
                        <>
                            <a href="/auth/login" className="hover:underline">Login</a>
                            <a href="/auth/register" className="hover:underline">Register</a>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
