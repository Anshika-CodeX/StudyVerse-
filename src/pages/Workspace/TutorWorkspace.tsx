import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Sidebar } from './Sidebar';
import { CenterPanel } from './CenterPanel';
import { apiUrl } from '../../config/api';

export const TutorWorkspace = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<{ id: string; title: string }[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchChats = async () => {
    try {
      setLoadingHistory(true);
      const res = await fetch(apiUrl('/api/chat/history'));
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      }
    } catch (error) {
      console.error('Failed to fetch chats', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    // Subtle page enter animation
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-full h-screen pt-24 pb-6 px-6 overflow-hidden flex gap-6"
    >
      {/* Sidebar */}
      <div className="w-1/4 h-full">
        <Sidebar
          currentChatId={currentChatId}
          setCurrentChatId={setCurrentChatId}
          chats={chats}
          fetchChats={fetchChats}
          loadingHistory={loadingHistory}
        />
      </div>

      {/* AI Chat */}
      <div className="flex-1 h-full">
        <CenterPanel
          currentChatId={currentChatId}
          setCurrentChatId={setCurrentChatId}
          fetchChats={fetchChats}
        />
      </div>
    </div>
  );
};
