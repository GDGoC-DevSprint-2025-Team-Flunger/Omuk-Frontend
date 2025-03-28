"use client"
import React from 'react';

const MyPageForm: React.FC = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">마이페이지</h2>
      <p>여기에 사용자 정보를 추가하거나 수정할 수 있습니다.</p>

      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">이름</label>
          <input type="text" id="name" className="form-control" placeholder="이름을 입력하세요" />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">이메일</label>
          <input type="email" id="email" className="form-control" placeholder="이메일을 입력하세요" />
        </div>

        <button type="submit" className="btn btn-primary">저장</button>
      </form>
    </div>
  );
};

export default MyPageForm;
