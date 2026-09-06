import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.jdarkyeka6.tidesearch",
  appName: "TideSearch",
  webDir: "out",
  server: {
    allowNavigation: ["www.mojeek.com", "mojeek.com", "*.mojeek.com"],
  },
};

export default config;
