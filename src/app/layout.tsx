import type { Metadata } from 'next';
import { Manrope, Geist } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  title: 'Smart Money Tracker | Midnight Journal',
  description: 'A premium personal finance tracker.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${geist.variable} dark`}>
      <body className="font-body-md selection:bg-primary-container selection:text-on-primary-container">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
