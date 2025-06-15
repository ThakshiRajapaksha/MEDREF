'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import backgroundImage from '@/app/assets/background.jpg';

// Define the LoginPage component
export default function LoginPage() {
  // State variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Handle successful login
        localStorage.setItem('token', data.token);

        const userId = data.user.id;

        // Redirect based on user role
        switch (data.user.roleId) {
          case 1: // Admin
            router.push(`/Dashboard/Admin/${userId}`);
            break;
          case 2: // Doctor
            router.push(`/Dashboard/Doctor/${userId}`);
            break;
          case 3: // Lab-technician
            router.push(`/Dashboard/Lab-technician/${userId}`);
            break;
          default:
            setErrorMessage('Invalid user role');
            break;
        }
      } else {
        // Handle login error
        setErrorMessage(data.error || 'Something went wrong');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Render the login form
  return (
    <div
      className="relative h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-lg">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md"
              required
            />
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-teal-500 rounded-md hover:bg-teal-500 disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}
