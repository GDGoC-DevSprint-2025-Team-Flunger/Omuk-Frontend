'use client';

import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from '../assets/SearchForm.module.css';

export default function SearchForm() {
  const [keyword, setKeyword] = useState('');
  const [recipes, setRecipes] = useState([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('http://3.38.114.206:8080/recipe/recommendation', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keyword,
      }),
    });

    const data = await response.json();
    setRecipes(data);
  };

  return (
    <div>
      <form className={styles.searchWrapper} role="search" onSubmit={handleSubmit}>
        <input
          className={styles.searchInput}
          type="search"
          placeholder="레시피 제목 또는 재료"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          aria-label="레시피 제목 또는 재료 검색"
        />
        <button
          type="submit"
          aria-label="검색"
          className={styles.searchButton}
        >
          <FaSearch size="0.9em" />
        </button>
      </form>

      <div className={styles.resultContainer}>
        {recipes.length > 0 ? (
          recipes.map((recipe: { title: string; ingredients: string[] }, index) => (
            <div key={index} className={styles.recipeItem}>
              <h3>{recipe.title}</h3>
              <p>재료: {recipe.ingredients.join(', ')}</p>
            </div>
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}