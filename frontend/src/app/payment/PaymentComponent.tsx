'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FiXCircle, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';

type StatusType = 'success' | 'failed' | 'processing' | null;

export default function PaymentComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transaction_id = searchParams.get('transaction_id') || '';
  const email = searchParams.get('email') || '';
  const amount = searchParams.get('amount') || '';
  const payment_url = searchParams.get('url') || '';

  const [status, setStatus] = useState<StatusType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFullLoading, setShowFullLoading] = useState(false);

  useEffect(() => {
    if (!transaction_id) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [transaction_id, router]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const handlePaymentConfirm = async () => {
    if (!transaction_id) return;
    
    setIsLoading(true);
    setShowFullLoading(true);
    setStatus('processing');
    
    try {
      // Create minimum delay promise
      const minimumDelay = new Promise(resolve => setTimeout(resolve, 2000));
      
    const mockedCoinbaseAPI = fetch(payment_url, {
        method: 'POST',
    })
    .then(async (response) => {
        if (!response.ok) {
            console.warn('Primary webhook failed, proceeding anyway.');
        }

        const apiCall = fetch(API_BASE_URL + '/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            event_id: 'evt_' + Math.random().toString(36).substring(2, 11),
            transaction_id,
            email,
            amount: parseFloat(amount),
            status: 'complete',
        }),
        }).then(async (response) => {
        if (!response.ok) {
            console.warn('Secondary webhook failed, proceeding anyway.');
        }
        return response.json().catch(() => ({})); // Handle malformed JSON
        });

        await Promise.all([apiCall, minimumDelay]);

        return response.json().catch(() => ({})); // Return valid object even if JSON is malformed
    })
    .catch((err) => {
        console.error('Unexpected error in mockedCoinbaseAPI:', err);
        return Promise.resolve({}); // Always resolve
    });


      // Wait for both API call and minimum delay
      
      setStatus('success');
      setShowFullLoading(false);
      
      // Redirect after showing success for 2 seconds
      setTimeout(() => {
        router.push('/wallet');
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus('failed');
      setShowFullLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!transaction_id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-600">Missing transaction details</p>
        <p className="text-sm text-gray-500">Redirecting you back...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 relative">
      {/* Full-page loading overlay */}
      {showFullLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Processing your payment...</p>
        </div>
      )}

      <div className={`w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${showFullLoading ? 'opacity-30 pointer-events-none' : ''}`}>
        <div className="bg-blue-600 p-6 text-white">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-1 text-blue-100 hover:text-white mb-2"
          >
            <FiArrowLeft /> Back
          </button>
          <h1 className="text-2xl font-bold">Crypto Payment</h1>
          <p className="text-blue-100">Complete your transaction</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Email:</span>
              <span className="text-black font-medium">{email}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Amount:</span>
              <span className="text-black font-bold text-blue-600">${amount}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Trans. ID:</span>
              <span className="text-black font-mono text-sm break-all">{transaction_id}</span>
            </div>
          </div>

          {status !== 'success' && (
            <button
              onClick={handlePaymentConfirm}
              disabled={isLoading || !!status}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                isLoading || status === 'processing'
                  ? 'bg-blue-400'
                  : status
                  ? 'bg-gray-300'
                  : 'bg-blue-600 hover:bg-blue-700'
              } flex items-center justify-center`}
            >
              {isLoading || status === 'processing' ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {status === 'processing' ? 'Processing Payment...' : 'Confirm Payment'}
                </>
              ) : (
                'Confirm Payment'
              )}
            </button>
          )}

          {status && !showFullLoading && (
            <div
              className={`animate-fade-in-up rounded-lg p-4 ${
                status === 'success'
                  ? 'bg-green-50 text-green-800'
                  : status === 'failed'
                  ? 'bg-red-50 text-red-800'
                  : 'bg-blue-50 text-blue-800'
              }`}
            >
              <div className="flex items-center">
                {status === 'success' ? (
                  <>
                    <FiCheckCircle className="h-6 w-6 mr-2 text-green-500" />
                    <span>Payment successful! Redirecting...</span>
                  </>
                ) : status === 'failed' ? (
                  <>
                    <FiXCircle className="h-6 w-6 mr-2 text-red-500" />
                    <span>Payment failed. Please try again.</span>
                  </>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}