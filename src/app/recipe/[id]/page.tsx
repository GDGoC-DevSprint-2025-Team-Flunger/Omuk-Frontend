'use client';

import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FaYoutube } from "react-icons/fa";
import "./recipe_page.css";

interface Recipe {
  recipeId: number;
  title: string;
  imageUrl: string;
  cookTime: number;
  difficulty: number;
  averageRating: number;
  videoUrl: string;
  ingredients: string[];
  steps: string[];
}

const RecipeDetail: React.FC = () => {
  const params = useParams();
  const recipeId = Number(params.id);
  const memberId = 1;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recommendation, setRecommendation] = useState<{
    mealTimes: string[];
    tasteTags: string[];
    seasons: string[];
    excludeAllergies: string[];
  } | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentRecipes, setRecentRecipes] = useState([]);

  // 레시피 불러오기
  useEffect(() => {

    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://3.38.114.206:8080/recipe/${recipeId}`);
        setRecipe(res.data);
      } catch (error) {
        console.error("❌ 레시피 불러오기 실패:", error);
        setError("레시피 데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [recipeId]);

  // 즐겨찾기 여부 확인
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get(`http://3.38.114.206:8080/recipe/favorites/${memberId}`);
        const isAlreadyFavorite = res.data.some((fav: any) => fav.recipeId === recipeId);
        setIsFavorite(isAlreadyFavorite);
      } catch (error) {
        console.error("❌ 즐겨찾기 목록 불러오기 실패:", error);
      }
    };
    fetchFavorites();
  }, [recipeId]);

  // 추천 정보 불러오기
  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const res = await axios.get(`http://3.38.114.206:8080/recipe/${recipeId}`);
        setRecommendation(res.data);
      } catch (error) {
        console.error("❌ 추천 정보 불러오기 실패:", error);
      }
    };
    if (recipeId) {
      fetchRecommendation();
    }
  }, [recipeId]);


  useEffect(() => {
    if (recipe) {
      const stored = JSON.parse(localStorage.getItem("recentRecipes") || "[]");
  
      // 이미 있는 레시피는 제거 (중복 제거)
      const filtered = stored.filter((item: any) => item.id !== recipe.recipeId);
  
      // 최근 본 레시피를 앞에 추가
      const updated = [{ id: recipe.recipeId, image: recipe.imageUrl, name: recipe.title, link: `/recipe/${recipe.recipeId}` }, ...filtered];
  
      // 최대 20개까지만 저장
      localStorage.setItem("recentRecipes", JSON.stringify(updated.slice(0, 20)));
    }
  }, [recipe]);
  
  // 즐겨찾기 추가
  const addFavorite = async () => {
    if (isFavorite) return;
    try {
      const res = await axios.post(
        `http://3.38.114.206:8080/recipe/favorites?memberId=${memberId}&recipeId=${recipeId}`,
        {},
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200) setIsFavorite(true);
    } catch (error) {
      console.error("❌ 즐겨찾기 추가 실패:", error);
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!recipe) return <p>레시피가 없습니다.</p>;

  return (
    <div className="App">
      <div className="flex">
        <div className="flex-35 p-4">
          <h2 className="text-2xl font-bold center">{recipe.title}</h2>
          <div className="food-image">
            <img src={recipe.imageUrl} className="w-full h-auto rounded-lg" />
          </div>
          <div className="buttons">
            <button className="btn-youtube mr-2" onClick={() => window.open(recipe.videoUrl, "_blank")}>
              <FaYoutube className="youtube-icon" size={40} />
            </button>
            <button className="btn-favorite" onClick={addFavorite}>
              <FontAwesomeIcon icon={faStar} className={`favorite-icon ${isFavorite ? "filled" : ""}`} />
            </button>
          </div>
          <div className="time"><strong>⏳ 소요 시간:</strong> {recipe.cookTime}분</div>
          <div className="difficulty"><strong>🔥 난이도:</strong> {"★".repeat(recipe.difficulty)}</div>
          <div className="point"><strong>⭐ 별점:</strong> {recipe.averageRating} / 5</div>
          <div className="type">
            <strong>식사 분류</strong>
            <button className="btn-modal" onClick={toggleModal}>?</button>
            {isModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <h3>식사 유형 정보</h3>
                  <table className="modal-table">
                    <thead>
                      <tr><th>항목</th><th>정보</th></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>식사 시간</strong></td>
                        <td>
                          {recommendation?.mealTimes?.length
                            ? recommendation.mealTimes.join(", ")
                            : "정보 없음"}
                        </td>
                      </tr>
                      <tr>
                        <td><strong>식사 종류</strong></td>
                        <td>
                          {recommendation?.tasteTags?.length
                            ? recommendation.tasteTags.join(", ")
                            : "정보 없음"}
                        </td>
                      </tr>
                      <tr>
                        <td><strong>계절</strong></td>
                        <td>
                          {recommendation?.seasons?.length
                            ? recommendation.seasons.join(", ")
                            : "정보 없음"}
                        </td>
                      </tr>
                      <tr>
                        <td><strong>알레르기 성분</strong></td>
                        <td>
                          {recommendation?.excludeAllergies?.length
                            ? recommendation.excludeAllergies.join(", ")
                            : "정보 없음"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-65 bg-green-200 p-4">
          <h2 className="table-title">📌 재료 목록</h2>
          <p>{recipe.ingredients.join(", ")}</p>

          <h2 className="table-title">📝 조리 과정</h2>
          <div className="cooking-process">
            {recipe.steps.map((step, index) => (
              <div key={index} className="step">
                <div className="step-description">
                  <strong>{index + 1}. {step}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;