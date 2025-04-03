// app/layout.tsx
import React from 'react';
import { Inter } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchForm from '../components/searchForm';
import IconButtons from '../components/iconButtons'; // 👈 새 컴포넌트 분리

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Fridge App',
  description: 'Next.js App with Fridge page layout',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kr">
      <body className={`${inter.className} bg-light`}>
        <header className="py-4 border-bottom bg-white">
          <div className="container">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
              <h1 className="h4 text-center text-md-start m-0">Omuk</h1>
              <SearchForm />
              <IconButtons /> {/* 👈 버튼 묶음 클라이언트 컴포넌트로 분리 */}
            </div>
          </div>
        </header>

        <main className="container my-4">{children}</main>

        <footer className="border-top text-center py-3 bg-white">
          <p className="mb-0">© 2025 Fridge App. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
