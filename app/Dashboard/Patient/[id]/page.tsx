'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function PatientRegisterForm() {
  const { id: patientId } = useParams();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    contact: '',
    medicalHistory: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) {
        setErrorMessage('Patient ID is required to fetch patient details.');
        return;
      }

      try {
        const res = await fetch(`/api/patients/${patientId}`);
        if (res.ok) {
          const data = await res.json();
          const patient = data.patient || data; // Adjust for the response structure

          setFormData({
            first_name: patient.first_name || '',
            last_name: patient.last_name || '',
            age: patient.age ? patient.age.toString() : '',
            gender: patient.gender || '',
            contact: patient.contact || '',
            medicalHistory: patient.medicalHistory || '',
          });
        } else {
          const errorData = await res.json();
          throw new Error(
            errorData.message || 'Failed to fetch patient details.'
          );
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.'
        );
      }
    };

    fetchPatient();
  }, [patientId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Patient details updated successfully!');
      } else {
        const { message } = await res.json();
        setErrorMessage(message || 'Failed to update patient details.');
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'An unexpected error occurred.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="first_name">First Name</label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange} // Correctly use handleChange
              required
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
              onChange={handleChange} // Correctly use handleChange
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="age">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange} // Correctly use handleChange
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange} // Correctly use handleChange
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="contact">Contact Number</label>
            <input
              id="contact"
              name="contact"
              type="text"
              value={formData.contact}
              onChange={handleChange} // Correctly use handleChange
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="medicalHistory">Medical History</label>
            <textarea
              id="medicalHistory"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange} // Correctly use handleChange
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {isSubmitting ? 'Updating...' : 'Update Patient'}
          </button>

          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}
