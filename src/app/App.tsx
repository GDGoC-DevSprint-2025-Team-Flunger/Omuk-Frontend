import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Fridge from './refrigerator/page';
import Recipedetail from './recipe/[id]/page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 냉장고 페이지 (홈) */}
        <Route path="/" element={<Fridge />} />
        
        {/* 레시피 상세 페이지 */}
        <Route path="/recipe/:id" element={<Recipedetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
