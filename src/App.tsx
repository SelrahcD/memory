import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import PegList from './pages/PegList';
import PegQuiz from './pages/PegQuiz';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-[100dvh] flex flex-col">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <Home />
              </>
            }
          />
          <Route path="/peg-list" element={<PegList />} />
          <Route path="/peg-quiz" element={<PegQuiz />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
