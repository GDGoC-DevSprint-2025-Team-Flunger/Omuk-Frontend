'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Recipe {
  name: string;
  ingredients: string[];
}

const Mainpage: React.FC = () => {
  const [recipe1, setRecipe1] = useState<Recipe | null>(null);
  const [recipe2, setRecipe2] = useState<Recipe | null>(null);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [error1, setError1] = useState('');
  const [error2, setError2] = useState('');

  useEffect(() => {
    const fetchRecipe1 = async () => {
      setLoading1(true);
      try {
        const res = await axios.get('http://3.38.114.206:8080/recipe/recommendation/random');
        setRecipe1(res.data);
        setError1('');
      } catch (err) {
        setError1('레시피 1 불러오기 실패');
      } finally {
        setLoading1(false);
      }
    };

    const fetchRecipe2 = async () => {
      setLoading2(true);
      try {
        const res = await axios.get('http://3.38.114.206:8080/recipe/recommendation/random');
        setRecipe2(res.data);
        setError2('');
      } catch (err) {
        setError2('레시피 2 불러오기 실패');
      } finally {
        setLoading2(false);
      }
    };

    fetchRecipe1();
    fetchRecipe2();
  }, []);

  return (
    <div className="container py-5">
      <header>
      </header>

      <main>
        <section>
          <div className="row gy-4">
            {/* 레시피 1 */}
            <div className="col-12">
              <h5>오늘의 인기 레시피</h5>
              {loading1 ? (
                <div className="border rounded p-4 text-center text-muted">불러오는 중...</div>
              ) : error1 ? (
                <div className="alert alert-danger">{error1}</div>
              ) : recipe1 ? (
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{recipe1.name}</h5>
                    <p className="card-text">
                      필요한 재료: {recipe1.ingredients.join(', ')}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* 레시피 2 */}
            <div className="col-12">
              <h5>이런 레시피는 어떠세요?</h5>
              {loading2 ? (
                <div className="border rounded p-4 text-center text-muted">불러오는 중...</div>
              ) : error2 ? (
                <div className="alert alert-danger">{error2}</div>
              ) : recipe2 ? (
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{recipe2.name}</h5>
                    <p className="card-text">
                      필요한 재료: {recipe2.ingredients.join(', ')}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Mainpage;
