'use client';

import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from '../assets/SearchForm.module.css';

export default function SearchForm() {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('검색어:', keyword);
  };

  return (
    <form className={styles.searchWrapper} role="search" onSubmit={handleSubmit}>
  <input
    className={styles.searchInput}
    type="search"
    placeholder="검색"
    value={keyword}
    onChange={(e) => setKeyword(e.target.value)}
    aria-label="검색"
  />
  <button
    type="submit"
    aria-label="검색"
    className={styles.searchButton}
  >
    <FaSearch size="0.9em" />
  </button>
</form>
  );
}
