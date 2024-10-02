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
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),  // Assuming email and password are state variables
    });

    const data = await response.json();

    if (response.ok) {
      // Store role_id and login status in localStorage
      localStorage.setItem('RoleID', data.role_id.toString()); // Save role_id from API response
      localStorage.setItem('isLoggedIn', 'true');
  
      console.log('Logged in successfully:', data);

      // Redirect to the Home page based on the user's role
      switch (data.role_id) {
        case 1: 
          router.push('/Dashboard'); // Redirect to Admin Home page
          break;
        case 2: 
          router.push('/Home'); // Redirect to Auditor Home page
          break;
        case 3: 
          router.push('/Home'); // Redirect to Customer Home page
          break;
        case 4: 
          router.push('/Dashboard'); // Redirect to Seller Home page
          break;
        default: 
          router.push('/unknown'); // Handle unknown role
      }
    } else {
      // Set error message if login fails
      setError(data.message || 'Invalid credentials. Please try again.');
    }
  } catch (error) {
    console.error('An error occurred:', error);
    setError('An error occurred. Please try again.');
  }
};

  return (
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
  );
};

export default Login;
