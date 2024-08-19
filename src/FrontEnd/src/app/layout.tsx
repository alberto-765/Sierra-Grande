import type { Metadata } from 'next';

import 'normalize.css/normalize.css';

import {inter} from '@/app/fonts'
import { Header, Footer } from '@/modules/shared/index';
import './global.css'


export const metadata: Metadata = {
  title: '',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
