import { getCurrentUser } from "@/lib/auth";
import handleLogout from "@/actions/logout"; // Import the server action
import { writeGeneralLog } from "@/utils/logging"; // Import the logging utility

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
            { label: 'Login', href: '/auth/login' },
            { label: 'Register', href: '/auth/register' }
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
            {
                label: 'Logout', href: '#', onClick: async () => {
                    console.log("Logging out...");
                    await handleLogout(); // Call the server action to logout
                    writeGeneralLog('general.log', 'Logout', 'User', user.email!, 'Logout', 'Success', 'User logged out successfully');
                    window.location.href = "/"; // Redirect the user after logout
                }
            }
        ];
    }

    return {
        navLinks,
        authLinks,
    };
};
