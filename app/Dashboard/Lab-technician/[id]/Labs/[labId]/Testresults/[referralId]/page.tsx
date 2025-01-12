'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '../../../../../../../components/ui/button';
import { Input } from '../../../../../../../components/ui/input';
import { Label } from '../../../../../../../components/ui/label';
import { Textarea } from '../../../../../../../components/ui/textarea';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../../../../../../../components/ui/tabs';
import axios from 'axios';

export default function LabTechnicianReferralDetails() {
  const { referralId } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('details');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    medical_history: '',
    test_type: '',
    lab: '',
    referral_status: '',
    test_report: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFileValid, setIsFileValid] = useState(true);

  useEffect(() => {
    if (referralId) {
      fetch(`/api/referrals/${referralId}`)
        .then((response) => {
          if (!response.ok) throw new Error('Failed to fetch referral data');
          return response.json();
        })
        .then((data) => {
          if (data.success && data.referral) {
            setFormData({
              first_name: data.referral.patient.first_name || '',
              last_name: data.referral.patient.last_name || '',
              medical_history: data.referral.patient.medical_history || '',
              test_type: data.referral.test_type || '',
              lab: data.referral.lab || '',
              referral_status: data.referral.referral_status || '',
              test_report: null,
            });
          } else {
            setErrorMessage('Referral data not found.');
          }
        })
        .catch((error) => {
          console.error('Error fetching referral data:', error);
          setErrorMessage('Failed to fetch referral data.');
        });
    }
  }, [referralId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files && files[0];

    if (
      file &&
      file.type === 'application/pdf' &&
      file.size <= 5 * 1024 * 1024
    ) {
      setFormData((prev) => ({
        ...prev,
        test_report: file,
      }));
      setIsFileValid(true);
    } else {
      setIsFileValid(false);
      setFormData((prev) => ({
        ...prev,
        test_report: null,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('Handle Submit Triggered');

    if (!formData.test_report) {
      setErrorMessage('Please upload a valid test report.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      console.log('Selected File:', formData.test_report);

      const formDataToSend = new FormData();
      formDataToSend.append('status', 'Completed');
      formDataToSend.append('test_report', formData.test_report);

      console.log(formDataToSend); // Log the FormData to see if it includes 'test_report'

      const res = await axios.put(
        `/api/referrals/${referralId}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.status === 200) {
        alert('Test report uploaded successfully!');
        setActiveTab('referral table');
      } else {
        setErrorMessage(res.data.message || 'Failed to upload test report.');
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  function handleViewPatients(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault();
    router.push('/dashboard/lab-technician/referrals');
  }

  return (
    <div className="flex flex-col justify-start min-h-screen bg-gray-100 p-4 md:p-8">
      <Tabs defaultValue="details" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Form</TabsTrigger>
          <TabsTrigger value="referral table">Submitted Referral</TabsTrigger>
        </TabsList>
        <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="details">
              <h2 className="text-xl font-bold text-gray-700">
                Patient Information
              </h2>

              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  disabled
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  disabled
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="medical_history">Medical History</Label>
                <Textarea
                  id="medical_history"
                  value={formData.medical_history}
                  disabled
                  rows={4}
                  className="mt-1"
                />
              </div>

              <h2 className="text-xl font-bold text-gray-700">
                Referral Details
              </h2>

              <div>
                <Label htmlFor="test_type">Test Type</Label>
                <Input
                  id="test_type"
                  value={formData.test_type}
                  disabled
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="test_report">
                  Upload Test Report (PDF, Max 5MB)
                </Label>
                <input type="file" accept=".pdf" onChange={handleFileChange} />
                {!isFileValid && (
                  <p className="text-sm text-red-500 mt-2">
                    Invalid file. Please upload a PDF no larger than 5MB.
                  </p>
                )}
              </div>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <div className="mt-4">
                {activeTab === 'details' && (
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isFileValid}
                    className="w-full"
                  >
                    {isSubmitting ? 'Uploading...' : 'Submit'}
                  </Button>
                )}
              </div>
            </TabsContent>
          </form>
          <TabsContent value="referral table">
            <Button onClick={handleViewPatients} className="mb-4 p-2">
              View referrals
            </Button>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
