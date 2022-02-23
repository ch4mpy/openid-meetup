import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.c4_soft.cafe_skifo',
  appName: 'cafe-skifo',
  webDir: '../../dist/cafe-skifo',
  bundledWebRuntime: false,
  server: {
    hostname: 'localhost',
    androidScheme: 'https',
  },
};

export default config;
