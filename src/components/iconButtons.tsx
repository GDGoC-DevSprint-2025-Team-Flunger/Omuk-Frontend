'use client';

import React from 'react';
import { CgSmartHomeRefrigerator } from 'react-icons/cg';
import { IoPersonCircleSharp } from 'react-icons/io5';
import Link from 'next/link';

export default function IconButtons() {
  const commonStyle = {
    width: '45px',
    height: '45px',
    padding: '10px',
    marginRight: '10px',
    backgroundColor: '#5CB338',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div className="d-flex align-items-center mb-3 mb-md-0">
      <Link href="/mypage" style={{ ...commonStyle, backgroundColor: '#5CB338' }}>
        <IoPersonCircleSharp size={25} />
      </Link>

      <Link href="/refrigerator" style={{ ...commonStyle, backgroundColor: '#187498' }}>
        <CgSmartHomeRefrigerator size={25} />
      </Link>
    </div>
  );
}
