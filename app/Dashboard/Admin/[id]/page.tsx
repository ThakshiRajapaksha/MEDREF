'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Import useRouter for navigation

export default function PatientRegisterForm() {
  const { id: adminId } = useParams(); // Access adminId from the URL params
  const router = useRouter(); // Initialize useRouter for navigation

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

  // Validate and set error if adminId is missing
  useEffect(() => {
    if (!adminId) {
      setErrorMessage('Admin ID is required to register a patient.');
    } else {
      setErrorMessage(''); // Clear error if adminId is present
    }
  }, [adminId]);

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

    // Check if adminId is present
    if (!adminId) {
      setErrorMessage('Admin ID is missing. Cannot register patient.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(''); // Clear error message on new submission attempt

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          age: parseInt(formData.age),
          gender: formData.gender,
          contact: formData.contact,
          medicalHistory: formData.medicalHistory,
          adminId: parseInt(adminId as string), // Convert adminId to a number
        }),
      });

      if (res.ok) {
        alert('Patient registered successfully!');
        setFormData({
          first_name: '',
          last_name: '',
          age: '',
          gender: '',
          contact: '',
          medicalHistory: '',
        });
      } else {
        const { message } = await res.json();
        setErrorMessage(message || 'Failed to register patient');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewPatients = () => {
    router.push('/Dashboard/Admin//PatientTable');
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !adminId}
            className="w-full p-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {isSubmitting ? 'Registering...' : 'Register Patient'}
          </button>

          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}
