'use client';
import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/ui/sidebar/sidebar';
import { SidebarItem } from '../components/ui/sidebar/SidebarItem';
import {
  FaUser,
  FaHeartbeat,
  FaStethoscope,
  FaFlask,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa'; // Import icons
import { useParams } from 'next/navigation'; // Importing useParams to get the dynamic ID from the URL
import { Input } from '../components/ui/input'; // Assuming you use ShadCN's Input component for styling
import 'react-calendar/dist/Calendar.css'; // Import default styles for the calendar

export default function Layout({ children }: { children: React.ReactNode }) {
  const { id } = useParams(); // Use the id from the URL parameter to fetch user data
  const [role, setRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<{
    name: string;
    role: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state to manage the fetch process
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for the search query
  const [labsExpanded, setLabsExpanded] = useState<boolean>(false); // State to toggle the Labs submenu
  const [labs, setLabs] = useState<
    {
      id: number;
      name: string;
      testTypes: { id: number; name: string; labId: number }[];
    }[]
  >([]);

  useEffect(() => {
    if (id) {
      fetch(`/api/users/${id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.user) {
            setUserData({
              name: data.user.first_name + ' ' + data.user.last_name,
              role: data.user.role.name,
            });
            setRole(data.user.role.name);
          } else {
            console.error('User data not found:', data);
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    // Fetch labs if the role is "Lab-technician"
    if (role === 'Lab-technician') {
      fetch('/api/labs') // Replace with your actual API endpoint
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.labs) {
            setLabs(data.labs); // Store the labs in state
          } else {
            console.error('Labs data not found:', data);
          }
        })
        .catch((error) => {
          console.error('Error fetching labs data:', error);
        });
    }
  }, [id, role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner">Loading...</div>{' '}
        {/* Add your custom loading spinner here */}
      </div>
    );
  }

  // Function to toggle labs submenu
  const toggleLabs = () => {
    setLabsExpanded((prev) => !prev); // Toggle the expanded state
  };

  // Sidebar items logic
  const sidebarItems = [];

  // Common items for multiple roles
  if (role === 'Doctor' || role === 'Admin' || role === 'Lab-technician') {
    sidebarItems.push({
      label: 'Dashboard',
      path: `/Dashboard/${role}/${id}`,
      icon: <FaStethoscope size={24} color="black" />,
    });
  }

  // Admin-specific items
  if (role === 'Admin') {
    sidebarItems.push(
      {
        label: 'Manage Users',
        path: `/admin/users`,
        icon: <FaUser size={24} color="black" />,
      },
      {
        label: 'Patients',
        path: `/Dashboard/${role}/${id}/PatientTable`,
        icon: <FaUser size={24} color="black" />,
      }
    );
  }

  // Lab Technician-specific items

  if (role === 'Lab-technician') {
    sidebarItems.push({
      label: 'Labs',
      path: '#',
      icon: <FaFlask size={24} color="black" />,
      onClick: toggleLabs, // Toggle submenu
      isExpandable: true, // Identify this item as expandable
    });
  }

  // Doctor-specific items
  if (role === 'Doctor') {
    sidebarItems.push(
      {
        label: 'Patients',
        path: `/Dashboard/${role}/${id}/PatientTable`,
        icon: <FaUser size={24} color="black" />,
      },
      {
        label: 'Referrals',
        path: `/Dashboard/${role}/${id}/ReferralTable`,
        icon: <FaHeartbeat size={24} color="black" />,
      }
    );
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    console.log('Search Query:', searchQuery); // Add search functionality as needed
  };

  return (
    <div className="flex h-screen">
      <Sidebar users={userData}>
        {sidebarItems.map((item) => (
          <div key={item.label}>
            {item.isExpandable ? (
              // Render expandable parent item
              <div
                onClick={item.onClick}
                className="flex items-center justify-between text-sm py-2 px-4 rounded-md hover:bg-teal-100 font-heading cursor-pointer"
              >
                <div className="flex items-center">
                  <span className="mr-2">{item.icon}</span>{' '}
                  {/* Render the icon */}
                  {item.label}
                </div>
                {/* Expand/Collapse Icon */}
                {labsExpanded ? (
                  <FaChevronDown size={16} color="black" />
                ) : (
                  <FaChevronRight size={16} color="black" />
                )}
              </div>
            ) : (
              <SidebarItem
                href={item.path}
                label={item.label}
                icon={item.icon}
              />
            )}

            {/* Render labs submenu if expanded */}
            {item.label === 'Labs' && labsExpanded && (
              <div className="pl-6">
                {labs.map((lab) => (
                  <SidebarItem
                    key={lab.id}
                    href={`/Dashboard/Lab-technician/${id}/Labs/${lab.id}`}
                    label={lab.name}
                    icon={<FaFlask size={20} color="black" />}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </Sidebar>

      {/* Main Content */}
      <div className="flex flex-1 flex-col relative">
        {/* Header Section */}
        <header className="sticky top-0 z-10 bg-white shadow-md">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Page Title */}
            <h1 className="text-sm font-bold">Dashboard</h1>

            {/* Search Bar */}
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="max-w-sm"
            />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
