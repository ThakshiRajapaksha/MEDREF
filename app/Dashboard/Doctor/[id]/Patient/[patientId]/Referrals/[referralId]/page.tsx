'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../../../../../components/ui/tabs';
import { Input } from '../../../../../../../components/ui/input';
import { Textarea } from '../../../../../../../components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../../../../../components/ui/select';
import { Button } from '../../../../../../../components/ui/button';
import { Label } from '../../../../../../../components/ui/label';

export default function DoctorPatientUpdateForm() {
  const { id: doctorId, patientId, referralId } = useParams();
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

  const [testTypes, setTestTypes] = useState<TestType[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTestType, setSelectedTestType] = useState<string>('');
  const [selectedLab, setSelectedLab] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('details');

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      illness: '',
      allergies: '',
      test_type: '',
      lab: '',
      referral_status: '',
      medical_history: '',
    },
  });

  const fetchData = async (url: string, errorMsg: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(errorMsg);
      return await response.json();
    } catch (error) {
      console.error(errorMsg, error);
      throw error;
    }
  };

  // Fetch referral and patient data
  useEffect(() => {
    const fetchPatientAndReferralData = async () => {
      try {
        const referralData = await fetchData(
          `/api/referrals/${referralId}`,
          'Failed to fetch referral data'
        );
        const patientData = await fetchData(
          `/api/patients/${patientId}`,
          'Failed to fetch patient data'
        );

        setValue('first_name', patientData.patient.first_name || '');
        setValue('last_name', patientData.patient.last_name || '');
        setValue('medical_history', patientData.patient.medicalHistory || '');
        setValue('illness', referralData.referral.illness || '');
        setValue('allergies', referralData.referral.allergies || '');
        setValue('test_type', referralData.referral.test_type || '');
        setValue('lab', referralData.referral.lab_name || '');
        setValue('referral_status', referralData.referral.status || '');

        setSelectedTestType(referralData.referral.test_type || '');
        setSelectedLab(referralData.referral.lab_name || '');
      } catch (error) {
        setErrorMessage('Failed to fetch data.');
      }
    };

    fetchPatientAndReferralData();
  }, [patientId, referralId, setValue]);

  // Fetch test types
  useEffect(() => {
    fetchData('/api/test_type', 'Failed to fetch test types')
      .then((data) => {
        if (data.success) {
          setTestTypes(data.testTypes || []);
        } else {
          setErrorMessage('Failed to load test types.');
        }
      })
      .catch((error) => {
        setErrorMessage('Failed to load test types.');
      });
  }, []);

  const onSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // Find the test ID and lab ID corresponding to the selected test and lab
      const selectedTest = testTypes.find(
        (test) => test.name === formData.test_type
      );
      const selectedLab = selectedTest?.lab;

      if (!selectedTest || !selectedLab) {
        setErrorMessage('Test type or lab is not valid.');
        return;
      }

      // Modify the API endpoint to update the referral
      const res = await fetch(`/api/referrals/${referralId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          illness: formData.illness,
          allergies: formData.allergies,
          test_id: selectedTest.id, // Use the test_id
          lab_id: selectedLab.id, // Use the lab_id
          referral_status: formData.referral_status,
          medical_history: formData.medical_history, // Assuming this is part of the referral data
        }),
      });

      if (res.ok) {
        alert('Referral updated successfully!');
        router.push(`/Dashboard/Doctor/${doctorId}/ReferralTable`);
      } else {
        const { message } = await res.json();
        setErrorMessage(message || 'Failed to update referral data.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewPatients = () => {
    router.push(`/Dashboard/Doctor/${doctorId}/ReferralTable`);
  };

  return (
    <div className="flex flex-col justify-start min-h-screen bg-gray-100 p-4 md:p-8">
      <Tabs defaultValue="details" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="medicalHistory">Medical History</TabsTrigger>
          <TabsTrigger value="referralList">Referral List</TabsTrigger>
        </TabsList>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center space-y-6 mt-4 w-full bg-white p-6 shadow-lg rounded"
        >
          <div className="w-full max-w-4xl p-8 shadow-lg rounded-lg">
            <TabsContent value="details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Controller
                    name="first_name"
                    control={control}
                    render={({ field }) => (
                      <Input className="w-full p-2" {...field} />
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Controller
                    name="last_name"
                    control={control}
                    render={({ field }) => (
                      <Input className="w-full p-2" {...field} />
                    )}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="illness">Illness</Label>
                <Controller
                  name="illness"
                  control={control}
                  render={({ field }) => (
                    <Input className="w-full p-2" {...field} />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="allergies">Allergies</Label>
                <Controller
                  name="allergies"
                  control={control}
                  render={({ field }) => (
                    <Input className="w-full p-2" {...field} />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="test_type">Test Type</Label>
                <Controller
                  name="test_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={selectedTestType}
                      onValueChange={(value) => {
                        setSelectedTestType(value);
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger className="w-full p-2">
                        <SelectValue placeholder="Select a test type" />
                      </SelectTrigger>
                      <SelectContent>
                        {testTypes.map((testType) => (
                          <SelectItem key={testType.id} value={testType.name}>
                            {testType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="lab">Lab</Label>
                <Controller
                  name="lab"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={selectedLab}
                      onValueChange={(value) => {
                        setSelectedLab(value);
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger className="w-full p-2">
                        <SelectValue placeholder="Select a lab" />
                      </SelectTrigger>
                      <SelectContent>
                        {testTypes
                          .map((testType) => testType.lab)
                          .filter(
                            (lab, index, self) =>
                              self.findIndex((l) => l.id === lab.id) === index
                          ) // Remove duplicate labs
                          .map((lab) => (
                            <SelectItem key={lab.id} value={lab.name}>
                              {lab.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="referral_status">Referral Status</Label>
                <Controller
                  name="referral_status"
                  control={control}
                  render={({ field }) => (
                    <Input className="w-full p-2" {...field} />
                  )}
                />
              </div>
            </TabsContent>
            <TabsContent value="medicalHistory">
              <Label htmlFor="medical_history">Medical History</Label>
              <Controller
                name="medical_history"
                control={control}
                render={({ field }) => (
                  <Textarea className="w-full p-2" {...field} />
                )}
              />
            </TabsContent>
            <TabsContent value="referralList">
              <Button onClick={handleViewPatients} className="mb-4 p-2">
                View referrals
              </Button>
            </TabsContent>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {activeTab === 'details' && (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-64 p-2 mt-4"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            )}
          </div>
        </form>
      </Tabs>
    </div>
  );
}
