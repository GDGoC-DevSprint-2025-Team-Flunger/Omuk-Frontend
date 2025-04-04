'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IngredientCard from '../../components/ingredientCardForm';
import { useRouter } from 'next/navigation';

interface Ingredient {
  name: string;
  amount: string;
  icon: string;
}

interface Recipe {
  id: number;
  title: string;
  imageUrl: string;
  ingredients: string[]; // 상세 정보에서 채워짐
}

const Fridge: React.FC = () => {
  const [partialMatches, setPartialMatches] = useState<Recipe[]>([]);
  const [randomFallback, setRandomFallback] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const fridge = JSON.parse(localStorage.getItem('fridge') || '[]');
        const freezer = JSON.parse(localStorage.getItem('freezer') || '[]');
        const userIngredients = [...fridge, ...freezer].map((item: Ingredient) =>
          item.name.trim()
        );

        // Step 1: 레시피 목록 불러오기
        const response = await axios.get('http://3.38.114.206:8080/recipe/list');
        const recipes = response.data;

        // Step 2: 각 레시피 상세 정보 요청해서 ingredients 확인
        const detailedRecipes = await Promise.all(
          recipes.map(async (recipe: any) => {
            try {
              const detailRes = await axios.get(`http://3.38.114.206:8080/recipe/${recipe.id}`);
              return {
                id: recipe.id,
                title: recipe.title,
                imageUrl: recipe.imageUrl,
                ingredients: detailRes.data.ingredients || [],
              };
            } catch (e) {
              console.warn(`레시피 ${recipe.id} 상세 정보 요청 실패`, e);
              return null;
            }
          })
        );

        // 유효한 레시피만 필터링
        const validRecipes = detailedRecipes.filter((r) => r !== null) as Recipe[];

        // Step 3: 추천 조건 검사 (title or ingredients에 user 재료 포함)
        const partial: Recipe[] = validRecipes.filter((recipe) => {
          const titleMatches = userIngredients.some((ing) =>
            recipe.title.toLowerCase().includes(ing.toLowerCase())
          );
          const ingredientMatches = recipe.ingredients.some((ing) =>
            userIngredients.includes(ing)
          );
          return titleMatches || ingredientMatches;
        });

        if (partial.length === 0) {
          const randomRes = await axios.get('http://3.38.114.206:8080/recipe/recommendation/random');
          setRandomFallback(randomRes.data);
        }

        setPartialMatches(partial);
        setErrorMessage('');
      } catch (error) {
        console.error('레시피 불러오기 실패:', error);
        setErrorMessage('레시피 데이터를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleCardClick = (recipeId: number) => {
    router.push(`/recipe/${recipeId}`);
  };

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
        ) : partialMatches.length > 0 ? (
          <div className="row gy-4">
            {partialMatches.map((recipe) => (
              <div className="col-md-3 col-sm-6" key={recipe.id}>
                <div
                  className="card position-relative text-white"
                  onClick={() => handleCardClick(recipe.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={recipe.imageUrl}
                    className="card-img"
                    alt={recipe.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-img-overlay d-flex align-items-end p-2" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <h6 className="card-title mb-0">{recipe.title}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : randomFallback.length > 0 ? (
          <>
            <h6>냉장고에 맞는 레시피가 없어 대신 이런 레시피를 추천드려요!</h6>
            <div className="row gy-4">
              {randomFallback.map((recipe: Recipe) => (
                <div className="col-md-3 col-sm-6" key={recipe.id}>
                  <div
                    className="card position-relative text-white"
                    onClick={() => handleCardClick(recipe.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={recipe.imageUrl}
                      className="card-img"
                      alt={recipe.title}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-img-overlay d-flex align-items-end p-2" style={{ background: 'rgba(0,0,0,0.3)' }}>
                      <h6 className="card-title mb-0">{recipe.title}</h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-muted">추천할 레시피가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Fridge;
