'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import "./MyPage.css";

interface Recipe {
  id: number;
  image: string;
  name: string;
  link: string;
}

interface RecentRecipe {
  id: number;
  image: string;
  name: string;
  link: string;
}

//음식 기호
const foodOptions = ["한식", "중식", "일식", "양식", "디저트", "채식", "해산물", "매운 음식"];
const allergyOptions = ["땅콩", "우유", "계란", "밀가루", "새우", "생선", "견과류", "대두"];
const tasteOptions = ["짠맛", "단맛"];


const MyPage = () => {
  const [profile, setProfile] = useState<{ name: string; email: string;image?: string }>({
    name: "",
    email: "",
    image: "/images/default_profile.webp"
  });
  
  const [foodPreferences, setFoodPreferences] = useState<{ likes: string[]; allergies: string[]; tastes: string[] }>({
    likes: [],
    allergies: [],
    tastes: [],
  });
  
  
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [recentRecipes, setRecentRecipes] = useState<RecentRecipe[]>([]);
  const [favoriteIndex, setFavoriteIndex] = useState<number>(0);
  const [recentIndex, setRecentIndex] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  
   // ✅ 1. 테스트용 샘플 데이터 추가
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://3.38.114.206:8080/member/1");
      if (response.data) {
        setProfile({
          name: response.data.name || "",
          email: response.data.email || "",
        });
      }
    } catch (error) {
      console.error("회원 정보 불러오기 오류:", error);
    }
  };

  const storedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
  if (storedProfile.image) {
    setProfile((prev) => ({ ...prev, image: storedProfile.image }));
  }


  const storedPreferences = JSON.parse(localStorage.getItem("foodPreferences") || "null");
  if (storedPreferences) {
    setFoodPreferences({
      likes: storedPreferences.likes || [],
      allergies: storedPreferences.allergies || [],
      tastes: storedPreferences.tastes || [],
    });
  }

  const fetchFavoriteRecipes = async () => {
    try {
      const res = await axios.get("http://3.38.114.206:8080/recipe/favorites/1");
      const converted = res.data.map((recipe: any) => ({
        id: recipe.recipeId,
        image: recipe.imageUrl,
        name: recipe.title,
        link: `/recipe/${recipe.recipeId}`,
      }));
      setFavoriteRecipes(converted);
    } catch (err) {
      console.error("❌ 즐겨찾기 레시피 가져오기 실패:", err);
    }
  };


  fetchProfile();
  fetchFavoriteRecipes();
}, []);

useEffect(() => {
  // 로컬스토리지에서 최근 본 레시피 가져오기
  const storedRecipes = JSON.parse(localStorage.getItem("recentRecipes") || "[]");
  setRecentRecipes(storedRecipes);
}, []);



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
      reader.onload = () => { // ✅ onload 이벤트로 변경
        const base64Image = reader.result as string;
        const updatedProfile = { ...profile, image: base64Image };
        setProfile(updatedProfile);
        localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // ✅ 입력값 변경 핸들러
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // ✅ 회원 정보 저장
  const handleSaveProfile = async () => {
    try {
      const response = await axios.post(
        "http://3.38.114.206:8080/member",
        {
          name: profile.name,
          email: profile.email
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      console.log("회원 정보 저장 성공:", response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("회원 정보 저장 중 오류 발생:", error);
    }
  };
  
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCheckboxChange = (category: "likes" | "allergies" | "tastes", item: string) => {
    setFoodPreferences((prev) => {
      if (!prev) {
        return { likes: [], allergies: [], tastes: [], [category]: [item] };
      }
  
      const updatedList = prev[category]?.includes(item)
        ? prev[category].filter((i) => i !== item)
        : [...(prev[category] || []), item];
  
      return { ...prev, [category]: updatedList };
    });
  };
  
  

  const handleSavePreferences = () => {
    localStorage.setItem("foodPreferences", JSON.stringify(foodPreferences));
    setIsModalOpen(false);
  };

  
      
  

  return (
    <div className="mypage-container">
      {/* 프로필 영역 */}
      <div className="profile-section">
        <div className="profile-left">
          <label className="profile-label">
            <input type="file" className="file-input" onChange={handleProfileUpload} />
            <img
              src={profile.image||"/images/default_profile.webp"}
              alt="Profile"
              className="profile-image"
            />
          </label>
          <p className="profile-name">{profile.name}</p>
        </div>
        <div className="profile-right">
          <h2 className="section-title">회원 정보<button className="edit-button" onClick={handleEditToggle}>수정</button></h2>
          {isEditing ? (
            <div className="edit-profile">
              <p>이름: <input type="text" name="name" value={profile.name} onChange={handleProfileChange} /></p>
              <p>이메일: <input type="email" name="email" value={profile.email} onChange={handleProfileChange} /></p>
              <button className="save-button" onClick={handleSaveProfile}>저장</button>
            </div>
          ) : (
            <div className="profile-info">
              <p>이름: {profile.name || "이름을 입력해주세요."}</p>
              <p>이메일: {profile.email || "이메일을 입력해주세요."}</p>
              <p>음식 기호: {foodPreferences.likes.length ? foodPreferences.likes.join("  ") : "선택 없음"}</p>
              <p>알레르기: {foodPreferences.allergies.length ? foodPreferences.allergies.join("  ") : "선택 없음"}</p>
              <p>맛 종류: {foodPreferences.tastes.length ? foodPreferences.tastes.join("  ") : "선택 없음"}</p>
            </div>
          )}
        </div>
      </div>
     
     {/* 음식 기호 설정 */}
     <div className="food-preferences">
        <button className="button" onClick={handleModalToggle}>음식 기호 설정</button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div>
              <h3>선호 음식 종류</h3>
              {foodOptions.map((food) => (
                <label key={food}>
                  <input type="checkbox" checked={foodPreferences.likes.includes(food)} onChange={() => handleCheckboxChange("likes", food)} /> {food}
                </label>
              ))}
            </div>
            <div>
              <h3>알레르기 음식</h3>
              {allergyOptions.map((allergy) => (
                <label key={allergy}>
                  <input type="checkbox" checked={foodPreferences.allergies.includes(allergy)} onChange={() => handleCheckboxChange("allergies", allergy)} /> {allergy}
                </label>
              ))}
            </div>
            <div>
              <h3>맛 종류</h3>
              {tasteOptions.map((taste) => (
                <label key={taste}>
                  <input type="checkbox" checked={foodPreferences.tastes.includes(taste)} onChange={() => handleCheckboxChange("tastes", taste)} /> {taste}
                </label>
              ))}
            </div>
            <button className="button" onClick={handleSavePreferences}>저장</button>
            <button className="button cancel" onClick={handleModalToggle}>닫기</button>
          </div>
        </div>
      )}
  




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
                <a href={`/recipe/${recipe.id}`}>
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
                <Link href={`/recipe/${recipe.id}`}>
            <img src={recipe.image} alt={recipe.name} className="recipe-image" />
            <p>{recipe.name}</p>
          </Link>
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