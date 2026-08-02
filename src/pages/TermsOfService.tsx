"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  const router = useRouter();
  const navigate = (path: string | -1) => { if (path === -1) router.back(); else router.push(path); };

  return (
    <div className="min-h-screen bg-white pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>

        <h1 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none text-gray-600 font-light space-y-6">
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using the AuraSkin Clinic website and services, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Medical Disclaimer</h2>
          <p>The content provided on this website is for informational purposes only and does not constitute professional medical advice, diagnosis, treatment, or recommendations of any kind. You should always seek the advice of our qualified healthcare professionals with any questions or concerns you may have regarding your skin or medical conditions.</p>
          <p>Results from aesthetic treatments vary from person to person. We do not guarantee specific outcomes, and all treatments require a formal clinical consultation prior to administration.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Appointments and Cancellations</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>All consultations and treatments must be booked in advance.</li>
            <li>We kindly request a minimum of 24 hours' notice for cancellations or rescheduling.</li>
            <li>Failure to attend an appointment without prior notice may result in a cancellation fee or forfeiture of booking deposits.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Payment Terms</h2>
          <p>Payment for services is due in full at the time of treatment unless a package or financing plan has been explicitly agreed upon. We accept major credit cards, bank transfers, and cash payments. Promotional prices are subject to change and may have specific expiration dates or conditions.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Modifications to Service</h2>
          <p>AuraSkin Clinic reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. You agree that AuraSkin Clinic shall not be liable to you or to any third party for any modification, suspension or discontinuance of the Service.</p>
        </div>
      </div>
    </div>
  );
}
