import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.jdarkyeka6.tidesearch",
  appName: "TideSearch",
  webDir: "out",
  server: {
    allowNavigation: [
      "google.com",
      "*.google.com",
      "youtube.com",
      "*.youtube.com",
      "chatgpt.com",
      "*.chatgpt.com",
      "github.com",
      "*.github.com",
      "claude.ai",
      "*.claude.ai",
      "gemini.google.com",
      "newlaptops.com",
      "*.newlaptops.com"
    ],
  },
};

export default config;
