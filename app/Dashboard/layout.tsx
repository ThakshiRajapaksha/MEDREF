'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Sidebar } from '../components/ui/sidebar/sidebar';
import { SidebarItem } from '../components/ui/sidebar/SidebarItem';
import {
  FaUser,
  FaHeartbeat,
  FaStethoscope,
  FaFlask,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa';
import { useParams, usePathname } from 'next/navigation';
import { Input } from '../components/ui/input';
import 'react-calendar/dist/Calendar.css';
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from '@knocklabs/react';
import '@knocklabs/react/dist/index.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<{
    name: string;
    role: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageTitle, setPageTitle] = useState<string>('');
  const [labsExpanded, setLabsExpanded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [labs, setLabs] = useState<
    {
      id: number;
      name: string;
      testTypes: { id: number; name: string; labId: number }[];
    }[]
  >([]);
  const [sidebarItems, setSidebarItems] = useState<
    {
      label: string;
      path: string;
      icon: JSX.Element;
      onClick?: () => void;
      isExpandable?: boolean;
    }[]
  >([]);
  const [isNotifVisible, setIsNotifVisible] = useState(false);
  const notifButtonRef = useRef(null);

  const toggleLabs = () => setLabsExpanded((prev) => !prev);

  const userId = Array.isArray(id) ? id[0] : id;

  // Fetch user data and role
  useEffect(() => {
    if (userId) {
      fetch(`/api/users/${userId}`)
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
  }, [userId]);

  // Fetch labs if the role is "Lab-technician"
  useEffect(() => {
    if (role === 'Lab-technician') {
      fetch('/api/labs')
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.labs) {
            setLabs(data.labs);
          } else {
            console.error('Labs data not found:', data);
          }
        })
        .catch((error) => {
          console.error('Error fetching labs data:', error);
        });
    }
  }, [role]);

  // Populate sidebarItems based on role
  useEffect(() => {
    if (!role) return;

    const items = [];

    if (role === 'Doctor' || role === 'Admin' || role === 'Lab-technician') {
      items.push({
        label: 'Dashboard',
        path: `/Dashboard/${role}/${userId}`,
        icon: <FaStethoscope size={24} color="black" />,
      });
    }

    if (role === 'Admin') {
      items.push(
        {
          label: 'Manage Patients',
          path: `/Dashboard/${role}/${userId}/Patient`,
          icon: <FaUser size={24} color="black" />,
        },
        {
          label: 'Patients List',
          path: `/Dashboard/${role}/${userId}/PatientTable`,
          icon: <FaUser size={24} color="black" />,
        }
      );
    }

    if (role === 'Lab-technician') {
      items.push({
        label: 'Labs',
        path: '#',
        icon: <FaFlask size={24} color="black" />,
        onClick: toggleLabs,
        isExpandable: true,
      });
    }

    if (role === 'Doctor') {
      items.push(
        {
          label: 'Patients',
          path: `/Dashboard/${role}/${userId}/PatientTable`,
          icon: <FaUser size={24} color="black" />,
        },
        {
          label: 'Referrals',
          path: `/Dashboard/${role}/${userId}/ReferralTable`,
          icon: <FaHeartbeat size={24} color="black" />,
        }
      );
    }

    setSidebarItems(items);
  }, [role, userId]);

  // Update pageTitle based on active tab
  useEffect(() => {
    if (sidebarItems.length > 0) {
      const currentItem = sidebarItems.find((item) =>
        pathname.endsWith(item.path)
      );
      if (currentItem) {
        setPageTitle(currentItem.label);
      }
    }
  }, [pathname, sidebarItems]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  return (
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_API_KEY!}
      userId={userId}
    >
      <KnockFeedProvider
        feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID!}
      >
        <div className="flex h-screen">
          <Sidebar users={userData}>
            {sidebarItems.map((item) => (
              <div key={item.label}>
                {item.isExpandable ? (
                  <div
                    onClick={item.onClick}
                    className="flex items-center justify-between text-sm py-2 px-4 rounded-md hover:bg-teal-100 font-heading cursor-pointer"
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </div>
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

                {item.label === 'Labs' && labsExpanded && (
                  <div className="pl-6">
                    {labs.map((lab) => (
                      <SidebarItem
                        key={lab.id}
                        href={`/Dashboard/Lab-technician/${userId}/Labs/${lab.id}`}
                        label={lab.name}
                        icon={<FaFlask size={20} color="black" />}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Sidebar>

          <div className="flex flex-1 flex-col relative">
            <header className="sticky top-0 z-10 bg-white shadow-md">
              <div className="flex items-center justify-between px-6 py-4">
                <h1 className="text-sm font-bold">{pageTitle}</h1>
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
                <NotificationIconButton
                  ref={notifButtonRef}
                  onClick={() => setIsNotifVisible(!isNotifVisible)}
                />
                <NotificationFeedPopover
                  buttonRef={notifButtonRef}
                  isVisible={isNotifVisible}
                  onClose={() => setIsNotifVisible(false)}
                />
              </div>
            </header>
            <main className="flex-1 p-4 overflow-y-auto">{children}</main>
          </div>
        </div>
      </KnockFeedProvider>
    </KnockProvider>
  );
}
