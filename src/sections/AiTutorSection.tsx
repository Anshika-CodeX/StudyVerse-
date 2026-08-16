import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const AiTutorSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'center center',
          scrub: 1,
        }
      });

      tl.from(textRef.current, { x: -100, opacity: 0, duration: 1 })
        .from(chatBoxRef.current, { x: 100, opacity: 0, duration: 1 }, "-=1");

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen flex items-center px-6 md:px-20 lg:px-40 py-20 z-10">
      <div className="flex flex-col md:flex-row items-center w-full gap-20">
        
        {/* Left: Text Content */}
        <div ref={textRef} className="flex-1">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
            Your Personal AI Tutor.
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Stuck on a complex concept? The StudyVerse AI tutor breaks down complicated topics into simple, interactive, and easy-to-understand explanations. Available 24/7.
          </p>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_10px_#4f46e5]"></span>
              Instant doubt resolution
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_10px_#4f46e5]"></span>
              Personalized learning paths
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_10px_#4f46e5]"></span>
              Socratic method questioning
            </li>
          </ul>
        </div>

        {/* Right: Glassmorphism Chat Interface */}
        <div ref={chatBoxRef} className="flex-1 w-full max-w-lg">
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
            
            <div className="space-y-6">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-primary-600/20 border border-primary-500/30 text-white px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-[80%]">
                  Can you explain how React's useEffect works?
                </div>
              </div>
              
              {/* AI Message */}
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/10 text-white px-4 py-3 rounded-2xl rounded-tl-none text-sm max-w-[90%] leading-relaxed">
                  <p className="mb-2">Think of <code className="bg-black/30 px-1 py-0.5 rounded text-primary-300">useEffect</code> as a way to tell React: "Hey, after you render the component, please do this extra task."</p>
                  <p>It's perfect for fetching data, setting up subscriptions, or manually changing the DOM.</p>
                </div>
              </div>

               {/* User Message */}
               <div className="flex justify-end">
                <div className="bg-primary-600/20 border border-primary-500/30 text-white px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-[80%]">
                  Ah! So it's like a post-render hook?
                </div>
              </div>

            </div>
            
            <div className="mt-6 flex gap-3">
              <input type="text" placeholder="Ask anything..." className="flex-1 bg-black/30 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors" readOnly />
              <button className="bg-primary-600 hover:bg-primary-500 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center transition-colors shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                ↑
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
