import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.appointment.app',
  appName: 'capsules-reporting-app',
  webDir: 'out',
  server: {
    "androidScheme": "https"
  }
};

export default config;
