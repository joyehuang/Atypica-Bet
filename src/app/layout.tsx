import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Layout } from '@/components/Layout';
import MouseEffects from '@/components/MouseEffects';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Atypica Bet - AI Prediction Market',
  description: 'Objective predictive intelligence powered by mathematical certainty',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <MouseEffects />
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
