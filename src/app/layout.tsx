import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import localFont from 'next/font/local';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchForm from '../components/searchForm';
import IconButtons from '../components/iconButtons';

// Pretendard 폰트 로드
const pretendard = localFont({
  src: '../../public/fonts/Pretendard-Medium.otf', // 상대 경로로 지정
  display: 'swap',
});


export const metadata = {
  title: 'Omuk',
  description: 'Next.js App with Omuk page layout',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kr">
      <body className={`${pretendard.className} bg-light`}>
        <header className="py-4 border-bottom bg-white">
          <div className="container">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
              <div style={{ position: 'relative', width: '120px', height: '70px' }}>
                <Link href="/">
                  <Image
                    src="/Omuk_logo.png"
                    alt="Omuk 로고"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </Link>
              </div>

              <SearchForm />
              <IconButtons />
            </div>
          </div>
        </header>

        <main className="container my-4">{children}</main>

        <footer className="border-top text-center py-3 bg-white">
          <p className="mb-0">© 2025 Omuk. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
