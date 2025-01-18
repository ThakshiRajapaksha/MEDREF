'use client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Table from '../../../../components/table';

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
  const router = useRouter();
  const { id: adminId } = useParams(); // Fetch adminId from the URL

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/patients'); // Fetch patient data from the API
        const data = await response.json();

        if (data.success && Array.isArray(data.patients)) {
          setPatients(data.patients); // Update the patient state
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

  const handleViewClick = async (id: string) => {
    try {
      const response = await fetch(`/api/patients/${id}`);
      const data = await response.json();

      if (!data.success || !data.patient) {
        throw new Error('Failed to fetch referral details.');
      }

      const patientId = data.patient.id;

      if (!patientId) {
        alert('Cannot navigate. Patient ID is missing.');
        return;
      }

      // Use the patientId from the referral data
      const path = `/Dashboard/Admin/${adminId}/Patient/${patientId}`;
      router.push(path);
    } catch (error) {
      console.error('Error fetching referral details:', error);
      alert('Failed to fetch referral details.');
    }
  };

  // Define columns for the patient table
  const patientColumns = [
    { key: 'id', label: 'Patient Id' },
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'age', label: 'Age' },
    { key: 'gender', label: 'Gender' },
    { key: 'contact', label: 'Contact Number' },
    { key: 'medicalHistory', label: 'Medical History' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Patient List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Table
          columns={patientColumns}
          data={patients}
          handleViewClick={handleViewClick}
        />
      )}
    </div>
  );
};

export default PatientTable;
