import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ci.leinad.sophopsy.pos',
  appName: 'Sophopsy POS',
  webDir: 'www',
  // This is the whole point of this shell app: instead of bundling web
  // assets, point the WebView straight at the live Django site. Capacitor
  // loads this URL directly, so it's always the current deployed site —
  // no rebuild needed when the site changes, only when a *native* plugin
  // (like the Sunmi printer) changes.
  server: {
    url: 'https://sophopsy.leinad.ci',
    cleartext: false,
  },
};

export default config;
