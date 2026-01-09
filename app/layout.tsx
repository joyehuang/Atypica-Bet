import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Atypica Bet - AI Predictive Intelligence',
    template: '%s | Atypica Bet',
  },
  description: 'Objective predictive intelligence powered by mathematical certainty. Explore AI-powered predictions and market analysis.',
  keywords: ['AI', 'Prediction', 'Market Analysis', 'Atypica', 'Intelligence'],
  authors: [{ name: 'Atypica System' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://atypica-bet.vercel.app',
    title: 'Atypica Bet - AI Predictive Intelligence',
    description: 'Objective predictive intelligence powered by mathematical certainty.',
    siteName: 'Atypica Bet',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atypica Bet - AI Predictive Intelligence',
    description: 'Objective predictive intelligence powered by mathematical certainty.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-black text-white antialiased">
        <div className="min-h-screen flex flex-col font-sans">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
