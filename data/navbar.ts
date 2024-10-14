import { getCurrentUser } from "@/lib/auth";

export const navbar = async () => {

    const user = await getCurrentUser();
    const role = user?.role;
    console.log("data/navbar worked", role);

    if (!role) {
        return null;
    }
    return role ;
};