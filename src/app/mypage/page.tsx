'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyPage.css";

interface Recipe {
  image: string;
  name: string;
}

const MyPage = () => {
  const [profile, setProfile] = useState<{ name: string; age: number; image: string }>({ name: "홍길동", age: 25, image: "" });
  const [foodPreferences, setFoodPreferences] = useState<{ likes: string[]; allergies: string[] }>({ likes: [], allergies: [] });
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [recipeIndex, setRecipeIndex] = useState<number>(0);


   // ✅ 1. 테스트용 샘플 데이터 추가
   useEffect(() => {
    const sampleRecipes: Recipe[] = [
      { image: "/images/bundaegi.jpeg", name: "김치찌개" },
      { image: "/images/bundaegi.jpeg", name: "된장찌개" },
      { image: "/images/bundaegi.jpeg", name: "불고기" },
      { image: "/images/bundaegi.jpeg", name: "비빔밥" },
      { image: "/images/bundaegi.jpeg", name: "떡볶이" }
    ];
    setFavoriteRecipes(sampleRecipes);
  }, []);

  // ✅ 2. 나중에 백엔드 연결할 때 사용할 코드 (주석 해제하면 됨)
  /*
  useEffect(() => {
    axios.get("http://localhost:5000/api/favorite-recipes")
      .then(response => setFavoriteRecipes(response.data))
      .catch(error => console.error("레시피 데이터를 불러오는 중 오류 발생:", error));
  }, []);
  */
  const handleNext = (items: Recipe[]) => {
    if (recipeIndex + 4 < items.length) {
      setRecipeIndex(recipeIndex + 4);
    }
  };

  const handlePrev = () => {
    if (recipeIndex - 4 >= 0) {
      setRecipeIndex(recipeIndex - 4);
    }
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mypage-container">
      <div className="profile-section">
        <div className="profile-left">
          <label className="profile-label">
            <input type="file" className="file-input" onChange={handleProfileUpload} />
            <img
              src={profile.image || "/default-profile.png"}
              alt="Profile"
              className="profile-image"
            />
          </label>
          <p className="profile-name">{profile.name} ({profile.age}세)</p>
        </div>
        <div className="profile-right">
          <h2 className="section-title">회원 정보</h2>
          <p>이름: {profile.name}</p>
          <p>나이: {profile.age}</p>
        </div>
      </div>

      <div className="food-preferences">
        <button className="button" onClick={() => alert("음식 기호 창.")}>음식 기호 설정</button>
      </div>

      <div className="recipe-section">
        <h2 className="section-title">즐겨찾기 레시피</h2>
        <div className="recipe-carousel">
          <button className="carousel-button" onClick={() => handlePrev()}>&lt;</button>
          <div className="recipe-list">
            {favoriteRecipes.slice(recipeIndex, recipeIndex + 4).map((recipe, idx) => (
              <div key={idx} className="recipe-card">
                <img src={recipe.image} alt={recipe.name} className="recipe-image" />
              </div>
            ))}
          </div>
          <button className="carousel-button" onClick={() => handleNext(favoriteRecipes)}>&gt;</button>
        </div>
      </div>

      <div className="recipe-section">
        <h2 className="section-title">최근 본 레시피</h2>
        <div className="recipe-carousel">
          <button className="carousel-button" onClick={() => handlePrev()}>&lt;</button>
          <div className="recipe-list">
            {recentRecipes.slice(recipeIndex, recipeIndex + 4).map((recipe, idx) => (
              <div key={idx} className="recipe-card">
                <img src={recipe.image} alt={recipe.name} className="recipe-image" />
              </div>
            ))}
          </div>
          <button className="carousel-button" onClick={() => handleNext(recentRecipes)}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
