'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IngredientCard from '../../components/ingredientCardForm';

interface Ingredient {
  name: string;
  amount: string;
  icon: string;
}

interface Recipe {
  name: string;
  ingredients: string[];
}

const Fridge: React.FC = () => {
  const [perfectMatches, setPerfectMatches] = useState<Recipe[]>([]);
  const [partialMatches, setPartialMatches] = useState<Recipe[]>([]);
  const [randomFallback, setRandomFallback] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const fridge = JSON.parse(localStorage.getItem('fridge') || '[]');
        const freezer = JSON.parse(localStorage.getItem('freezer') || '[]');
        const userIngredients = [...fridge, ...freezer].map((item: Ingredient) =>
          item.name.trim()
        );

        const response = await axios.get('http://3.38.114.206:8080/recipe/list');
        const recipes: Recipe[] = response.data;

        const perfect: Recipe[] = [];
        const partial: Recipe[] = [];

        for (const recipe of recipes) {
          const ingredients = recipe.ingredients;
          const hasAll = ingredients.every(ing => userIngredients.includes(ing));
          const hasSome = ingredients.some(ing => userIngredients.includes(ing));

          if (hasAll) {
            perfect.push(recipe);
          } else if (hasSome) {
            partial.push(recipe);
          }
        }

        if (perfect.length === 0 && partial.length === 0) {
          const randomRes = await axios.get('http://3.38.114.206:8080/recipe/recommendation/random');
          setRandomFallback(randomRes.data);
        }

        setPerfectMatches(perfect);
        setPartialMatches(partial);
        setErrorMessage('');
      } catch (error) {
        console.error('레시피 로딩 실패:', error);
        setErrorMessage('레시피 데이터를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <IngredientCard title="냉장실" storageKey="fridge" />
        </div>
        <div className="col-12 col-md-6">
          <IngredientCard title="냉동실" storageKey="freezer" />
        </div>
      </div>

      <div className="mt-5">
        <h4 className="mb-3">추천 레시피</h4>

        {isLoading ? (
          <p>레시피 불러오는 중...</p>
        ) : errorMessage ? (
          <div className="alert alert-danger">{errorMessage}</div>
        ) : perfectMatches.length > 0 || partialMatches.length > 0 ? (
          <>
            {perfectMatches.length > 0 && (
              <>
                <h5>✅ 지금 바로 만들 수 있어요!</h5>
                <ul className="list-group mb-4">
                  {perfectMatches.map((r, i) => (
                    <li key={i} className="list-group-item">
                      <strong>{r.name}</strong>
                      <br />
                      <small className="text-muted">재료: {r.ingredients.join(', ')}</small>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {partialMatches.length > 0 && (
              <>
                <h5>🔍 일부 재료가 있어요!</h5>
                <ul className="list-group">
                  {partialMatches.map((r, i) => (
                    <li key={i} className="list-group-item">
                      <strong>{r.name}</strong>
                      <br />
                      <small className="text-muted">필요 재료: {r.ingredients.join(', ')}</small>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        ) : randomFallback ? (
          <div className="alert alert-warning">
            <p>냉장고로 추천가능한 레시피가 없어요. 대신 이런 레시피는 어떠실까요?</p>
            <strong>{randomFallback.name}</strong>
            <br />
            <small className="text-muted">재료: {randomFallback.ingredients.join(', ')}</small>
          </div>
        ) : (
          <p className="text-muted">추천할 레시피가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Fridge;
