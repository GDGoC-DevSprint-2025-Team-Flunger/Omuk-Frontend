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
    <form className="d-flex" role="search" onSubmit={handleSubmit}>
      <input
        className="form-control"
        type="search"
        placeholder="검색..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        aria-label="검색"
      />
      <button
        type="submit"
        aria-label="검색"
        className={`${styles.btnCarrot} ms-2 d-flex align-items-center`}
      >
        <FaSearch />
      </button>
    </form>
  );
}
