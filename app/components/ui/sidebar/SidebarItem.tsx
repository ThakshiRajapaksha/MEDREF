import React from 'react';
import Link from 'next/link';

interface SidebarItemProps {
  href: string;
  label: string;
  icon: React.ReactNode; // Icon prop added
}

export function SidebarItem({ href, label, icon }: SidebarItemProps) {
  return (
    <Link href={href}>
      <div className="flex items-center text-sm py-2 px-4 rounded-md  hover:bg-teal-100 font-heading">
        <span className="mr-2">{icon}</span> {/* Render the icon */}
        {label}
      </div>
    </Link>
  );
}
