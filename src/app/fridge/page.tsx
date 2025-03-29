// app/register/page.tsx
import React from 'react';
import { CgSmartHomeRefrigerator } from "react-icons/cg";
import { IoPersonCircleSharp } from "react-icons/io5";

const Fridge: React.FC = () => {
  return (
    <div>
      <header aria-label="Main header">
        <h1>Register Page Layout
        </h1>
      </header>

      <main>
        <div className="container pb-14 pb-md-16 bg-gray">
          <h2>Omuk 검색창</h2>
          <div className="icon-container">
            <CgSmartHomeRefrigerator size={48} color="blue" />
            <IoPersonCircleSharp size={48} color="green" />
          </div>
        </div>
      </main>

      <footer aria-label="Main footer">
        <p>© 2025 Register Page. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Fridge;
