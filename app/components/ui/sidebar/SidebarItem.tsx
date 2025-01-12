import React from 'react';
import Link from 'next/link';

interface SidebarItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void; // Add onClick prop
}

export function SidebarItem({ href, label, icon, onClick }: SidebarItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault(); // Prevent navigation if onClick is provided
      onClick();
    }
  };

  return (
    <Link href={href} onClick={handleClick}>
      <div className="flex items-center text-sm py-2 px-4 rounded-md hover:bg-teal-100 font-heading cursor-pointer">
        <span className="mr-2">{icon}</span> {/* Render the icon */}
        {label}
      </div>
    </Link>
  );
}
