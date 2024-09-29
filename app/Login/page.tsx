"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/Login/input';
import { Button } from '@/components/Login/button';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store RoleID in localStorage
        localStorage.setItem('RoleID', data.roleID); // Ensure that data.roleID is set correctly
        localStorage.setItem('isLoggedIn', 'true');
    
        console.log('Logged in successfully:', data);


        // Redirect to the Home page
        router.push('/Home');
      } else {
        // Set error message if credentials are wrong
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <div className="flex h-screen">
        {/* Left side for the login form */}
        <div className="w-1/2 flex items-center justify-center bg-white">
          <div className="w-full max-w-md px-12 py-12 bg-white rounded-xl shadow-md">
            <h2 className="text-4xl font-bold text-left">Welcome Back</h2>
            <p className="text-md text-left mt-1 text-gray-500 pb-4">
              Sign in to your account
            </p>
            <form className="space-y-3" onSubmit={handleLogin}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="mt-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Password"
                    className="mt-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="text-right">
                <label className="font-medium text-blue-900 cursor-pointer hover:underline transition-all duration-200">
                  Forgot Password
                </label>
              </div>
              <div>
                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right side for the image */}
        <div className="w-1/2 h-full bg-black"></div>
      </div>
    </>
  );
};

export default Login;
