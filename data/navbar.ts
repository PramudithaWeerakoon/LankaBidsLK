import { getCurrentUser } from "@/lib/auth";
import { writeGeneralLog } from "@/utils/logging"; // Import the general logging utility

export const navbar = async () => {
    const user = await getCurrentUser();
    const role = user?.role;

    if (!role) {
        writeGeneralLog('general.log', 'Fetch', 'Navbar', 'Guest', 'Fetch', 'Failure', 'User role not found');
        console.warn('User role not found');
        return null;
    }

    writeGeneralLog('general.log', 'Fetch', 'Navbar', user.email!, 'Fetch', 'Success', 'Fetched user role successfully');
    console.log("data/navbar worked", role);

    return role;
};
