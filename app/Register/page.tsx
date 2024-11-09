/* eslint-disable prettier/prettier */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ExclamationCircleIcon,
  KeyIcon,
  PhoneIcon,
  UserIcon,
  AtSymbolIcon,
} from '@heroicons/react/24/solid';
import Button from '../components/button';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        // Get the user ID from the response
        const userId = result.data.id; 

        // Redirect to the appropriate dashboard with the ID in the URL
        if (formData.role === 'Admin') {
          router.push(`/Dashboard/Admin/${userId}`);
        } else if (formData.role === 'Doctor') {
          router.push(`/Dashboard/Doctor/${userId}`);
        } else if (formData.role === 'Lab-technician') {
          router.push(`/Dashboard/Lab-technician/${userId}`);
        }
      } else {
        setErrorMessage(result.message || 'Registration failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred while registering. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 overflow-auto"> {/* Added overflow-auto */}
      <div className="w-full max-w-md p-4 bg-white rounded shadow-lg mt-4">
        {/* Title for the form */}
        <h1 className="text-2xl font-bold text-center mt-4 mb-6">User Registration</h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
            <div className="w-full">
              <div>
                <label
                  className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                  htmlFor="first_name"
                >
                  First Name
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="first_name"
                    type="text"
                    name="first_name"
                    placeholder="Enter your first name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                  <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
              <div>
                <label
                  className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                  htmlFor="last_name"
                >
                  Last Name
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="last_name"
                    type="text"
                    name="last_name"
                    placeholder="Enter your last name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                  <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
              <div>
                <label
                  className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                  htmlFor="mobile"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="mobile"
                    type="tel"
                    name="mobile"
                    placeholder="Enter your phone number"
                    pattern="\d{10}"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                  <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
              <div>
                <label
                  className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                  htmlFor="role"
                >
                  Role
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="role"
                    type="text"
                    name="role"
                    placeholder="Enter your role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  />
                  <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
              <div>
                <label
                  className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
              <div className="mt-4">
                <label
                  className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
              <div className="mt-4">
                <label
                  className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                  htmlFor="confirm-password"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="confirm-password"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
              <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
              >
                {errorMessage && (
                  <>
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                    <p className="text-sm text-red-500">{errorMessage}</p>
                  </>
                )}
              </div>
              <div className="mt-4 flex justify-center">
                <Button
                  label="Register"
                  color="blue"
                  type="submit"
                />
              </div>
            </div>
        </form>
      </div>
    </div>
  );
}
