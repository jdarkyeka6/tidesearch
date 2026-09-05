import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.jdarkyeka6.tidesearch",
  appName: "TideSearch",
  webDir: "out",
  server: {
    allowNavigation: ["www.google.com", "google.com", "*.google.com"],
  },
};

export default config;
