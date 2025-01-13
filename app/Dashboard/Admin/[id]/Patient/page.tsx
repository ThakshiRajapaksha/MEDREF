'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../../components/ui/tabs';
import { Input } from '../../../../components/ui/input';
import { Textarea } from '../../../../components/ui/textarea';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../../components/ui/select';

export default function PatientRegisterForm() {
  const { id: adminId } = useParams();
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

  useEffect(() => {
    if (!adminId) {
      setErrorMessage('Admin ID is required to register a patient.');
    } else {
      setErrorMessage('');
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

    if (!adminId) {
      setErrorMessage('Admin ID is missing. Cannot register patient.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

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
          adminId: parseInt(adminId as string),
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
    router.push(`/Dashboard/Admin/${adminId}/PatientTable`);
  };

  return (
    <div className="flex flex-col justify-center min-h-screen bg-gray-100 p-4 md:p-8">
      <Tabs defaultValue="addPatient">
        <TabsList>
          <TabsTrigger value="addPatient">Add Patient</TabsTrigger>
          <TabsTrigger value="updatePatient">Update Patient</TabsTrigger>
        </TabsList>

        {/* Add Patient Tab */}
        <TabsContent value="addPatient">
          <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
              Register New Patient
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register Patient'}
              </Button>
              {errorMessage && (
                <p className="text-red-500 mt-2">{errorMessage}</p>
              )}
            </form>
          </div>
        </TabsContent>

        {/* Update Patient Tab */}
        <TabsContent value="updatePatient">
          <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
              Go to patients list
            </h2>
            <Button onClick={handleViewPatients} className="mb-4 p-2">
              View patients
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
