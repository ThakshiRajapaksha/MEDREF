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
import { PieChart } from '../../../components/ui/piechart';
import { BarChart } from '../../../components/ui/barchart';
import { LineChart } from '../../../components/ui/linechart'; // Line chart import

export default function DoctorDashboard() {
  const { id } = useParams();
  const [userData, setUserData] = useState<{
    name: string;
    role: string;
  } | null>(null);

  const [patients, setPatients] = useState(0);
  const [referrals, setReferrals] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [pending, setPending] = useState(0);
  const [tests, setTests] = useState(0);
  const [labs, setLabs] = useState(0);
  const [testTypeData, setTestTypeData] = useState<
    { testType: string; count: number }[]
  >([]);
  const [yearlyData, setYearlyData] = useState<{
    years: string[];
    maleData: number[];
    femaleData: number[];
  }>({ years: [], maleData: [], femaleData: [] });

  const [monthlyAgeData, setMonthlyAgeData] = useState<{
    months: string[];
    averageAges: number[];
  }>({ months: [], averageAges: [] });

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
      .catch((error) => console.error('Error fetching user data:', error));

    fetch(`/api/dashboard-data`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setPatients(data.patients || 0);
          setReferrals(data.referrals || 0);
          setTests(data.tests || 0);
          setLabs(data.labs || 0);
          setCompleted(data.completed ?? 0);
          setPending(data.pending ?? 0);
          setTestTypeData(data.testTypeData || []);
          setYearlyData(
            data.yearlyData || { years: [], maleData: [], femaleData: [] }
          );
          setMonthlyAgeData(
            data.monthlyAgeData || { months: [], averageAges: [] }
          );
        }
      })
      .catch((error) => console.error('Error fetching dashboard data:', error));
  }, [id]);

  if (!userData) return <div>Loading...</div>;

  const pieChartData = [completed, pending];
  const pieChartLabels = ['Completed', 'Pending'];

  const barChartLabels = testTypeData.map((data) => data.testType);
  const barChartData = testTypeData.map((data) => data.count);

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
            <CardTitle className="text-sm font-medium">Labs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{labs}</div>
            <p className="text-xs text-muted-foreground">
              No of labs available
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <PieChart data={pieChartData} labels={pieChartLabels} />
        {testTypeData.length > 0 ? (
          <BarChart
            data={barChartData}
            labels={barChartLabels}
            title="Referrals per Test Type"
          />
        ) : (
          <div className="text-center text-gray-500">No data available</div>
        )}
        {yearlyData.years.length > 0 ? (
          <LineChart
            title="Yearly Patient Registrations"
            data={{
              labels: yearlyData.years,
              datasets: [
                {
                  label: 'Male',
                  data: yearlyData.maleData,
                  borderColor: '#3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.5)',
                },
                {
                  label: 'Female',
                  data: yearlyData.femaleData,
                  borderColor: '#ec4899',
                  backgroundColor: 'rgba(236, 72, 153, 0.5)',
                },
              ],
            }}
          />
        ) : (
          <div className="text-center text-gray-500">
            No yearly data available
          </div>
        )}
        {/* Conditionally Render Monthly Data */}
        {monthlyAgeData.months.length > 0 && (
          <LineChart
            data={{
              labels: monthlyAgeData.months,
              datasets: [
                {
                  label: 'Average Patient Age',
                  data: monthlyAgeData.averageAges,
                  borderColor: '#10B981', // A green color
                  backgroundColor: 'rgba(16, 185, 129, 0.5)', // A light green background
                },
              ],
            }}
            title="Average Patient Age Per Month"
          />
        )}
      </div>
    </div>
  );
}
