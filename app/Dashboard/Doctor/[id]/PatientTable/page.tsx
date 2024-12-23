'use client';
import React, { useState, useEffect } from 'react';
import Table from '../../../../components/table';

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  medicalHistory: string;
  createdBy: {
    first_name: string;
    last_name: string;
  };
}

const PatientTable = () => {
  const [patients, setPatients] = useState<Patient[]>([]); // Changed state type to Patient[]
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/patients')  // Call your API route
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched patient data:', data);
        if (Array.isArray(data.patients)) {
          setPatients(data.patients);
        } else {
          setError('Expected array of patients but received something else.');
        }
      })
      .catch((error) => {
        console.error('Error fetching patients:', error);
        setError('Error fetching patients');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading patient data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Define columns based on Patient type
  const columns: { key: keyof Patient; label: string }[] = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'medicalHistory', label: 'Medical History' },
  ];

  return (
    <div>
      <Table
        columns={columns}
        data={patients} // Pass the fetched patient data
        role="Doctor"
      />
    </div>
  );
};

export default PatientTable;
