'use client';

import React, { useState, useEffect } from 'react';
import Table from '../../../components/table';

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  medicalHistory: string;
}

const PatientTable = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/patients')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched patient data:', data); // Log the response data

        // Check if the patients data is available and is an array
        if (Array.isArray(data.patients)) {
          // Map through the patients and extract the required fields
          const patientData = data.patients.map(
            (patient: {
              // Explicitly typing 'patient'
              id: string;
              first_name: string;
              last_name: string;
              medicalHistory: string;
            }) => ({
              id: patient.id,
              first_name: patient.first_name,
              last_name: patient.last_name,
              medicalHistory: patient.medicalHistory || 'No data', // Handle missing data
            })
          );
          setPatients(patientData);
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

  // Log patients after fetch to verify that data is being correctly set
  console.log('Patients after fetch:', patients);

  // Define the columns for the table
  const columns = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'medicalHistory', label: 'Medical History' },
  ];

  // Handle loading state
  if (loading) {
    return <div>Loading patient data...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Table
        columns={columns}
        data={patients} // Use the updated patients data
        role="Doctor"
      />
    </div>
  );
};

export default PatientTable;
