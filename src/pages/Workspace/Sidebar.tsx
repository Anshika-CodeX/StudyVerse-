import React, { useState } from 'react';
import { Search, MessageSquare, Bookmark, Flame, Zap, Compass, Plus, Trash2, Edit, Check, X } from 'lucide-react';

interface SidebarProps {
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
  chats: { id: string; title: string }[];
  fetchChats: () => Promise<void>;
  loadingHistory: boolean;
}

export const Sidebar = ({ currentChatId, setCurrentChatId, chats, fetchChats, loadingHistory }: SidebarProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const startNewChat = () => {
    setCurrentChatId(null);
  };

  const handleStartRename = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleCancelRename = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setEditTitle('');
  };

  const handleSaveRename = async (id: string, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (!editTitle.trim()) return;

    try {
      const res = await fetch(`/api/chat/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editTitle.trim() }),
      });

      if (res.ok) {
        setEditingId(null);
        setEditTitle('');
        await fetchChats();
      }
    } catch (error) {
      console.error('Failed to rename chat', error);
    }
  };

  const handleDeleteChat = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      const res = await fetch(`/api/chat/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        if (currentChatId === id) {
          setCurrentChatId(null);
        }
        await fetchChats();
      }
    } catch (error) {
      console.error('Failed to delete chat', error);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 flex flex-col gap-6 overflow-y-auto hidden-scrollbar">

      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400 group-hover:text-primary-400 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-black/20 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-colors shadow-inner"
        />
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2">
        <button
          onClick={startNewChat}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-600 border border-primary-500 text-white hover:bg-primary-500 transition-all text-sm font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)] group mb-2"
        >
          <Plus size={18} className="group-hover:scale-110 transition-transform" />
          New Chat
        </button>
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-300 hover:text-white transition-all text-sm font-medium group">
          <Compass size={18} className="text-primary-400 group-hover:scale-110 transition-transform" />
          Learning Roadmap
        </button>
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-300 hover:text-white transition-all text-sm font-medium group">
          <Bookmark size={18} className="text-pink-400 group-hover:scale-110 transition-transform" />
          Saved Notes
        </button>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      {/* Recent Chats */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto hidden-scrollbar">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">Recent Sessions</h3>

        {loadingHistory ? (
          <div className="flex flex-col gap-2 px-2 py-1">
            <div className="h-8 bg-white/5 animate-pulse rounded-lg w-full"></div>
            <div className="h-8 bg-white/5 animate-pulse rounded-lg w-5/6"></div>
            <div className="h-8 bg-white/5 animate-pulse rounded-lg w-2/3"></div>
          </div>
        ) : filteredChats.length === 0 ? (
          <p className="text-xs text-gray-500 px-2">No sessions found.</p>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                if (editingId !== chat.id) {
                  setCurrentChatId(chat.id);
                }
              }}
              className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer group transition-all ${currentChatId === chat.id ? 'bg-primary-600/20 border border-primary-500/30' : 'hover:bg-white/5 border border-transparent'}`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <MessageSquare size={16} className={`${currentChatId === chat.id ? 'text-primary-400' : 'text-gray-500 group-hover:text-primary-400'} transition-colors shrink-0`} />
                {editingId === chat.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRename(chat.id, e);
                      if (e.key === 'Escape') handleCancelRename(e);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-black/40 border border-primary-500/50 rounded px-2 py-0.5 text-sm text-white focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span className={`text-sm truncate ${currentChatId === chat.id ? 'text-primary-100 font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
                    {chat.title}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              {editingId === chat.id ? (
                <div className="flex items-center gap-1.5 ml-2 shrink-0">
                  <button
                    onClick={(e) => handleSaveRename(chat.id, e)}
                    className="p-1 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/40 hover:text-green-300 transition-colors"
                  >
                    <Check size={12} />
                  </button>
                  <button
                    onClick={handleCancelRename}
                    className="p-1 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/40 hover:text-red-300 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity ml-2 shrink-0">
                  <button
                    onClick={(e) => handleStartRename(chat.id, chat.title, e)}
                    className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    title="Rename"
                  >
                    <Edit size={12} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="p-1 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Bottom Stats */}
      <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between px-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
            <Flame size={16} className="text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Current Streak</p>
            <p className="text-sm font-bold text-white">14 Days</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
          <Zap size={16} className="text-blue-400" />
        </div>
      </div>

    </div>
  );
};
