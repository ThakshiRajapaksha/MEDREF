import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void; // Add onClick prop
}

export function SidebarItem({ href, label, icon, onClick }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault(); // Prevent navigation if onClick is provided
      onClick();
    }
  };

  return (
    <Link href={href} onClick={handleClick}>
      <div
        className={`flex items-center text-sm py-2 px-4 rounded-md font-heading cursor-pointer ${
          isActive ? 'bg-teal-200 text-teal-800 font-bold' : 'hover:bg-teal-100'
        }`}
      >
        <span className="mr-2">{icon}</span> {/* Render the icon */}
        {label}
      </div>
    </Link>
  );
}
