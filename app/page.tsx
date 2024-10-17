'use client';
import React from 'react';
import Button from './components/button';
import { useRouter } from 'next/navigation';

function Page() {
  const router = useRouter();

  const handleSignUpClick = () => {
    router.push('/Register');
  };

  const handleLoginClick = () => {
    router.push('/Login');
  };
  return (
    <div className="relative h-screen">
      {/* Sign Up and Login buttons */}
      <div className="absolute top-4 right-4 flex flex-row gap-4">
        <Button label="Sign Up" color="blue" onClick={handleSignUpClick} />
        <Button label="Login" color="blue" onClick={handleLoginClick} />
      </div>

      <div className="flex items-center justify-center h-full">
        <h1 className="text-4xl font-bold">MEDREF</h1>
      </div>
    </div>
  );
}

export default Page;
