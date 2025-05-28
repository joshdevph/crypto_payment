'use client';

import { useState, useEffect } from 'react';
import { FiArrowUp, FiArrowDown, FiCopy, FiPlus, FiSend, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';

type Transaction = {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  address?: string;
};

export default function WalletPage() {
  const [balance, setBalance] = useState(2843.56);
  const [address, setAddress] = useState('0x71C7...42e1');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'assets' | 'activity'>('assets');

  useEffect(() => {
    const timer = setTimeout(() => {
      setTransactions([
        {
          id: 'txn_1',
          type: 'deposit',
          amount: 1200,
          currency: 'USD',
          date: '2023-05-15T10:30:00Z',
          status: 'completed',
          address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
        },
        {
          id: 'txn_2',
          type: 'withdrawal',
          amount: 450.50,
          currency: 'USD',
          date: '2023-05-14T14:45:00Z',
          status: 'completed',
          address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
        },
        {
          id: 'txn_3',
          type: 'transfer',
          amount: 200,
          currency: 'USD',
          date: '2023-05-12T09:15:00Z',
          status: 'completed',
          address: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'
        },
        {
          id: 'txn_4',
          type: 'deposit',
          amount: 893.06,
          currency: 'USD',
          date: '2023-05-10T16:20:00Z',
          status: 'completed',
          address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
        }
      ]);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const copyAddress = () => {
    navigator.clipboard.writeText('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
    setAddress('Copied!');
    setTimeout(() => setAddress('0x71C7...42e1'), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <FiRefreshCw className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 shadow-lg mb-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">Total Balance</p>
              <h2 className="text-3xl font-bold mt-1">${balance.toLocaleString()}</h2>
            </div>
            <button
              onClick={copyAddress}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-xs font-medium transition-colors"
            >
              <span>{address}</span>
              <FiCopy size={12} />
            </button>
          </div>

          <div className="flex justify-between mt-8">
            {[
              { icon: FiArrowDown, label: 'Receive' },
              { icon: FiArrowUp, label: 'Send' },
              { icon: FiPlus, label: 'Buy' },
              { icon: FiSend, label: 'Swap' },
            ].map(({ icon: Icon, label }) => (
              <button key={label} className="flex flex-col items-center justify-center w-20">
                <div className="bg-white/20 p-3 rounded-full mb-1">
                  <Icon className="text-white" />
                </div>
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {['assets', 'activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'assets' | 'activity')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'assets' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-900">Your Assets</h3>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">$</span>
                  </div>
                  <div>
                    <p className="text-black font-medium">US Dollar</p>
                    <p className="text-sm text-gray-500">USD</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-black font-medium">${balance.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">≈ ${balance.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold">E</span>
                  </div>
                  <div>
                    <p className="text-black font-medium">Ethereum</p>
                    <p className="text-sm text-gray-500">ETH</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-black font-medium">0.42 ETH</p>
                  <p className="text-sm text-gray-500">≈ $784.32</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'activity' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900">Recent Transactions</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {transactions.map((txn) => (
                    <div key={txn.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium capitalize">{txn.type}</p>
                          <p className="text-sm text-gray-500">{formatDate(txn.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {txn.type === 'withdrawal' ? '-' : '+'}${txn.amount.toFixed(2)}
                          </p>
                          <p className={`text-sm ${txn.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                            {txn.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}
