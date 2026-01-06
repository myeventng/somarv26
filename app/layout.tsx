// app/layout.tsx
import type { Metadata } from 'next';
import { Playfair_Display, Montserrat, Great_Vibes, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Iyesogie & Marvin Wedding | SOMARV26 | January 2026',
  description: 'Join us as we celebrate the union of Iyesogie Omobude and Marvin Uwa Edogun on January 11th, 2026',
  keywords: ['wedding', 'Iyesogie', 'Marvin', 'Somarv26', 'Benin City', 'Nigeria'],
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable} ${greatVibes.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}