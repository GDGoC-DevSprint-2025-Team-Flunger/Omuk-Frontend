'use client';
import React from 'react';
import IngredientCard from '../../components/ingredientCardForm'; // 냉장실/냉동실 공통 컴포넌트

const Fridge: React.FC = () => {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">냉장고</h1>
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <IngredientCard title="냉장실" storageKey="fridge" />
        </div>
        <div className="col-12 col-md-6">
          <IngredientCard title="냉동실" storageKey="freezer" />
        </div>
      </div>
    </div>
  );
};

export default Fridge;
