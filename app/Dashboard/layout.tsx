'use client';
import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/ui/sidebar/sidebar';
import { SidebarItem } from '../components/ui/sidebar/SidebarItem';
import { FaUser, FaHeartbeat, FaStethoscope } from 'react-icons/fa'; // Import icons
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

  useEffect(() => {
    if (id) {
      // Fetch the logged-in user's data using the userId from URL parameters
      fetch(`/api/users/${id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.user) {
            setUserData({
              name: data.user.first_name + ' ' + data.user.last_name,
              role: data.user.role.name,
            });
            setRole(data.user.role.name); // Set the role from the fetched user data
          } else {
            console.error('User data not found:', data);
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        })
        .finally(() => {
          setLoading(false); // Stop loading when the fetch is complete
        });
    } else {
      console.error('User ID is missing.');
      setLoading(false); // Stop loading if user ID is not available
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner">Loading...</div>{' '}
        {/* Add your custom loading spinner here */}
      </div>
    );
  }

  const sidebarItems = [
    ...(role === 'Doctor'
      ? [
          {
            label: 'Dashboard',
            path: `/Dashboard/Doctor/${id}`,
            icon: <FaStethoscope size={24} color="black" />,
          },
        ]
      : role === 'Admin'
        ? [
            {
              label: 'Manage Users',
              path: `/admin/users`,
              icon: <FaUser size={24} color="black" />,
            },
          ]
        : role === 'Lab Technician'
          ? [
              {
                label: 'Test Results',
                path: `/lab/tests`,
                icon: <FaHeartbeat size={24} color="black" />,
              },
            ]
          : []),
    {
      label: 'Patients',
      path: `/Dashboard/Doctor/${id}/PatientTable`,
      icon: <FaUser size={24} color="black" />,
    },
    {
      label: 'Referrals',
      path: `/Dashboard/Doctor/${id}/Rererrals`,
      icon: <FaHeartbeat size={24} color="black" />,
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    console.log('Search Query:', searchQuery); // Add search functionality as needed
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar users={userData}>
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.path}
            href={item.path}
            label={item.label}
            icon={item.icon}
          />
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
