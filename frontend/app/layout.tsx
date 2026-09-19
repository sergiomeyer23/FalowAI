import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Falow AI — Your Personal AI English Teacher',
  description: 'A focused personal English learning environment for moving from B1 toward C2.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
