import React from "react";
import Image from "next/image";
import logo from "../../../assets/logo.png"; // Adjust the relative path based on your folder structure
import { Avatar} from "../../ui/avatar"; 
import avatar from "../../../assets/avatar.png"; 

export function Sidebar({ children, users }: { children: React.ReactNode; users: { name: string; role: string } | null }) {
  return (
    <div className="flex flex-col h-full bg-white text-black border-r border-grey">
      {/* Sidebar Header with Logo */}
      <div className="p-4 border-b border-grey">
        <Image src={logo} alt="Logo" width={250} height={100} />
      </div>

      {/* Sidebar Items */}
      <div className="flex-1 p-4 overflow-y-auto">{children}</div>

      {/* Sidebar Footer with Avatar and Profile Name */}
      <div className="flex items-center gap-3 p-4 border-t border-grey">
        <Avatar>
          <Image src={avatar} alt="Avatar" width={40} height={40} />
        </Avatar>
        <div>
          <p className="text-sm font-medium">{users?.name || 'Loading...'}</p>
          <p className="text-xs text-gray-400">{users?.role || 'Loading...'}</p>
        </div>
      </div>
    </div>
  );
}
