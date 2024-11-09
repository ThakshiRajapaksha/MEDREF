'use client';
import React, { useEffect, useState } from 'react';
import Table from '../../../components/table';

// Define the Patient interface with the required fields
interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  contact: string; // Ensure this matches the API response
  medicalHistory: string; // Ensure this matches the API response
}

export default function PatientData() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      setLoading(true);
      try {
        const response = await fetch('/api/patients');
        const data = await response.json();
        console.log('Fetched Patients:', data);
        if (data.success && Array.isArray(data.patients)) {
          setPatients(data.patients); // Store fetched patients in state
          console.log('Patients set:', data.patients); // Log the patients array
        } else {
          console.error(
            'Fetched data does not contain a patients array:',
            data
          );
        }
      } catch (error) {
        console.error('Failed to fetch patients:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, []);

  // Define columns for the patient table
  const patientColumns = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'age', label: 'Age' },
    { key: 'gender', label: 'Gender' },
    { key: 'contact', label: 'Contact Number' },
    { key: 'medicalHistory', label: 'Medical History' },
  ];

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table columns={patientColumns} data={patients} role={'Admin'} />
      )}
    </>
  );
}
