import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'pl.twojaplikacja.pocketshoppinglist',
  appName: 'Pocket Shopping List',
  // Angular build generuje index.html w podfolderze /browser
  webDir: 'dist/todo-angular-cursor/browser'
};

export default config;
