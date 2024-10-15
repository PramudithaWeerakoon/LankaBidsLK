"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { use, useCallback, useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setError("Missing token!");
            return;
        }

        newVerification(token)
            .then((data) => {
                if (data.success) {
                    setSuccess(data.success);
                    alert("Your account has been verified successfully! Login to continue.");
                } else {
                    setError(data.error);
                }
            })
            .catch(() => {
                setError("Something went wrong!");
            });
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <CardWrapper headerLabel="Confirming your verification" backButtonLabel="Back to login" backButtonHref="/auth/login">
            <div className="flex items-center w-full justify-center">
                {!success && !error && (
                    <SyncLoader />
                )}
                <FormSuccess message={success} />
                {!success && (
                    <FormError message={error} />
                )}
            </div>
        </CardWrapper>
    );
};