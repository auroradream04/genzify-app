import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Statistics from "./components/Statistics";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_TITLE,
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
  keywords: process.env.NEXT_PUBLIC_KEYWORDS,
  openGraph: {
    title: process.env.NEXT_PUBLIC_TITLE,
    description: process.env.NEXT_PUBLIC_DESCRIPTION,
    type: "website",
    siteName: process.env.NEXT_PUBLIC_TITLE,
    locale: "en_US",
  }
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <Statistics />
      <body className={`${geistSans.className} ${geistMono.variable} antialiased bg-[rgb(3,3,4)] text-[rgb(220,220,220)]`}>
        {children}
      </body>
    </html >
  );
}
