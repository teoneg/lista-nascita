import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'La nostra lista nascita',
  description: 'Benvenuti nella nostra lista nascita',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
