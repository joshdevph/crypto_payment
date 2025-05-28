'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMail, FiDollarSign, FiSend } from 'react-icons/fi';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRedirect = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    try {
      // Create a minimum delay promise
      const minimumDelay = new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create the API call promise
      const apiCall = fetch(API_BASE_URL + '/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, amount }),
      }).then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Checkout failed');
        }
        return response.json();
      });

      // Wait for both the API call and the minimum delay to complete
      const [result] = await Promise.all([apiCall, minimumDelay]);

      // Redirect with transaction_id from the API response
      router.push(`/payment?email=${encodeURIComponent(email)}&amount=${amount}&transaction_id=${result.transaction_id}&uri=${result.payment_url}`);
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Crypto Checkout</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleRedirect} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute top-2.5 left-3 text-gray-400" />
              <input
                type="email"
                id="email"
                className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (USD)
            </label>
            <div className="relative">
              <FiDollarSign className="absolute top-2.5 left-3 text-gray-400" />
              <input
                type="number"
                id="amount"
                className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <span className="animate-spin">↻</span>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FiSend className="text-lg" />
                <span>Pay with Crypto</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}