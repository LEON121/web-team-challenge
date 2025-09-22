import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';

/**
 * Application layout component
 * 
 * This is the root layout component that wraps all pages in the application.
 * It provides global providers, fonts, and metadata for the entire app.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered
 * @returns {JSX.Element} Root layout component
 */
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Web Team Challenge App',
  description: 'A Next.js application for the Web Team Challenge with authentication and GraphQL integration',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
