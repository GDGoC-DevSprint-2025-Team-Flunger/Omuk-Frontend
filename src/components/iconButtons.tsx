'use client';

import React from 'react';
import { CgSmartHomeRefrigerator } from 'react-icons/cg';
import { IoPersonCircleSharp } from 'react-icons/io5';
import Link from 'next/link';

export default function IconButtons() {
  return (
    <div className="d-flex align-items-center mb-3 mb-md-0">
      <Link
        href="/mypage"
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
        <IoPersonCircleSharp size={24} />
      </Link>

      <button
        style={{
          padding: '10px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => alert('냉장고 페이지로 이동')}
      >
        <CgSmartHomeRefrigerator size={24} />
      </button>
    </div>
  );
}
