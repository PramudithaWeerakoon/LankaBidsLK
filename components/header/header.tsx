// Header.tsx
import React from 'react';
import { getNavLinks } from '@/actions/header';

const Header = async () => {
    const { navLinks, authLinks } = await getNavLinks();

    return (
        <header className="bg-gradient-to-r from-blue-600 to-blue-900 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <h1 className="text-xl font-bold">Lankabidslk</h1>

                {/* Navigation Links */}
                <nav>
                    <ul className="flex space-x-4">
                        {navLinks.map((link, index) => (
                            <li key={index}>
                                <a href={link.href} className="hover:underline">{link.label}</a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Authentication Links (Login/Register or Settings/Logout) */}
                <div className="flex space-x-4">
                    {authLinks.map((link, index) => (
                        <a key={index} href={link.href} className="hover:underline">{link.label}</a>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Header;
