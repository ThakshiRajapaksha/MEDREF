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
      setErrorMessage('Admin ID or Patient ID is missing.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const updatedData = {
        ...formData,
        adminId: parseInt(adminId as string),
        age: parseInt(formData.age, 10),
      };

      const res = await fetch(`/api/patients/${patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedData,
          updatedById: parseInt(adminId as string), // Ensure updatedById is sent
        }),
      });

      if (res.ok) {
        alert('Patient data updated successfully!');
        router.push(`/Dashboard/Admin/${adminId}/PatientTable`);
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

  return (
    <div className="flex flex-col justify-start min-h-screen bg-gray-100 p-4 md:p-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-6 mt-4 w-full bg-white p-6 shadow-lg rounded"
      >
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
          Update Patient
        </h2>
        <div className="space-y-2 col-span-2">
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

        <div className="space-y-2 col-span-2">
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

        <div className="space-y-2 col-span-2">
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

        <div className="space-y-2 col-span-2">
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

        <div className="space-y-2 col-span-2">
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

        <div className="space-y-2 col-span-2">
          <Label htmlFor="medicalHistory">Medical History</Label>
          <Textarea
            id="medicalHistory"
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div className="mt-4 flex justify-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-64 p-2 mt-4"
          >
            {isSubmitting ? 'Updating...' : 'Update Patient'}
          </Button>
        </div>

        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </form>
    </div>
  );
}
