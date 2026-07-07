const fs = require('fs');
const path = require('path');

const adminDir = 'C:\\Users\\Sultan\\Documents\\TRW\\GitHub (sultan.isaac26@gmail.com)\\Admin-Auraskin-Prototype';
const sidebarPath = path.join(adminDir, 'src', 'components', 'Sidebar.tsx');
const downloadWidgetPath = path.join(adminDir, 'src', 'components', 'DownloadAppWidget.tsx');

const widgetCode = `"use client";
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
`;

fs.writeFileSync(downloadWidgetPath, widgetCode);

let sidebarCode = fs.readFileSync(sidebarPath, 'utf8');

if (!sidebarCode.includes('DownloadAppWidget')) {
  sidebarCode = sidebarCode.replace(
    'import { cn } from "@/lib/utils";',
    'import { cn } from "@/lib/utils";\nimport DownloadAppWidget from "./DownloadAppWidget";'
  );

  const targetDiv = `<div className="h-20 flex items-center px-6 border-b border-accent/30">
        <Image src="/logo.png" alt="AuraSkin Logo" width={32} height={32} className="mr-2 object-contain rounded-md shadow-sm" />
        <span className="font-serif font-bold text-xl text-primary tracking-wide">AuraSkin</span>
      </div>`;

  const newDiv = `<div className="h-20 flex items-center justify-between px-4 border-b border-accent/30 overflow-hidden">
        <div className="flex items-center shrink-0">
          <Image src="/logo.png" alt="AuraSkin Logo" width={32} height={32} className="mr-2 object-contain rounded-md shadow-sm" />
          <span className="font-serif font-bold text-lg text-primary tracking-wide">AuraSkin</span>
        </div>
        <DownloadAppWidget />
      </div>`;

  sidebarCode = sidebarCode.replace(targetDiv, newDiv);
  fs.writeFileSync(sidebarPath, sidebarCode);
  console.log('Sidebar patched successfully.');
} else {
  console.log('Sidebar already patched.');
}
