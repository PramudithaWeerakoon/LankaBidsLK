import { getCurrentUser } from "@/lib/auth";

export const mybids = async () => {

    const user = await getCurrentUser();
    const id = user?.id;
    console.log("data/mybids worked", id);

    if (!id) {
        return null;
    }
    return id ;
};