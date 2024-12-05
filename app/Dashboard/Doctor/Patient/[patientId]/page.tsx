'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function DoctorPatientUpdateForm() {
  const { patientId } = useParams();
  const router = useRouter();

  interface Lab {
    id: number;
    name: string;
  }

  interface TestType {
    id: number;
    name: string;
    lab: Lab;
  }

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    illness: '',
    allergies: '',
    test_type: '',
    lab: '',
    referral_status: '',
    medical_history: '',
  });

  const [testTypes, setTestTypes] = useState<TestType[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch patient data
  useEffect(() => {
    if (patientId) {
      fetch(`/api/patients/${patientId}`)
        .then((response) => {
          if (!response.ok) throw new Error('Failed to fetch patient data');
          return response.json();
        })
        .then((patientData) => {
          if (patientData.success && patientData.patient) {
            setFormData({
              first_name: patientData.patient.first_name || '',
              last_name: patientData.patient.last_name || '',
              illness: '',
              allergies: '',
              test_type: '',
              lab: '',
              referral_status: '',
              medical_history: patientData.patient.medicalHistory || '',
            });
          } else {
            setErrorMessage('Patient data not found.');
          }
        })
        .catch((error) => {
          console.error('Error fetching patient data:', error);
          setErrorMessage('Failed to fetch patient data.');
        });
    }
  }, [patientId]);

  // Fetch test types
  useEffect(() => {
    fetch('/api/test_type')
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            console.error('Error fetching test types:', errorData);
            throw new Error('Failed to fetch test types');
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setTestTypes(data.testTypes || []);
        } else {
          setErrorMessage('Failed to load test types.');
        }
      })
      .catch((error) => {
        console.error('Error fetching test types:', error);
        setErrorMessage('Failed to fetch test types.');
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTestTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTestTypeId = parseInt(e.target.value, 10);
    const selectedTestType = testTypes.find((type) => type.id === selectedTestTypeId);

    if (selectedTestType) {
      setFormData((prev) => ({
        ...prev,
        test_type: selectedTestType.name,
        lab: selectedTestType.lab.name,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch(`/api/patients/${patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          illness: formData.illness,
          allergies: formData.allergies,
          test_type: formData.test_type,
          lab: formData.lab,
          referral_status: 'Sent',  // Assuming referral status is always 'Sent' after update
          medical_history: formData.medical_history,
        }),
      });

      if (res.ok) {
        alert('Patient data updated successfully!');
        router.push('/Dashboard/Doctor/PatientTable');
      } else {
        const { message } = await res.json();
        setErrorMessage(message || 'Failed to update patient data.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewPatients = () => {
    router.push('/Dashboard/Doctor/PatientTable');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
        <button
          onClick={handleViewPatients}
          className="mb-4 p-2 text-white bg-green-600 rounded hover:bg-green-700"
        >
          View Patients
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="first_name">First Name</label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              disabled
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="last_name">Last Name</label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              disabled
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="illness">Illness</label>
            <input
              id="illness"
              name="illness"
              type="text"
              value={formData.illness}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="allergies">Allergies</label>
            <input
              id="allergies"
              name="allergies"
              type="text"
              value={formData.allergies}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="test_type">Test Type</label>
            <select
              id="test_type"
              name="test_type"
              value={formData.test_type}
              onChange={handleTestTypeChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            >
              <option value="">Select a Test Type</option>
              {testTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="lab">Lab</label>
            <input
              id="lab"
              name="lab"
              type="text"
              value={formData.lab}
              disabled
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="medical_history">Medical History</label>
            <textarea
              id="medical_history"
              name="medical_history"
              value={formData.medical_history}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {isSubmitting ? 'Updating...' : 'Update Patient Info'}
          </button>

          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}
