'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function LabTechnicianReferralDetails() {
  const { referralId } = useParams(); // Get referral ID from URL params
  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    medical_history: '',
    test_type: '',
    lab: '',
    referral_status: '',
    test_report: null as File | null, // Correctly define the type here
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (referralId) {
      // Fetch referral details using referralId
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; // FileList or null
    setFormData((prev) => ({
      ...prev,
      test_report: files && files.length > 0 ? files[0] : null, // Set File or null
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('referral_status', 'Completed');

      if (formData.test_report) {
        formDataToSend.append('test_report', formData.test_report); // Add file if available
      }

      const res = await fetch(`/api/referrals/${referralId}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (res.ok) {
        alert('Test report uploaded successfully!');
        router.push('/Dashboard/LabTechnician/Referrals');
      } else {
        const { message } = await res.json();
        setErrorMessage(message || 'Failed to upload test report.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
        <button
          onClick={() => router.push('/Dashboard/Lab-technician/ReferralTable')}
          className="mb-4 p-2 text-white bg-green-600 rounded hover:bg-green-700"
        >
          Back to Referrals
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold">Patient Information</h2>

          <div>
            <label htmlFor="first_name">First Name</label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              disabled
              className="w-full p-2 mt-1 border border-gray-300 rounded bg-gray-100"
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
              className="w-full p-2 mt-1 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div>
            <label htmlFor="medical_history">Medical History</label>
            <textarea
              id="medical_history"
              name="medical_history"
              value={formData.medical_history}
              disabled
              rows={4}
              className="w-full p-2 mt-1 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <h2 className="text-xl font-bold">Referral Details</h2>

          <div>
            <label htmlFor="test_type">Test Type</label>
            <input
              id="test_type"
              name="test_type"
              type="text"
              value={formData.test_type}
              disabled
              className="w-full p-2 mt-1 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div>
            <label htmlFor="lab">Lab</label>
            <input
              id="lab"
              name="lab"
              type="text"
              value={formData.lab}
              disabled
              className="w-full p-2 mt-1 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          <div>
            <label htmlFor="test_report">Upload Test Report (PDF)</label>
            <input
              id="test_report"
              name="test_report"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {isSubmitting ? 'Uploading...' : 'Submit Test Report'}
          </button>

          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}
