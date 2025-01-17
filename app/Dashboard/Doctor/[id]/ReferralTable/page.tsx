'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Table from '../../../../components/table';

interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  status: string;
  illness?: string | null;
  allergies?: string | null;
  testType: string;
  lab_name: string;
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
              illness: referral.illness,
              allergies: referral.allergies,
              // Ensure you're accessing the correct nested properties for testType and lab
              testType: referral.test_type || 'Unknown Test Type', // Access test name
              lab: referral.lab_name || 'Unknown Lab', // Access lab name
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
  }, []);

  const handleViewClick = async (referralId: string) => {
    try {
      const response = await fetch(`/api/referrals/${referralId}`);
      const data = await response.json();

      console.log('Referral data:', data); // Log the full response

      if (!data.success || !data.referral) {
        throw new Error('Failed to fetch referral details.');
      }

      const patientId = data.referral.patient?.patientId; // Use patient ID from the patient object

      if (!patientId) {
        alert('Cannot navigate. Patient ID is missing.');
        return;
      }

      // Use the patientId from the referral data
      const path = `/Dashboard/Doctor/${doctorId}/Patient/${patientId}/Referrals/${referralId}`;
      router.push(path);
    } catch (error) {
      console.error('Error fetching referral details:', error);
      alert('Failed to fetch referral details.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const columns = [
    { key: 'id', label: 'Referral ID' },
    { key: 'patientName', label: 'Patient Name' },
    { key: 'status', label: 'Status' },
    { key: 'illness', label: 'Illness' },
    { key: 'allergies', label: 'Allergies' },
    { key: 'testType', label: 'Test Type' }, // Add Test Type column
    { key: 'lab', label: 'Lab' }, // Add Lab column
  ];

  return (
    <div>
      <h1>Referrals</h1>
      {referrals.length === 0 && <div>No referrals found.</div>}
      <Table
        columns={columns}
        data={referrals}
        handleViewClick={handleViewClick}
      />
    </div>
  );
};

export default ReferralTable;
