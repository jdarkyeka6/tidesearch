import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TideSearch",
  description: "Search the web with TideSearch.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
