'use client';
import React from 'react';
import { Button } from './components/ui/button';
import { useRouter } from 'next/navigation';
import backgroundImage from '@/app/assets/background.jpg';

function Page() {
  const router = useRouter();

  const handleSignUpClick = () => router.push('/Register');
  const handleLoginClick = () => router.push('/Login');

  return (
    <div
      className="relative h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      {/* Sign Up and Login buttons */}
      <div className="absolute top-4 right-4 flex flex-row gap-4">
        <Button variant="default" size="default" onClick={handleSignUpClick}>
          Sign Up
        </Button>
        <Button variant="secondary" size="default" onClick={handleLoginClick}>
          Login
        </Button>
      </div>

      {/* Centered Title */}
      <h1 className="text-6xl font-bold text-Black drop-shadow-lg mb-8 translate-x-40">
        MEDREF
      </h1>

      {/* Description Card — Shifted to the Right with Animation */}
      <div
        className="absolute bottom-30 right-12  bg-green-100/70 backdrop-blur-md p-10 rounded-2xl shadow-xl max-w-xs text-center animate-card"
        style={{ animationDuration: '1s' }}
      >
        <p className="text-lg text-gray-700 font-medium">
          "MEDREF is an intuitive hospital referral system built to enhance
          patient care coordination. It streamlines patient management,
          simplifies doctor referrals, and accelerates lab result processing —
          ensuring faster, more organized, and efficient healthcare delivery,
          all in one unified platform."
        </p>
      </div>

      <style>{`
        @keyframes slideUp {
          0% {
            transform: translateY(50px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-card {
          animation: slideUp 1s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Page;
