'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyPage.css";

interface Recipe {
  image: string;
  name: string;
  link: string;
}

const MyPage = () => {
  const [profile, setProfile] = useState<{ name: string; age: number; image: string }>({ name: "홍길동", age: 25, image: "" });
  const [foodPreferences, setFoodPreferences] = useState<{ likes: string[]; allergies: string[] }>({ likes: [], allergies: [] });
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [favoriteIndex, setFavoriteIndex] = useState<number>(0);
  const [recentIndex, setRecentIndex] = useState<number>(0);



   // ✅ 1. 테스트용 샘플 데이터 추가
   useEffect(() => {

    const storedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    if (storedProfile.image) setProfile(storedProfile);

    const favorites = JSON.parse(localStorage.getItem("favoriteRecipes") || "[]");
    setFavoriteRecipes(favorites);

    const recent = JSON.parse(localStorage.getItem("recentRecipes") || "[]");
    setRecentRecipes(recent);
  }, []);

  // ✅ 2. 나중에 백엔드 연결할 때 사용할 코드 (주석 해제하면 됨)
  /*
  useEffect(() => {
    axios.get("http://localhost:5000/api/favorite-recipes")
      .then(response => setFavoriteRecipes(response.data))
      .catch(error => console.error("레시피 데이터를 불러오는 중 오류 발생:", error));
  }, []);
  */
  // ✅ 2. 캐러셀 이동 함수 (각각 분리)
  const handleNextFavorite = () => {
    if (favoriteIndex + 4 < favoriteRecipes.length) setFavoriteIndex(favoriteIndex + 4);
  };
  const handlePrevFavorite = () => {
    if (favoriteIndex - 4 >= 0) setFavoriteIndex(favoriteIndex - 4);
  };

  const handleNextRecent = () => {
    if (recentIndex + 4 < recentRecipes.length) setRecentIndex(recentIndex + 4);
  };
  const handlePrevRecent = () => {
    if (recentIndex - 4 >= 0) setRecentIndex(recentIndex - 4);
  };

  // ✅ 3. 프로필 이미지 업로드
  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newProfile = { ...profile, image: reader.result as string };
        setProfile(newProfile);
        localStorage.setItem("userProfile", JSON.stringify(newProfile));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mypage-container">
      {/* 프로필 영역 */}
      <div className="profile-section">
        <div className="profile-left">
          <label className="profile-label">
            <input type="file" className="file-input" onChange={handleProfileUpload} />
            <img
              src={profile.image || "/images/default_profile.webp"}
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

      {/* 음식 기호 설정 */}
      <div className="food-preferences">
        <button className="button" onClick={() => alert("음식 기호 창.")}>음식 기호 설정</button>
      </div>

      {/* 즐겨찾기 레시피 섹션 */}
      <div className="recipe-section">
        <h2 className="section-title">📌 즐겨찾기 레시피</h2>
        {favoriteRecipes.length === 0 ? (
          <p className="empty-message">즐겨찾기 한 레시피가 없습니다!</p>
        ) : (
          <div className="recipe-carousel">
            <button className="carousel-button" onClick={handlePrevFavorite}>&lt;</button>
            <div className="recipe-list">
            {favoriteRecipes.slice(favoriteIndex, favoriteIndex + 4).map((recipe, idx) => (
              <div key={idx} className="recipe-card">
                <a href={recipe.link}>
                  <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                  <p>{recipe.name}</p>
                </a>
              </div>
            ))}
          </div>
          <button className="carousel-button" onClick={handleNextFavorite}>&gt;</button>
        </div>
        )}</div>

      {/* 최근 본 레시피 섹션 */}
      <div className="recipe-section">
        <h2 className="section-title">👀 최근 본 레시피</h2>
        <div className="recipe-carousel">
          <button className="carousel-button" onClick={handlePrevRecent}>&lt;</button>
          <div className="recipe-list">
            {recentRecipes.slice(recentIndex, recentIndex + 4).map((recipe, idx) => (
              <div key={idx} className="recipe-card">
                <a href={recipe.link}>
                  <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                  <p>{recipe.name}</p>
                </a>
              </div>
            ))}
          </div>
          <button className="carousel-button" onClick={handleNextRecent}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;