import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.auraskin.app',
  appName: 'AuraSkin',
  webDir: 'dist',
  server: {
    url: 'https://auraskin-prototype.vercel.app',
    cleartext: true
  }
};

export default config;
