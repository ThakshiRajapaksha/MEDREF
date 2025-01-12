'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Table from '../../../../../components/table';

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

  const handleViewClick = async (referralId: string) => {
    try {
      const response = await fetch(
        `/api/labs/${labId}/referrals/${referralId}`
      ); // Fetch referral details
      const data = await response.json();

      console.log('Referral data:', data); // Log the full response

      if (!data.success || !data.referral) {
        throw new Error('Failed to fetch referral details.');
      }

      const path = `/Dashboard/Lab-technician/${labTechnicianId}/Labs/${labId}/Testresults/${referralId}`;
      router.push(path);
    } catch (error) {
      console.error('Error fetching referral details:', error);
      alert('Failed to fetch referral details.');
    }
  };

  if (loading) {
    return <div>Loading referrals...</div>;
  }

  if (!referrals.length) {
    return <div>No referrals found for this lab.</div>;
  }

  // Define table columns
  const columns = [
    { Header: 'ReferralId', accessor: 'id', key: 'id', label: 'Referral ID' },
    {
      Header: 'Patient',
      accessor: 'patient',
      key: 'patient',
      label: 'Patient',
    },
    { Header: 'Test', accessor: 'test', key: 'test', label: 'Test' },
    { Header: 'Doctor', accessor: 'doctor', key: 'doctor', label: 'Doctor' },
    { Header: 'Status', accessor: 'status', key: 'status', label: 'Status' },
    {
      Header: 'Illness',
      accessor: 'illness',
      key: 'illness',
      label: 'Illness',
    },
    {
      Header: 'Allergies',
      accessor: 'allergies',
      key: 'allergies',
      label: 'Allergies',
    },
  ];

  // Map referrals data to table rows
  const data = referrals.map((referral) => ({
    id: referral.id,
    patient: `${referral.patient.first_name} ${referral.patient.last_name}`,
    test: referral.test.name,
    doctor: `${referral.doctor.first_name} ${referral.doctor.last_name}`,
    status: referral.status,
    illness: referral.illness || 'N/A',
    allergies: referral.allergies || 'N/A',
  }));

  return (
    <div>
      <h1>Referrals for Lab</h1>
      <Table
        columns={columns}
        data={data}
        handleViewClick={handleViewClick}
      />{' '}
    </div>
  );
}
