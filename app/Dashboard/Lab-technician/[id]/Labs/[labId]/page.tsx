'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../../../components/ui/table';
import { Button } from '@/app/components/ui/button';

export default function LabReferralsPage() {
  const { labId, id: labTechnicianId } = useParams();
  const router = useRouter();

  interface Referral {
    id: number;
    patient: {
      first_name: string;
      last_name: string;
    };
    test: {
      name: string;
    };
    doctor: {
      first_name: string;
      last_name: string;
    };
    status: string;
    illness?: string;
    allergies?: string;
    filePath?: string;
    test_report_filename?: string;
  }

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (labId) {
      fetch(`/api/labs/${labId}/referrals`) // Fetch referrals using the labId
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setReferrals(data.referrals); // Set referrals data
          } else {
            console.error('Failed to fetch referrals:', data.message);
          }
        })
        .catch((error) => console.error('Error fetching referrals:', error))
        .finally(() => setLoading(false));
    }
  }, [labId]);

  const handleViewClick = (referralId: number) => {
    const path = `/Dashboard/Lab-technician/${labTechnicianId}/Labs/${labId}/Testresults/${referralId}`;
    router.push(path);
  };

  if (loading) {
    return <div>Loading referrals...</div>;
  }

  if (!referrals.length) {
    return <div>No referrals found for this lab.</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Referrals for Lab</h1>
      <Table className="border border-gray-300">
        <TableHeader>
          <TableRow>
            <TableHead>Referral ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Test</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Illness</TableHead>
            <TableHead>Allergies</TableHead>
            <TableHead>Test Report</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrals.map((referral) => (
            <TableRow key={referral.id}>
              <TableCell>{referral.id}</TableCell>
              <TableCell>{`${referral.patient.first_name} ${referral.patient.last_name}`}</TableCell>
              <TableCell>{referral.test.name}</TableCell>
              <TableCell>{`${referral.doctor.first_name} ${referral.doctor.last_name}`}</TableCell>
              <TableCell>{referral.status}</TableCell>
              <TableCell>{referral.illness || 'N/A'}</TableCell>
              <TableCell>{referral.allergies || 'N/A'}</TableCell>
              <TableCell>
                {referral.filePath ? (
                  <a
                    href={`http://localhost:3000/api/labs/${labId}/referrals/${referral.id}/reports`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View PDF
                  </a>
                ) : (
                  <span>No PDF</span>
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
    </div>
  );
}
