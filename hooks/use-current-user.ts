import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const session = useSession();
    console.log("session - USE",session);
  return session.data?.user;
};