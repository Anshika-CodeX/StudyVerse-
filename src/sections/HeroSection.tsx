import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import MagneticButton from '../components/MagneticButton';

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial entry animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      // Animate headline words
      tl.fromTo('.word', 
        { y: 50, opacity: 0, rotateX: -45 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }
      )
      // Subheadline
      .fromTo(subheadlineRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        "-=0.5"
      )
      // Buttons
      .fromTo(buttonsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        "-=0.6"
      );

      // Scroll out animation
      gsap.to(containerRef.current, {
        y: -150,
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Split headline for animation
  const headlineWords = ["Learn.", "Practice.", "Grow.", "Together."];

  return (
    <section ref={containerRef} className="relative w-full h-screen flex flex-col justify-center px-6 md:px-20 lg:px-40 pointer-events-none">
      <div className="max-w-3xl z-10 pointer-events-auto pt-20">
        <h1 ref={headlineRef} className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight mb-8" style={{ perspective: '1000px' }}>
          {headlineWords.map((word, i) => (
            <span key={i} className="word inline-block mr-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              {word}
            </span>
          ))}
        </h1>
        
        <p ref={subheadlineRef} className="text-xl md:text-2xl text-gray-300 font-light mb-12 max-w-2xl leading-relaxed">
          The AI-powered universe where students learn concepts, solve coding problems, study with friends, maintain streaks, and master their careers.
        </p>
        
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-6">
          <MagneticButton primary>
            Start Learning
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </MagneticButton>
          <MagneticButton>
            Explore the Universe
          </MagneticButton>
        </div>
      </div>
    </section>
  );
};
