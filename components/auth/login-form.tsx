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
import { login } from "@/actions/login";

export const LoginForm = () => {
  const [error, setError] = useState<string | undefined>(""); // Error state
  const [success, setSuccess] = useState<string | undefined>(""); // Success state
  const [isPending, startTransition] = useTransition(); // Transition for async actions
  const router = useRouter(); // Initialize useRouter for navigation

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

    startTransition(() => {
      login(values).then((data) => {
        if (data.error) {
          setError(data.error); // Handle error if login fails
        } else {
          setSuccess("Login successful"); // Display success message
          
          // Handle redirection based on user role
          if (data.role === 1) 
          {
            router.push("/auth/login"); // Redirect to admin dashboard
          } 
          else if (data.role === 2) 
          {
            router.push("/auth/register"); // Redirect to seller dashboard
          } 
          else 
          {
            router.push("/"); // Redirect to customer home
          }
        }
      });
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
            {/* Email Field */}
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
            {/* Password Field */}
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
          </div>
          <FormError message={error} /> {/* Display error */}
          <FormSuccess message={success} /> {/* Display success */}
          <Button type="submit" className="w-full" disabled={isPending}>
            Sign In
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
