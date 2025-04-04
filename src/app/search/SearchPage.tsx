'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

interface Recipe {
  id: number;
  title: string;
  imageUrl: string;
  ingredients: string[];
}

const korToEngMeal: { [key: string]: string } = {
  아침: "BREAKFAST",
  점심: "LUNCH",
  저녁: "DINNER",
  야식: "LATE_NIGHT",
};

const korToEngTaste: { [key: string]: string } = {
  매운맛: "SPICY",
  짠맛: "SALTY",
  단맛: "SWEET",
  고소한맛: "SAVORY",
  신맛: "SOUR",
  감칠맛: "UMAMI"

};

const korToEngAllergy: { [key: string]: string } = {
  우유: "MILK",
  달걀: "EGG",
  갑각류: "SHELLFISH",
  밀가루: "WHEAT",
};

const korToEngSeason: { [key: string]: string } = {
  봄: "SPRING",
  여름: "SUMMER",
  가을: "FALL",
  겨울: "WINTER",
};

const engToKorMeal = Object.fromEntries(Object.entries(korToEngMeal).map(([k, v]) => [v, k]));
const engToKorTaste = Object.fromEntries(Object.entries(korToEngTaste).map(([k, v]) => [v, k]));
const engToKorAllergy = Object.fromEntries(Object.entries(korToEngAllergy).map(([k, v]) => [v, k]));

const filterOptions = {
  시간대: ["아침", "점심", "저녁", "야식"],
  맛: ["매운맛", "짠맛", "고소한맛", "단맛", "신맛", "감칠맛"],
  알러지: ["우유", "달걀", "갑각류", "밀가루"],
  계절: ["봄", "여름", "가을", "겨울"],
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const memberId = 1;

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filters, setFilters] = useState({
    mealTimes: [] as string[],
    tasteTags: [] as string[],
    allergyTags: [] as string[],
    seasons: [] as string[],
  });

  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const filterKeyMap: Record<keyof typeof filterOptions, keyof typeof filters> = {
    시간대: "mealTimes",
    맛: "tasteTags",
    알러지: "allergyTags",
    계절: "seasons",
  };

  const recipesPerPage = 16;
  const offset = (page - 1) * recipesPerPage;

  const savePreference = async (next: typeof filters) => {
    try {
      const payload = {
        taste: [Array.from(new Set(next.tasteTags.map(k => korToEngTaste[k]).filter(Boolean))).join(",")],
        allergy: [Array.from(new Set(next.allergyTags.map(k => korToEngAllergy[k]).filter(Boolean))).join(",")],
        time: [Array.from(new Set(next.mealTimes.map(k => korToEngMeal[k]).filter(Boolean))).join(",")],
      };

      await axios.patch(
        `http://3.38.114.206:8080/member/preference/${memberId}`,
        payload,  // ✅ axios가 자동으로 JSON 변환
      );
      console.log("필터 저장 성공:", payload);
    } catch (e) {
      console.error("필터 저장 실패", e);
    }
  };





  const fetchPreference = async () => {
    try {
      const res = await axios.get(`http://3.38.114.206:8080/member/preference/${memberId}`);
      const pref = res.data;

      setFilters({
        mealTimes: pref.time ? [engToKorMeal[pref.time]] : [],
        tasteTags: pref.taste ? pref.taste.split(",").map((t: string) => engToKorTaste[t]) : [],
        allergyTags: pref.allergy ? pref.allergy.split(",").map((a: string) => engToKorAllergy[a]) : [],
        seasons: [],
      });
    } catch (e) {
      console.error("사용자 필터 불러오기 실패", e);
    }
  };

  const handleCheckbox = (group: keyof typeof filters, value: string) => {
    const updated = filters[group].includes(value)
      ? filters[group].filter((v: string) => v !== value)
      : [...filters[group], value];
    const next = { ...filters, [group]: updated };
    setFilters(next);
  };

  const fetchFilteredRecipes = async () => {
    try {
      const params: Record<string, string | string[]> = {};

      if (keyword.trim()) {
        params.keyword = keyword;
      }

      const meal = filters.mealTimes.map(v => korToEngMeal[v]).filter(Boolean);
      if (meal.length > 0) params.mealTimes = meal;

      const taste = filters.tasteTags.map(v => korToEngTaste[v]).filter(Boolean);
      if (taste.length > 0) params.tasteTags = taste;

      const allergy = filters.allergyTags.map(v => korToEngAllergy[v]).filter(Boolean);
      if (allergy.length > 0) params.excludeAllergies = allergy;

      const season = filters.seasons.map(v => korToEngSeason[v]).filter(Boolean);
      if (season.length > 0) params.seasons = season;

      const response =
        Object.keys(params).length > 0
          ? await axios.get("http://3.38.114.206:8080/recipe/recommendation", {
            params,
            paramsSerializer: (params) => {
              const searchParams = new URLSearchParams();
              Object.entries(params).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                  value.forEach(v => searchParams.append(key, v));
                } else {
                  searchParams.append(key, value);
                }
              });
              return searchParams.toString();
            },
          })
          : await axios.get("http://3.38.114.206:8080/recipe/list");

      const data = response.data;
      const recipeList: Recipe[] = data.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        imageUrl: recipe.imageUrl,
        ingredients: recipe.ingredients || [],
      }));

      setRecipes(recipeList);
    } catch (err) {
      console.error("레시피 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchPreference(); // 최초 필터 불러오기
  }, [memberId]);

  useEffect(() => {
    fetchFilteredRecipes(); // 필터나 키워드 변경 시 검색
  }, [filters, keyword]);

  const paginatedRecipes = recipes.slice(offset, offset + recipesPerPage);
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  const handlePageChange = (newPage: number) => {
    const query = new URLSearchParams();
    query.set("q", keyword);
    query.set("page", newPage.toString());
    router.push(`/search?${query.toString()}`);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>레시피 검색</h5>
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            {isFilterOpen ? "필터 접기" : "필터 펼치기"}
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => savePreference(filters)}
          >
            필터 저장
          </button>
          <button
            className="btn btn-sm btn-outline-success"
            onClick={fetchPreference}
          >
            필터 불러오기
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => setFilters({
              mealTimes: [],
              tasteTags: [],
              allergyTags: [],
              seasons: [],
            })}
          >
            필터 초기화
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="row mb-4">
          {Object.entries(filterOptions).map(([group, values]) => (
            <div className="col-md-3 mb-3" key={group}>
              <strong>{group}</strong>
              {values.map((val) => (
                <div key={val} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={filters[filterKeyMap[group as keyof typeof filterOptions]].includes(val)}
                    onChange={() => handleCheckbox(filterKeyMap[group as keyof typeof filterOptions], val)}
                    id={`${group}-${val}`}
                  />
                  <label className="form-check-label" htmlFor={`${group}-${val}`}>
                    {val}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="row gy-4">
        {paginatedRecipes.length > 0 ? (
          paginatedRecipes.map((recipe) => (
            <div className="col-md-3 col-sm-6" key={recipe.id}>
              <div
                className="card position-relative text-white"
                onClick={() => router.push(`/recipe/${recipe.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={recipe.imageUrl}
                  className="card-img"
                  alt={recipe.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-img-overlay d-flex align-items-end p-2 bg-dark bg-opacity-25">
                  <h6 className="card-title mb-0">{recipe.title}</h6>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">검색 결과가 없습니다.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={`btn btn-sm mx-1 ${page === i + 1 ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
