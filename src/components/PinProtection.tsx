"use client";

import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

export default function PinProtection({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '271302') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setError('');
    } else {
      setError('Incorrect PIN code');
      setPin('');
    }
  };

  if (!mounted) return null;

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-4 absolute inset-0 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">Admin Access</h1>
        <p className="text-gray-500 mb-8">Please enter your PIN code to continue.</p>
        
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-6">
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full text-center text-3xl tracking-[0.5em] font-mono p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="••••••"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-primary/90 active:scale-95 transition-all"
          >
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
