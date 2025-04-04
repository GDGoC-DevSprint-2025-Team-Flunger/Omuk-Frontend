'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IngredientCard from '../../components/ingredientCardForm';
import { useRouter } from 'next/navigation'; // ✅ useNavigate 대신

interface Ingredient {
  name: string;
  amount: string;
  icon: string;
}

interface Recipe {
  id: number;
  title: string;
  ingredients: string[];
  imageUrl: string;
}

const Fridge: React.FC = () => {
  const [perfectMatches, setPerfectMatches] = useState<Recipe[]>([]);
  const [partialMatches, setPartialMatches] = useState<Recipe[]>([]);
  const [randomFallback, setRandomFallback] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter(); // ✅ Next.js 전용 라우터

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
          const titleMatches = userIngredients.some((ing) =>
            recipe.title.toLowerCase().includes(ing.toLowerCase())
          );

          if (titleMatches) {
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

  const handleCardClick = (recipeId: number) => {
    router.push(`/recipe/${recipeId}`); // ✅ useRouter로 경로 이동
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
        ) : perfectMatches.length > 0 || partialMatches.length > 0 ? (
          <>
            {perfectMatches.length > 0 && (
              <>
                <h5>지금 바로 만들 수 있어요!</h5>
                <div className="row gy-4 mb-4">
                  {perfectMatches.map((recipe) => (
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
            )}

            {partialMatches.length > 0 && (
              <>
                <h5>일부 재료가 있어요!</h5>
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
              </>
            )}
          </>
        ) : randomFallback.length > 0 ? (
          <>
            <h6>냉장고로 추천 가능한 레시피가 없어요. 대신 이런 레시피는 어떠실까요?</h6>
            <div className="row gy-4">
              {randomFallback.map((recipe) => (
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
