'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Table from '../../../../components/table';

interface Referral {
  id: string;
  patientName: string;
  status: string;
  illness?: string | null;
  allergies?: string | null;
}

const ReferralTable = () => {
  const { id: doctorId } = useParams();

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (doctorId) {
      fetch(`/api/referrals?doctorId=${doctorId}`) // Call your API route for referrals
        .then((response) => response.json())
        .then((data) => {
          console.log('Fetched referral data:', data); // Log the response data
          if (data.success && Array.isArray(data.referrals)) {
            const formattedReferrals = data.referrals.map((referral: any) => ({
              id: referral.id,
              patientName: `${referral.patient.first_name} ${referral.patient.last_name}`,
              status: referral.status,
              illness: referral.illness,
              allergies: referral.allergies,
            }));
            setReferrals(formattedReferrals);
          } else {
            setError('Unexpected response format');
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching referral data:', error);
          setError(error.message);
          setLoading(false);
        });
    }
  }, [doctorId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const columns = [
    { key: 'patientName', label: 'Patient Name' },
    { key: 'status', label: 'Status' },
    { key: 'illness', label: 'Illness' },
    { key: 'allergies', label: 'Allergies' },
  ];

  return (
    <div>
      <h1>Referrals</h1>
      <Table columns={columns} data={referrals} role="Doctor" />
    </div>
  );
};

export default ReferralTable;
