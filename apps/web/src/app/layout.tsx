import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SEGi CRM',
  description: 'CRM Comercial para SEGi Escola de Gastronomia',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}
