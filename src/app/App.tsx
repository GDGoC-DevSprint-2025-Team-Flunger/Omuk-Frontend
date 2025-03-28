import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './fridge/page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;