import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ONE LDN PT Matcher",
  description: "FIND YOUR SPECIALIST. Tell us a bit about yourself and get matched with the best trainer for your experience, training style and goals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
