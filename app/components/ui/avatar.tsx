import * as React from "react";

export function Avatar({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-300">
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt }: { src: string; alt: string }) {
  return <img className="h-full w-full object-cover" src={src} alt={alt} />;
}

export function AvatarFallback({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-500 text-white">
      {children}
    </div>
  );
}
