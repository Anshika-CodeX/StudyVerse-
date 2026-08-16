import { HeroSection } from '../sections/HeroSection';
import { AiTutorSection } from '../sections/AiTutorSection';
import { FeaturesSection } from '../sections/FeaturesSection';

export const LandingPage = () => {
  return (
    <div className="relative z-10 w-full">
      <HeroSection />
      <AiTutorSection />
      <FeaturesSection />
    </div>
  );
};
