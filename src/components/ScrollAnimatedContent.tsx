import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollAnimatedContent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.title', { y: 100, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.title', start: 'top 80%', toggleActions: 'play none none reverse' } });
      gsap.from('.subtitle', { y: 50, opacity: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.subtitle', start: 'top 80%', toggleActions: 'play none none reverse' } });
      gsap.from('.cta-button', { scale: 0.8, opacity: 0, duration: 0.6, ease: 'back.out(1.7)', scrollTrigger: { trigger: '.cta-button', start: 'top 85%', toggleActions: 'play none none reverse' } });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white p-8">
      <h1 className="title text-5xl md:text-6xl font-bold mb-4">Explore the Knowledge Galaxy</h1>
      <p className="subtitle text-lg md:text-xl max-w-2xl text-center mb-8">A cinematic journey through AI‑powered learning, where every scroll reveals a new universe.</p>
      <button className="cta-button px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg transition-colors">Start Your Voyage</button>
    </section>
  );
};

export default ScrollAnimatedContent;
