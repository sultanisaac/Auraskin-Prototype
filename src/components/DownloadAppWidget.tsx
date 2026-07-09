import { Smartphone, Download } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { useState, useEffect } from 'react';

export const DownloadAppWidget = () => {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  if (isNative) return null;

  return (
    <a
      href="/Auraskin-Prototype.apk"
      download="Auraskin-Prototype.apk"
      className="fixed top-20 left-2 md:top-28 md:left-6 bg-white/95 backdrop-blur-md border border-gray-100 shadow-[0_8px_30px_rgba(15,76,92,0.15)] rounded-full md:rounded-2xl p-1.5 pr-3 md:p-4 flex flex-row md:flex-col items-center md:items-start gap-2 z-[45] w-auto max-w-fit md:max-w-[200px] hover:shadow-[0_12px_40px_rgba(15,76,92,0.25)] hover:-translate-y-1 transition-all group overflow-hidden cursor-pointer"
    >
      {/* Decorative background element */}
      <div className="hidden md:block absolute top-0 left-0 w-16 h-16 bg-secondary/10 rounded-br-[100%] -z-10 group-hover:scale-125 transition-transform duration-500"></div>
      
      <div className="flex items-center gap-2 text-primary font-bold">
        <div className="bg-primary/5 p-1.5 rounded-full md:rounded-lg text-primary group-hover:bg-primary/10 transition-colors">
          <Smartphone className="w-4 h-4 md:w-5 md:h-5" />
        </div>
        <span className="text-xs md:text-sm font-serif whitespace-nowrap">Get App</span>
      </div>
      
      <div className="hidden md:flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-secondary mt-1 group-hover:text-primary transition-colors">
        <span>Download APK</span>
        <Download className="w-3 h-3" />
      </div>
    </a>
  );
};
