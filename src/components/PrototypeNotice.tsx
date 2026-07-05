import { Info, ExternalLink } from 'lucide-react';

export const PrototypeNotice = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`bg-blue-50 border border-blue-200 text-blue-800 p-4 md:p-5 rounded-2xl shadow-sm flex flex-col md:flex-row gap-3 md:items-center ${className}`}>
      <div className="bg-blue-100 p-2 rounded-xl shrink-0 self-start md:self-center">
        <Info className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1 text-sm leading-relaxed">
        <span className="font-bold">Prototype Notice:</span> This is the public website to see information about AuraSkin and book appointments. 
        To test the confirmation, declining, and canceling workflow, please visit the admin site:
        <a 
          href="https://admin-auraskin-prototype.vercel.app/" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-bold ml-1 text-blue-700 hover:text-blue-900 underline underline-offset-2 transition-colors whitespace-nowrap"
        >
          Admin Dashboard <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
