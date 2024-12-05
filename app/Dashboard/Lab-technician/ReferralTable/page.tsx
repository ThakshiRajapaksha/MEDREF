'use client';

import React, { useState, useEffect } from 'react';
import Table from '../../../components/table';

interface Patient {
  first_name: string;
  last_name: string;
}

interface Referral {
  id: number;
  patient: Patient;
  test_type: string; 
  lab_name: string;
}

const ReferralTable = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/referrals')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched referral data:', data);

        if (data.success && Array.isArray(data.referrals)) {
          const referralData: Referral[] = data.referrals.map((referral: any) => ({
            id: referral.id,
            patient: referral.patient,
            test_type: referral.test_type|| 'No test type', // Handle missing test type
            lab_name: referral.lab_name || 'No lab name', // Handle missing lab name
          }));
          setReferrals(referralData);
        } else {
          setError('Expected array of referrals but received something else.');
        }
      })
      .catch((error) => {
        console.error('Error fetching referrals:', error);
        setError('Error fetching referrals');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading referral data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const columns = [
    { key: 'patient', label: 'Full Name' },
    { key: 'test_type', label: 'Test Type' },
    { key: 'lab_name', label: 'Lab Name' },
  ];

  return (
    <div>
      <Table columns={columns} data={referrals} role={'Lab-technician'} />
    </div>
  );
};

export default ReferralTable;
