'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CalendarDateRangePicker } from '@/app/components/ui/CalendarDateRangePicker';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';

export default function DoctorDashboard() {
  const { id } = useParams();
  const [userData, setUserData] = useState<{
    name: string;
    role: string;
  } | null>(null);

  const [patients, setPatients] = useState(0);
  const [referrals, setReferrals] = useState(0);
  const [tests, setTests] = useState(0);
  const [urgentCases, setUrgentCases] = useState(0);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.user) {
          setUserData({
            name: `${data.user.first_name} ${data.user.last_name}`,
            role: data.user.role.name,
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });

    fetch('/api/dashboard-data')
      .then((response) => response.json())
      .then((data) => {
        setPatients(data.patients || 0);
        setReferrals(data.referrals || 0);
        setTests(data.tests || 0);
        setUrgentCases(data.urgentCases || 0);
      })
      .catch((error) => {
        console.error('Error fetching dashboard data:', error);
      });
  }, [id]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex-1 p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Welcome, {userData.name}</h1>
        <CalendarDateRangePicker className="z-10" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients}</div>
            <p className="text-xs text-muted-foreground">
              Total patients registered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referrals}</div>
            <p className="text-xs text-muted-foreground">
              Total referrals made
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests}</div>
            <p className="text-xs text-muted-foreground">
              Total tests conducted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Urgent Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgentCases}</div>
            <p className="text-xs text-muted-foreground">
              Referrals marked as urgent
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
