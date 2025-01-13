'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '../../../../../components/ui/input';
import { Textarea } from '../../../../../components/ui/textarea';
import { Button } from '../../../../../components/ui/button';
import { Label } from '../../../../../components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../../../components/ui/select';

export default function PatientRegisterForm() {
  const { id: adminId, patientId } = useParams(); // Access both adminId and patientId from the URL
  const router = useRouter();

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

  // Fetch patient data by patientId
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) {
        setErrorMessage('Patient ID is missing.');
        return;
      }

      try {
        const response = await fetch(`/api/patients/${patientId}`); // Fetch data by patientId
        const data = await response.json();

        if (response.ok && data.patient) {
          setFormData({
            first_name: data.patient.first_name || '',
            last_name: data.patient.last_name || '',
            age: data.patient.age.toString() || '',
            gender: data.patient.gender || '',
            contact: data.patient.contact || '',
            medicalHistory: data.patient.medicalHistory || '',
          });
        } else {
          setErrorMessage(data.message || 'Failed to fetch patient data.');
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
        setErrorMessage('An error occurred while fetching patient data.');
      }
    };

    fetchPatientData();
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

    if (!adminId || !patientId) {
      setErrorMessage(
        'Admin ID or Patient ID is missing. Cannot update patient.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch(`/api/patients/${patientId}`, {
        method: 'PUT', // Update patient data
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          adminId: parseInt(adminId as string), // Include adminId in the request
        }),
      });

      if (res.ok) {
        alert('Patient data updated successfully!');
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
    router.push(`/Dashboard/Admin/${adminId}/PatientTable`); // Corrected route
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
          Update Patient
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) =>
                setFormData({ ...formData, gender: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="contact">Contact Number</Label>
            <Input
              id="contact"
              name="contact"
              type="text"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="medicalHistory">Medical History</Label>
            <Textarea
              id="medicalHistory"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Updating...' : 'Update Patient'}
          </Button>

          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}
