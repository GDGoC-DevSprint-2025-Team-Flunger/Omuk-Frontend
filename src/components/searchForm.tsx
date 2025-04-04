'use client';

import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import styles from '../assets/SearchForm.module.css';

export default function SearchForm() {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(keyword.trim())}`);
  };

  return (
    <form className={styles.searchWrapper} role="search" onSubmit={handleSubmit}>
      <input
        className={styles.searchInput}
        type="search"
        placeholder="레시피 제목 또는 재료"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        aria-label="레시피 제목 또는 재료 검색"
      />
      <button type="submit" aria-label="검색" className={styles.searchButton}>
        <FaSearch size="0.9em" />
      </button>
    </form>
  );
}
