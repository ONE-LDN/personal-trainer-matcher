import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ONE LDN PT Matcher",
  description: "Member intake and admin triage for PT matching",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
