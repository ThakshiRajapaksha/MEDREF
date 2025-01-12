'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Table from '../../../components/table';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  contact: string;
  medicalHistory: string;
}

const PatientTable = () => {
  const router = useRouter(); // Initialize the router

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/patients');
        const data = await response.json();
        if (data.success && Array.isArray(data.patients)) {
          setPatients(data.patients);
        } else {
          setError('Unexpected response format');
        }
      } catch (error) {
        console.error('Failed to fetch patients:', error);
        setError('Failed to fetch patients.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleViewClick = (id: number) => {
    const path = `/Dashboard/Admin/Patient/${id}`;
    router.push(path);
  };

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
        <Table
          columns={patientColumns}
          data={patients}
          handleViewClick={handleViewClick}
        />
      )}
      {error && <p>{error}</p>}
    </>
  );
};

export default PatientTable;
