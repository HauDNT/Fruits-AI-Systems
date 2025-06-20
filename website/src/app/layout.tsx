import React from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from '@/components/ui/toaster';
import RootReduxProvider from '@/redux/RootReduxProvider';
import './globals.css';
import ReactQueryProvider from '@/react-query/ReactQueryProvider';

const webFont = localFont({
  src: '../assets/fonts/Roboto/Roboto-Regular.ttf',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FruitFlow',
  description: 'Phân loại trái cây thông minh',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${webFont.className} dark:bg-gray-900`}>
        <ReactQueryProvider>
          <RootReduxProvider>{children}</RootReduxProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
