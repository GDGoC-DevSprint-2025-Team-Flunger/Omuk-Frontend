'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // ✅ useNavigate 대신

interface Recipe {
  id: number;
  title: string;
  imageUrl: string;
}

const Mainpage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter(); // ✅ Next.js 전용 라우터
  const handleCardClick = (recipeId: number) => {
    router.push(`/recipe/${recipeId}`); // ✅ useRouter로 경로 이동
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://3.38.114.206:8080/recipe/recommendation/random');
        console.log('응답 데이터:', res.data); // 👈 콘솔 확인
        setRecipes(res.data); // ✅ 배열 그대로 저장
        setError('');
      } catch (err) {
        console.error('에러 발생:', err);
        setError('레시피 불러오기 실패');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="container py-5">
      <h5>오늘의 추천 레시피</h5>
      {loading ? (
        <div className="border rounded p-4 text-center text-muted">불러오는 중...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="row gy-4">
          {recipes.map((recipe) => (
            <div className="col-md-3 col-sm-6" key={recipe.id}>
              <div className="card position-relative text-white"
                onClick={() => handleCardClick(recipe.id)}
                style={{ cursor: 'pointer' }}>
                <img
                  src={recipe.imageUrl}

                  className="card-img"
                  alt={recipe.title}
                  style={{ height: '200px', objectFit: 'cover' }} // ✅ 이미지 정렬
                />
                <div
                  className="card-img-overlay d-flex align-items-end p-2"
                  style={{ background: 'rgba(0,0,0,0.3)' }}
                >
                  <h6 className="card-title mb-0">{recipe.title}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mainpage;
