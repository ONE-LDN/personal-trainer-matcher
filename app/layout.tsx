import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ONE LDN PT Matcher",
  description: "FIND YOUR PT. Tell us a bit about yourself and get matched with the best trainer for your experience, training style and goals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preload the brand display font so it downloads at high priority in parallel
            with the HTML, finishing before first paint and avoiding the FOUT swap.
            crossOrigin is required even same-origin — fonts are always fetched in CORS
            mode, and without it the preload would not be reused and the file fetched twice. */}
        <link rel="preload" href="/fonts/horizon.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/horizon_outlined.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        {/* Courier Prime (body/fallback font) via a head <link>. Previously imported with an
            @import placed after @font-face rules, which is invalid CSS and was dropped by the
            browser, so the fallback silently degraded to generic monospace. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* This is the App Router root layout, which wraps every route, so the stylesheet
            loads on all pages — the no-page-custom-font rule (aimed at pages/_document) does
            not apply. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
