"use client";
import * as z from "zod";
import { CardWrapper } from '@/components/auth/card-wrapper';
import { useForm } from 'react-hook-form';
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { FormInformation } from "@/components/form-info";
import { login } from "@/actions/login";

export const LoginForm = () => {
  const [error, setError] = useState<string | undefined>(""); // Error state
  const [success, setSuccess] = useState<string | undefined>(""); 
  const [info, setInfo] = useState<string | undefined>("");// Success state
  const [isPending, startTransition] = useTransition(); // Transition for async actions
  const [show2FA , setShow2FA] = useState(false);


  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = (values: z.infer<typeof SignInSchema>) => {
    setError("");
    setSuccess("");
    setInfo("");

    startTransition(() => {
      login(values).then((data) => 
        {
        if (data?.error) 
        {
          form.reset(); 
          setError(data.error);
        } 
        if  (data?.success)
        {
          form.reset();
          setSuccess(data.success); 
        }
        if(data?.twoFactor)
        {
          setShow2FA(true);
        }
        if (data?.info)
        {
          setInfo(data?.info); // Display info message
        }
      }).catch (() => setError("An error occurred. Please try again."))
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonHref="/auth/register"
      backButtonLabel="Don't have an account?"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">

          {show2FA && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter 2FA Code , Check Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="123456"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {!show2FA && (
              <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="abc@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="**********"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
            )}
          </div>
          <FormError message={error} /> {/* Display error */}
          <FormSuccess message={success} /> {/* Display success */}
          <FormInformation message={info} /> {/* Display info */}
          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isPending}>
          {show2FA ? "Verify" : "Sign In"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
