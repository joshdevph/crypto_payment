// src/app/payment/page.tsx
import { Suspense } from 'react';
import PaymentComponent from './PaymentComponent';

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-600">Loading payment details...</p>
      </div>
    }>
      <PaymentComponent />
    </Suspense>
  );
}