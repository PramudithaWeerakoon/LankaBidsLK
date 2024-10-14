// components/header.tsx

import React from 'react';

// Assuming you have a way to get the roleId from the session
const roleId = 3; // Change this to 2 for testing Seller role

const Header = () => {
    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <h1 className="text-xl font-bold">Lankabidslk</h1>

                {/* Navigation */}
                <nav>
                    <ul className="flex space-x-4">
                        {(() => {
                            switch (roleId) {
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
                                                <a href="/add-products" className="hover:underline">Add Products</a>
                                            </li>
                                            <li>
                                                <a href="/sales" className="hover:underline">Sales</a>
                                            </li>
                                        </>
                                    );
                                default:
                                    return null; // Handle other cases or return null if no role matches
                            }
                        })()}
                    </ul>
                </nav>

                {/* Login/Register Links */}
                <div className="flex space-x-4">
                    <a href="/login" className="hover:underline">Login</a>
                    <a href="/register" className="hover:underline">Register</a>
                </div>
            </div>
        </header>
    );
};

export default Header;
