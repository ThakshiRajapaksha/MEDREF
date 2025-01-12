'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Table from '../../../../components/table';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  medicalHistory: string;
}

const PatientTable = () => {
  const { id: doctorId } = useParams();
  const router = useRouter(); // Initialize the router

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (doctorId) {
      fetch(`/api/patients?doctorId=${doctorId}`) // Call your API route for patients
        .then((response) => response.json())
        .then((data) => {
          console.log('Fetched patient data:', data); // Log the response data
          if (data.success && Array.isArray(data.patients)) {
            setPatients(data.patients);
          } else {
            setError('Unexpected response format');
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching patient data:', error);
          setError(error.message);
          setLoading(false);
        });
    }
  }, [doctorId]);

  const handleViewClick = (id: string) => {
    const path = `/Dashboard/Doctor/${doctorId}/Patient/${id}`;
    router.push(path);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
        handleViewClick={handleViewClick} // Pass the handleViewClick function
      />
    </div>
  );
};

export default PatientTable;
