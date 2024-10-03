"use client";
import * as z from "zod";
import { CardWrapper } from '@/components/auth/card-wrapper';
import {useForm} from 'react-hook-form';
import { startTransition, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccsess] = useState<string | undefined>("");

  const [isPending , startTransition] = useTransition();
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const onSubmit =  (values: z.infer<typeof SignInSchema>) => {
    setError("");
    setSuccsess("");

    startTransition(() => {
    login(values)
      .then ((data) => {
        setError(data.error);
        setSuccsess(data.succsess);
      })
    })
  }

  return (
    <CardWrapper
    headerLabel='Welcome Back'
    backButtonHref='/auth/register'
    backButtonLabel="Don't have an account?">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6">
          <div className="space-y-4">
            {/*Email Field*/}
            <FormField control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input {...field} disabled={isPending} placeholder="abc@example.com" typeof="email" /></FormControl>
              <FormMessage/>
              </FormItem>
            )}
            />
            {/*Password Field*/}
            <FormField control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl><Input {...field} disabled={isPending} placeholder="**********" typeof="password"/></FormControl>
              <FormMessage/>
              </FormItem>
            )}
            />
          </div>
          <FormError message={error}/>
          <FormSuccess message={success}/>
          <Button typeof="submit" className="w-full">Sign In</Button>
        </form>
      </Form>
    </CardWrapper>
  );
  }
