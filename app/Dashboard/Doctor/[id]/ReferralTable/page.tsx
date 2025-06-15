'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../../components/ui/table';
import { Button } from '@/app/components/ui/button';

interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  status: string;
  urgency: string;
  illness?: string | null;
  allergies?: string | null;
  testType: string;
  lab: string;
  test_report_filename?: string;
  filepath?: string;
}

const ReferralTable = () => {
  const { id: doctorId } = useParams();
  const router = useRouter();

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      if (doctorId) {
        try {
          const response = await fetch(`/api/referrals?doctorId=${doctorId}`);
          const data = await response.json();

          if (data.success && Array.isArray(data.referrals)) {
            const formattedReferrals = data.referrals.map((referral: any) => ({
              id: referral.id,
              patientId: referral.patient.id,
              patientName: `${referral.patient.first_name} ${referral.patient.last_name}`,
              status: referral.status,
              urgency: referral.urgency || 'normal',
              illness: referral.illness,
              allergies: referral.allergies,
              testType: referral.test_type || 'Unknown Test Type',
              lab: referral.lab_name || 'Unknown Lab',
              test_report_filename: referral.test_report_filename,
              filepath: referral.filePath,
            }));

            setReferrals(formattedReferrals);
          } else {
            setError('Unexpected response format');
          }
        } catch (error) {
          console.error('Error fetching referral data:', error);
          setError('Failed to fetch referral data.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchReferrals();
  }, [doctorId]);

  const handleViewClick = async (referralId: string) => {
    try {
      const response = await fetch(`/api/referrals/${referralId}`);
      const data = await response.json();

      if (!data.success || !data.referral) {
        throw new Error('Failed to fetch referral details.');
      }

      const patientId = data.referral.patient?.patientId;

      if (!patientId) {
        alert('Cannot navigate. Patient ID is missing.');
        return;
      }

      const path = `/Dashboard/Doctor/${doctorId}/Patient/${patientId}/Referrals/${referralId}`;
      router.push(path);
    } catch (error) {
      console.error('Error fetching referral details:', error);
      alert('Failed to fetch referral details.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Referrals</h1>
      {referrals.length === 0 ? (
        <div>No referrals found.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referral ID</TableHead>
              <TableHead>Patient Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Illness</TableHead>
              <TableHead>Allergies</TableHead>
              <TableHead>Test Type</TableHead>
              <TableHead>Lab</TableHead>
              <TableHead>Test Report</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell>{referral.id}</TableCell>
                <TableCell>{referral.patientName}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-white text-sm font-semibold ${
                      referral.status?.toLowerCase() === 'completed'
                        ? 'bg-teal-500'
                        : referral.status?.toLowerCase() === 'pending'
                          ? 'bg-red-500'
                          : 'bg-gray-400'
                    }`}
                  >
                    {referral.status || 'Unknown'}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-white text-sm font-semibold ${
                      referral.urgency?.toLowerCase() === 'emergency'
                        ? 'bg-red-600'
                        : referral.urgency?.toLowerCase() === 'urgent'
                          ? 'bg-orange-400'
                          : 'bg-blue-500'
                    }`}
                  >
                    {referral.urgency}
                  </span>
                </TableCell>
                <TableCell>{referral.illness || 'N/A'}</TableCell>
                <TableCell>{referral.allergies || 'N/A'}</TableCell>
                <TableCell>{referral.testType}</TableCell>
                <TableCell>{referral.lab}</TableCell>
                <TableCell>
                  {referral.filepath ? (
                    <a
                      href={`http://localhost:3000/api/referrals/${referral.id}/reports`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Report
                    </a>
                  ) : (
                    <span>No Report</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleViewClick(referral.id)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ReferralTable;
