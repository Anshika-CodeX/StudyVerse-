import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const features = [
  {
    title: "Coding Playground",
    description: "Write, test, and debug code instantly in our browser-based IDE powered by AI.",
    icon: "💻"
  },
  {
    title: "Study Together",
    description: "Join immersive virtual rooms with friends. Track each other's progress in real-time.",
    icon: "🌐"
  },
  {
    title: "Streak System",
    description: "Build unstoppable momentum. Watch your streak flame grow as you learn every day.",
    icon: "🔥"
  },
  {
    title: "Career Mastery",
    description: "Follow AI-curated roadmaps tailored to your dream tech job.",
    icon: "🚀"
  }
];

export const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // Floating animation for cards
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.to(card, {
          y: i % 2 === 0 ? -20 : 20,
          duration: 3 + i,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut"
        });
      });

      // Scroll entry animation
      gsap.from(cardsRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'back.out(1.7)'
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen py-32 px-6 md:px-20 lg:px-40 z-10 flex flex-col justify-center">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 to-pink-500">master tech</span>.</h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">A seamless blend of interactive learning, AI assistance, and social features designed to keep you engaged.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index} 
            ref={el => { cardsRef.current[index] = el; }}
            className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 hover:bg-white/10 transition-colors duration-300 group cursor-pointer"
          >
            <div className="text-5xl mb-6 bg-black/30 w-20 h-20 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-primary-300 transition-colors">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
