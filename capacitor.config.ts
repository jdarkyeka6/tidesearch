import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.jdarkyeka6.tidesearch",
  appName: "TideSearch",
  webDir: "out",
  server: {
    // Probe browser mode: keep arbitrary web navigation inside TideSearch
    // instead of maintaining a per-domain allowlist.
    allowNavigation: ["*"],
  },
};

export default config;
