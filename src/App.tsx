import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from "./components/Navbar";
import { GlobalScene } from './canvas/GlobalScene';
import { LandingPage } from './pages/LandingPage';
import { TutorWorkspace } from './pages/Workspace/TutorWorkspace';
import { DSAWorkspace } from './pages/DSAWorkspace/DSAWorkspace';
import DSATest from './pages/DSATest/DSATest';
import { QuizPractice } from './pages/QuizPractice/QuizPractice';

gsap.registerPlugin(ScrollTrigger);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MainLayout() {
  const location = useLocation();
  const isWorkspace = location.pathname === '/dsa-workspace';

  return (
    <div className="relative min-h-screen bg-transparent text-white font-sans overflow-x-hidden">
      {!isWorkspace && <GlobalScene />}
      {!isWorkspace && <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ai-tutor" element={<TutorWorkspace />} />
        <Route path="/dsa-workspace" element={<DSAWorkspace />} />
        <Route path="/dsa-test" element={<DSATest />} />
        <Route path="/quiz-practice" element={<QuizPractice />} />
      </Routes>
    </div>
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <MainLayout />
    </BrowserRouter>
  );
}

export default App;