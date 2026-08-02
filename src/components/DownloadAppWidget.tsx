"use client";
import { Smartphone, Download } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { useState, useEffect } from 'react';

export default function DownloadAppWidget() {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  if (isNative) return null;

  return (
    <a
      href="/Admin-Auraskin-Prototype.apk"
      download="Admin-Auraskin-Prototype.apk"
      className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1.5 rounded-lg transition-colors group cursor-pointer border border-primary/20 ml-2"
      title="Download APK"
    >
      <Smartphone className="w-3.5 h-3.5" />
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-bold uppercase tracking-wider">Get App</span>
      </div>
      <Download className="w-3 h-3 opacity-70 group-hover:opacity-100" />
    </a>
  );
}
