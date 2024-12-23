'use client';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../../../components/ui/tabs';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '../../../../../components/ui/input';
import { Textarea } from '../../../../../components/ui/textarea';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '../../../../../components/ui/select';
import { Button } from '../../../../../components/ui/button';
import { Label } from '../../../../../components/ui/label';

export default function DoctorPatientUpdateForm() {
  const { id: doctorId, patientId } = useParams();
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
            setValue('first_name', patientData.patient.first_name || '');
            setValue('last_name', patientData.patient.last_name || '');
            setValue(
              'medical_history',
              patientData.patient.medicalHistory || ''
            );
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

  const handleTestTypeChange = (value: string) => {
    const selectedTestTypeId = parseInt(value, 10);

    const selectedTestType = testTypes.find(
      (type) => type.id === selectedTestTypeId
    );

    if (selectedTestType) {
      // Update form state with the selected test type's name and lab name
      setValue('test_type', selectedTestType.name);
      setValue('lab', selectedTestType.lab?.name);

      // Update selectedTestType state to store the selected ID (as string)
      setSelectedTestType(value);
    } else {
      console.error('Selected test type not found.');
    }
  };

  const onSubmit = async (formData: any) => {
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
          referral_status: 'Pending',
          medical_history: formData.medical_history,
          doctorId: doctorId,
        }),
      });

      if (res.ok) {
        alert('Patient data updated successfully!');
        router.push(`/Dashboard/Doctor/${doctorId}/Referrals`);
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
    router.push(`/Dashboard/Doctor/${doctorId}/Referrals`);
  };

  return (
    <div className="flex flex-col justify-start min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="w-full max-w-4xl p-8 shadow-lg rounded-lg">
        <Tabs defaultValue="form" className="w-full">
          <TabsList className="flex justify-start">
            <TabsTrigger value="form">Form</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
          <TabsContent value="form">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center space-y-6 mt-4 w-full bg-white p-6 shadow-lg rounded"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Controller
                    name="first_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="first_name"
                        type="text"
                        disabled
                        className="w-full p-2 mt-1"
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Controller
                    name="last_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="last_name"
                        type="text"
                        disabled
                        className="w-full p-2 mt-1"
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="illness">Illness</Label>
                  <Controller
                    name="illness"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="illness"
                        type="text"
                        className="w-full p-2 mt-1"
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Controller
                    name="allergies"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="allergies"
                        type="text"
                        className="w-full p-2 mt-1"
                      />
                    )}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="test_type">Test Type</Label>
                  <Select
                    value={selectedTestType}
                    onValueChange={handleTestTypeChange}
                  >
                    <SelectTrigger className="w-full p-2 mt-1 border border-gray-300 rounded">
                      <SelectValue>
                        {selectedTestType
                          ? testTypes.find(
                              (type) => type.id.toString() === selectedTestType
                            )?.name
                          : 'Select a Test Type'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white shadow-lg border border-gray-300 rounded">
                      {testTypes.length === 0 ? (
                        <SelectItem value="no-options">
                          No test types available
                        </SelectItem>
                      ) : (
                        testTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lab">Lab</Label>
                  <Controller
                    name="lab"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="lab"
                        type="text"
                        disabled
                        className="w-full p-2 mt-1"
                      />
                    )}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="medical_history">Medical History</Label>
                  <Controller
                    name="medical_history"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        id="medical_history"
                        rows={4}
                        className="w-full p-2 mt-1"
                      />
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-64 p-2 mt-1"
              >
                {isSubmitting ? 'Updating...' : 'Submit Referral'}
              </Button>

              {errorMessage && (
                <p className="text-red-500 mt-2">{errorMessage}</p>
              )}
            </form>
          </TabsContent>
          <TabsContent value="list">
            <Button onClick={handleViewPatients} className="mb-4 p-2">
              View referrals
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
