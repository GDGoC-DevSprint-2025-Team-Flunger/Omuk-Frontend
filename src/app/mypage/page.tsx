'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyPage.css";
import { useRouter } from 'next/navigation';

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

const allergyOptions = ["MILK", "EGG", "WHEAT", "PEANUT", "SHELLFISH"];
const tasteOptions = ["SWEET", "SALTY", "SOUR", "UMAMI","SAVORY","SPICY"];
const mealTimeOptions = ["BREAKFAST", "LUNCH", "DINNER","LATE_NIGHT"];

const engToKorTaste: { [key: string]: string } = {
  SWEET: "단맛",
  SALTY: "짠맛",
  SOUR: "신맛",
  UMAMI: "감칠맛",
  SAVORY: "고소한맛",
  SPICY: "매운맛",
};

const engToKorAllergy: { [key: string]: string } = {
  MILK: "우유",
  EGG: "달걀",
  WHEAT: "밀가루",
  PEANUT: "땅콩",
  SHELLFISH: "갑각류",
};

const engToKorMeal: { [key: string]: string } = {
  BREAKFAST: "아침",
  LUNCH: "점심",
  DINNER: "저녁",
  LATE_NIGHT: "야식",
};

const MyPage = () => {
  const [profile, setProfile] = useState<{ name: string; email: string; image?: string }>({
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://3.38.114.206:8080/member/1");
        if (response.data) {
          setProfile({ name: response.data.name || "", email: response.data.email || "" });
        }
      } catch (error) {
        console.error("회원 정보 불러오기 오류:", error);
      }
    };

    const fetchFoodPreferences = async () => {
      try {
        const res = await axios.get("http://3.38.114.206:8080/member/preference/1");
        if (res.data) {
          setFoodPreferences({
            likes: res.data.time ? res.data.time.split(",") : [],
            allergies: res.data.allergy ? res.data.allergy.split(",") : [],
            tastes: res.data.taste ? res.data.taste.split(",") : [],
          });
        }
      } catch (error) {
        console.error("음식 기호 불러오기 오류:", error);
      }
    };

    const fetchFavoriteRecipes = async () => {
      try {
        const res = await axios.get("http://3.38.114.206:8080/recipe/favorites/1");
        const converted = res.data.map((recipe: any) => ({
          id: recipe.id,
          image: recipe.imageUrl,
          name: recipe.title,
          link: `/recipe/${recipe.id}`,
        }));
        setFavoriteRecipes(converted);
      } catch (err) {
        console.error("❌ 즐겨찾기 레시피 가져오기 실패:", err);
      }
    };

    const storedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    if (storedProfile.image) {
      setProfile((prev) => ({ ...prev, image: storedProfile.image }));
    }

    fetchProfile();
    fetchFavoriteRecipes();
    fetchFoodPreferences();
  }, []);

  useEffect(() => {
    const storedRecipes = JSON.parse(localStorage.getItem("recentRecipes") || "[]");
    setRecentRecipes(storedRecipes);
  }, []);

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

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        const updatedProfile = { ...profile, image: base64Image };
        setProfile(updatedProfile);
        localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      };
      reader.readAsDataURL(file);
    }
  };

  const router = useRouter();
  const handleCardClick = (id: number) => {
    router.push(`/recipe/${id}`);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.post(
        "http://3.38.114.206:8080/member",
        { name: profile.name, email: profile.email },
        { headers: { "Content-Type": "application/json" } }
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
      const updatedList = prev[category]?.includes(item)
        ? prev[category].filter((i) => i !== item)
        : [...(prev[category] || []), item];
      return { ...prev, [category]: updatedList };
    });
  };

  const handleSavePreferences = async () => {
    try {
      const payload = {
        taste: [Array.from(new Set(foodPreferences.tastes)).join(",")],
        allergy: [Array.from(new Set(foodPreferences.allergies)).join(",")],
        time: [Array.from(new Set(foodPreferences.likes)).join(",")],
      };

      const response = await axios.patch(
        "http://3.38.114.206:8080/member/preference/1",
        payload,
      );

      console.log("✅ 음식 기호 저장 성공:", response.data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("❌ 음식 기호 저장 중 오류 발생:", error);
    }
  };

  return (
    <div className="mypage-container">
      <div className="profile-section">
        <div className="profile-left">
          <label className="profile-label">
            <input type="file" className="file-input" onChange={handleProfileUpload} />
            <img src={profile.image || "/images/default_profile.webp"} alt="Profile" className="profile-image" />
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
              <p>선호 식사 시간: {foodPreferences.likes.length ? foodPreferences.likes.map(item => engToKorMeal[item] || item).join("  ") : "선택 없음"}</p>
              <p>선호하는 맛: {foodPreferences.tastes.length ? foodPreferences.tastes.map(item => engToKorTaste[item] || item).join("  ") : "선택 없음"}</p>
              <p>알레르기 음식: {foodPreferences.allergies.length ? foodPreferences.allergies.map(item => engToKorAllergy[item] || item).join("  ") : "선택 없음"}</p>
            </div>
          )}
        </div>
      </div>

      <div className="food-preferences">
        <button className="button" onClick={handleModalToggle}>음식 기호 설정</button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div>
              <h3>선호 식사 시간</h3>
              {mealTimeOptions.map((mealTime) => (
                <label key={mealTime}>
                  <input type="checkbox" checked={foodPreferences.likes.includes(mealTime)} onChange={() => handleCheckboxChange("likes", mealTime)} /> {engToKorMeal[mealTime] || mealTime}
                </label>
              ))}
            </div>
            <div>
              <h3>선호하는 맛</h3>
              {tasteOptions.map((taste) => (
                <label key={taste}>
                  <input type="checkbox" checked={foodPreferences.tastes.includes(taste)} onChange={() => handleCheckboxChange("tastes", taste)} /> {engToKorTaste[taste] || taste}
                </label>
              ))}
            </div>
            <div>
              <h3>알레르기 음식</h3>
              {allergyOptions.map((allergy) => (
                <label key={allergy}>
                  <input type="checkbox" checked={foodPreferences.allergies.includes(allergy)} onChange={() => handleCheckboxChange("allergies", allergy)} /> {engToKorAllergy[allergy] || allergy}
                </label>
              ))}
            </div>
            <button className="button" onClick={handleSavePreferences}>저장</button>
            <button className="button cancel" onClick={handleModalToggle}>닫기</button>
          </div>
        </div>
      )}

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
        )}
      </div>
    </div>
  );
};

export default MyPage;
