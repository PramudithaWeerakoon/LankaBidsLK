"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { useCallback, useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { signOut } from "next-auth/react"; 
import { FormError } from "@/components/form-error"; 
import { FormSuccess } from "@/components/form-success"; 
import { useRouter } from "next/navigation"; 
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const LogoutForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter(); 
    const onSubmit = useCallback(async () => {
        setLoading(true);
        setError(undefined);
        setSuccess(undefined);

        try {
            await signOut({ redirectTo: DEFAULT_LOGIN_REDIRECT });
            // Clear token cache
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            localStorage.removeItem("authjs.callback-url");
            localStorage.removeItem("authjs.csrf-token");
            localStorage.removeItem("authjs.session-token");
            setSuccess("You have successfully logged out.");
            setTimeout(() => {
                router.push("/auth/login");
            }, 2000);
        } catch (err) {
            setError("An error occurred while logging out. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        onSubmit(); 
    }, [onSubmit]);

    return (
        <CardWrapper headerLabel="Logging you out" backButtonLabel="Back to login" backButtonHref="/auth/login">
            <div className="flex items-center w-full justify-center">
                {loading && <SyncLoader />} {/* Show loader while processing */}
                {success && <FormSuccess message={success} />} {/* Show success message */}
                {error && <FormError message={error} />} {/* Show error message */}
            </div>
        </CardWrapper>
    );
};

export default LogoutForm;