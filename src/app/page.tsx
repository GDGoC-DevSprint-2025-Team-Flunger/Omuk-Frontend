"use client"
import React from 'react';
import { CgSmartHomeRefrigerator } from "react-icons/cg";
import { IoPersonCircleSharp } from "react-icons/io5";
import Link from 'next/link'; // Next.js의 내장 Link 컴포넌트 사용

const Home: React.FC = () => {
    return (
        <div>
            {/* 공통 헤더 부분을 직접 포함 */}
            <header aria-label="Main header" style={{ textAlign: 'center' }}>
                <h1>Fridge Page Layout</h1>
            </header>

            {/* 본문 콘텐츠 부분 */}
            <main>
            <Link
        href="/recipe"
        style={{
          padding: '10px',
          marginRight: '10px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
      </Link>
                {/* 버튼 섹션 수정 */}
            </main>
        </div>
    );
};

export default Home;
