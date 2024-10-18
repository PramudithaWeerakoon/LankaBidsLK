import { signOut } from "next-auth/react";

export default async function handleLogout() {
  try {
    // Perform sign out using NextAuth
    await signOut({ redirect: false });

    // Additional logic after logout can go here if needed
    console.log("Successfully logged out");
    
    // You can redirect the user to a specific page after logout
    window.location.href = "/"; // Redirect to home page after logout
  } catch (error) {
    console.error("Error during logout:", error);
  }
}
