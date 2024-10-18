"use client";
import * as z from "zod";
import { CardWrapper } from '@/components/auth/card-wrapper';
import {useForm} from 'react-hook-form';
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,  
} from "@/components/ui/form";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { register } from "@/actions/register";
import { Switch } from "../ui/switch";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending , startTransition] = useTransition();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role:"",
      isTwoFactorEnabled: false,
    }
  });

  const router = useRouter(); // Initialize router

  const onSubmit =  (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const data = await register(values); // Call the register action
      setError(data.error);
      setSuccess(data.success);

      if (data.success) 
        {
        // Ensure roleId is defined and is a valid number
        if (data.roleId !== undefined && data.roleId !== null) {
            localStorage.setItem('RoleID', data.roleId.toString());
        } else {
            console.error('RoleID is not defined or not a valid number');
        }
    
        localStorage.setItem('isLoggedIn', 'true');
    
        // Ensure userID is defined and is a valid number
        if (data.userID !== undefined && data.userID !== null) {
            localStorage.setItem('userID', data.userID.toString());
        } else {
            console.error('userID is not defined or not a valid number');
        }
    
    }
    });
  };

  return (
    <CardWrapper
    headerLabel='Create an account'
    backButtonHref='/auth/login'
    backButtonLabel="Already have an account?">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6">
          <div className="space-y-4">
            {/*Username Field*/}
            <FormField control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl><Input {...field} disabled={isPending} placeholder="Enter your username" /></FormControl>
              <FormMessage/>
              </FormItem>
            )}
            />

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

            <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                            disabled={isPending}
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value={'3'}>
                                    Customer
                                </SelectItem>
                                <SelectItem value={'2'}>
                                    Seller
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            /> 
            <FormField
                                control={form.control}
                                name="isTwoFactorEnabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>Two Factor Authentication</FormLabel>                                           
                                        </div>
                                        <FormControl>
                                            <Switch
                                                disabled={isPending}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />  
          </div>
          <FormError message={error}/>
          <FormSuccess message={success}/>
          <Button typeof="submit" className="w-full">Create Account</Button>
        </form>
      </Form>
    </CardWrapper>
  );
  }
