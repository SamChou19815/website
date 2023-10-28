import "../lib/common.css";

import type { Metadata } from "next";
import Script from "next/script";

const GA_ID = "G-K50MLQ68K6";
const GA_INLINE_SCRIPT = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`;

export const metadata: Metadata = {
  icons: ["/logo.png", { rel: "shortcut icon", url: "/favicon.ico" }],
  authors: { name: "Developer Sam" },
  keywords: [
    "Sam",
    "Developer Sam",
    "developer",
    "web apps",
    "open source",
    "programming language",
  ],
  metadataBase: new URL("https://developersam.com"),
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://developersam.com/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {process.env.NODE_ENV === "production" && (
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      )}
      {process.env.NODE_ENV === "production" && (
        <Script id="google-analytics">{GA_INLINE_SCRIPT}</Script>
      )}
      <body>{children}</body>
    </html>
  );
}
