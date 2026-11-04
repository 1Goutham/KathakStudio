import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-serif" });
const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-sans" });
const deva = Tiro_Devanagari_Hindi({ subsets: ["devanagari"], weight: "400", variable: "--font-deva" });

export const metadata: Metadata = {
  title: site.fullName,
  description: site.tagline,
  openGraph: { title: site.fullName, description: site.tagline, type: "website" },
  twitter: { card: "summary_large_image", title: site.fullName, description: site.tagline },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${deva.variable}`} suppressHydrationWarning>
      <head>
        {/* Gate reveal styles on JS so content is never hidden without it */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
