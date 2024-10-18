import { getCurrentUser } from "@/lib/auth";


export const getNavLinks = async () => {
    const user = await getCurrentUser();
    const role = user?.role;

    let navLinks;
    let authLinks = [];

    if (!user) {
        // Guest view (not logged in)
        navLinks = [
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' }
        ];

        // Login/Register links for guests
        authLinks = [
            { label: 'Login', href: '/recaptcha?mode=login' },
            { label: 'Register', href: '/recaptcha?mode=register'}
        ];
    } else {
        // Links based on role
        switch (role) {
            case 3: // Customer
                navLinks = [
                    { label: 'Home', href: '/' },
                    { label: 'Products', href: '/products' },
                    { label: 'My Bids', href: '/mybids' }
                ];
                break;
            case 2: // Seller
                navLinks = [
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Manage Products', href: '/manageproducts' },
                    { label: 'Sales', href: '/sales' }
                ];
                break;
            default:
                navLinks = [
                    { label: 'Home', href: '/' },
                    { label: 'Products', href: '/products' }
                ];
        }

        // Settings/Logout links for logged-in users
        authLinks = [
            { label: 'Settings', href: '/settings' },
            { label: 'Log out', href: '/auth/logout' },
        ];
    }

    return {
        navLinks,
        authLinks,
    };
};
