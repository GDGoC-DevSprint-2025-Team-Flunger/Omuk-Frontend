// App.tsx
'use client';
import React,{ useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import "./recipe_page.css";
import { FaYoutube } from "react-icons/fa";

const App: React.FC = () => {

  //즐겨찾기 상태
  const [isFavorite, setIsFavorite] = useState(false); //별 노랑/무색 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기/닫기 상태

  //즐찾 토글함수 추가
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // 모달 토글 함수 추가
const toggleModal = () => {
  setIsModalOpen(!isModalOpen); // 모달 상태 토글
};

  return (
    <div className="App">
      <div className="flex">
        <div className="flex-35 p-4"> 
          {/* 음식 이름 */}
          <h2 className="text-2xl font-bold center">번데기</h2>

          {/* 음식 사진 */}
          <div className="food-image">
            <img
              src="/images/bundaegi.jpeg" 
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* 영상 링크 및 즐겨찾기 버튼 */}
          <div className="buttons "> {/*window.open 옆에 영상 링크 달기*/}
            <button className="btn-youtube mr-2" onClick={() => window.open("https://youtu.be/CLjMjdBxY-o?feature=shared", "_blank")}>
            <FaYoutube className="youtube-icon" size={40} />
            </button>
            {/* 즐겨찾기 버튼 (별 아이콘) */}
            <button className="btn-favorite" onClick={toggleFavorite}>
              <FontAwesomeIcon
                icon={faStar}
                className={`favorite-icon ${isFavorite ? "filled" : ""}`}
              />
            </button>
          </div>

          {/* 소요 시간 */}
          <div className="time">
            <h5><strong>소요 시간: 30분 </strong></h5>
          </div>

          {/* 난이도 */}
          <div className="difficulty">
            <strong>난이도:</strong> ★★★★★
          </div>

          {/* 식사 분류 */}
          <div className="type">
            <strong>식사 분류</strong>
            <button className ="btn-modal" onClick={toggleModal}>?</button>

            {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <h3>식사 유형 정보</h3>
                <p>식사 유형에 대한 추가 정보가 여기에 표시됩니다.</p>
              </div>
            </div>
            )}
          </div>

          {/* ✅ 팁 추가 */}
          <div className="tip">
            <strong>팁!</strong>
            <p><u>번데기는 간장과 함께 먹으면 더욱 맛있어요!</u></p>
          </div>
          

        {/*왼쪽 끝*/}
        </div>
        
        


        {/* ✅ 오른쪽 영역 - 재료 테이블 추가 */}
        <div className="flex-65 bg-green-200 p-4">
          <h2 className="table-title">📌 재료 목록</h2>
          <table className="ingredient-table">
            <thead>
              <tr>
                <th>재료</th>
                <th>양</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>번데기</td>
                <td>200g</td>
              </tr>
              <tr>
                <td>물</td>
                <td>300ml</td>
              </tr>
              <tr>
                <td>간장</td>
                <td>2큰술</td>
              </tr>
              <tr>
                <td>설탕</td>
                <td>1큰술</td>
              </tr>
              <tr>
                <td>다진 마늘</td>
                <td>1작은술</td>
              </tr>
              <tr>
                <td>참기름</td>
                <td>1작은술</td>
              </tr>
              <tr>
                <td>소금</td>
                <td>약간</td>
              </tr>
            </tbody>
          </table>
          <h2 className="table-title">📝 조리 과정</h2>
          <div className="cooking-process">
            <div className="step">
              <div className="step-description">
                <strong>1. 번데기 준비</strong>
                <p>번데기를 깨끗이 씻은 후 끓는 물에 데친다.</p>
              </div>
              <div className="step-image">
                <img src="/images/boiling_water.jpg" alt="Step 1" />
              </div>
            </div>

            <div className="step">
        <div className="step-description">
          <strong>2. 양념 만들기</strong>
          <p>간장, 설탕, 마늘, 참기름을 섞어 양념을 만든다.</p>
        </div>
        <div className="step-image">
          <img src="/images/sauce.jpg" alt="Step 2" />
          </div>
        </div>
    
          </div> {/*cooking-process 감싸는 div */}
          

        </div>


      </div> {/*전체 감싸는 div */}
    </div>



  );
};

export default App;
