"use client";

import { Info, ExternalLink } from 'lucide-react';

export const PrototypeNotice = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`bg-blue-50 border border-blue-200 text-blue-800 p-4 md:p-5 rounded-2xl shadow-sm flex flex-col md:flex-row gap-3 md:items-center ${className}`}>
      <div className="bg-blue-100 p-2 rounded-xl shrink-0 self-start md:self-center">
        <Info className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1 text-sm leading-relaxed">
        <span className="font-bold">Prototype Notice:</span> This is the public website to see information about AuraSkin and book appointments. 
      </div>
    </div>
  );
};
