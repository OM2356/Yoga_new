import React, { useState } from 'react';
import { PageView } from '../types';
import { sound } from '../utils/audio';
import {
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  Menu,
  X,
  Compass,
  Wind,
  Moon,
  Bot,
  BookOpen,
  User,
  Heart,
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  streakDays: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, streakDays }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundMenuOpen, setSoundMenuOpen] = useState(false);
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(50);

  const navItems: { id: PageView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Overview', icon: <Compass className="w-4 h-4" /> },
    { id: 'yoga', label: 'Yoga & Asanas', icon: <Heart className="w-4 h-4" /> },
    { id: 'meditation', label: 'Meditation & Breath', icon: <Wind className="w-4 h-4" /> },
    { id: 'cycle', label: 'Cycle Practice', icon: <Moon className="w-4 h-4" /> },
    { id: 'deep-dive', label: 'Deep Dive', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'ai-wellness', label: 'AI Wellness Guide', icon: <Bot className="w-4 h-4" /> },
    { id: 'knowledge', label: 'Knowledge Hub', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'dashboard', label: 'My Sanctuary', icon: <User className="w-4 h-4" /> },
  ];

  const handleSoundSelect = (type: 'rain' | 'ocean' | 'singing-bowl' | 'forest' | null) => {
    if (type === null || currentSound === type) {
      sound.stopAmbient();
      setCurrentSound(null);
    } else {
      sound.startAmbient(type);
      setCurrentSound(type);
    }
  };

  const handleMuteToggle = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVolumeState(val);
    sound.setVolume(val / 100);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7DFD5]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div
            id="nav-brand-logo"
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2D5A43] to-[#407B5C] flex items-center justify-center text-white shadow-sm shadow-[#2D5A43]/20 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C12 2 8 8 8 13C8 16.31 10.69 19 14 19C15.36 19 16.61 18.54 17.61 17.77C18.47 18.53 19.61 19 20.86 19C21.49 19 22.09 18.88 22.64 18.66C22.25 15.47 19.5 13 16.14 13C15.42 13 14.73 13.12 14.09 13.34C14.72 10.15 12 2 12 2Z" />
                <path opacity="0.6" d="M12 22C6.48 22 2 17.52 2 12C2 9.5 2.92 7.21 4.45 5.45C4.24 6.84 4.3 8.35 4.8 9.87C5.35 11.53 6.36 13.06 7.74 14.28C7.26 15.11 7 16.03 7 17C7 19.76 9.24 22 12 22Z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-serif font-medium tracking-tight text-[#1E2923]">
                FlowState
              </span>
              <span className="block text-[10px] font-sans font-semibold tracking-widest uppercase text-[#5E7969]">
                Mindful Living
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-[#EAE4DC] text-[#1E2923] shadow-xs'
                      : 'text-[#4A5D52] hover:text-[#1E2923] hover:bg-[#F3EFEA]'
                  }`}
                >
                  <span className={isActive ? 'text-[#2D5A43]' : 'text-[#7B9284]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Ambient Soundscape Toggle */}
            <div className="relative">
              <button
                id="ambient-sound-toggle-btn"
                onClick={() => setSoundMenuOpen(!soundMenuOpen)}
                className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 ${
                  currentSound
                    ? 'bg-[#E3EDE7] text-[#2D5A43] border border-[#C6DDD0]'
                    : 'bg-[#F2ECE4] text-[#55695E] hover:bg-[#EBE3D8]'
                }`}
                title="Ambient Soundscapes (Rain, Ocean, Singing Bowl)"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-600" />
                ) : (
                  <Volume2
                    className={`w-4 h-4 ${
                      currentSound ? 'text-[#2D5A43] animate-pulse' : 'text-[#6C8174]'
                    }`}
                  />
                )}
                <span className="hidden sm:inline capitalize">
                  {currentSound ? currentSound.replace('-', ' ') : 'Soundscape'}
                </span>
              </button>

              {/* Soundscape Dropdown Menu */}
              {soundMenuOpen && (
                <div
                  id="sound-controls-popover"
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E7DFD5] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F0EAE1]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#6F8678]">
                      Mindful Soundscapes
                    </span>
                    <button
                      onClick={handleMuteToggle}
                      className="text-xs text-[#7B9284] hover:text-[#1E2923] underline"
                    >
                      {isMuted ? 'Unmute' : 'Mute'}
                    </button>
                  </div>

                  <div className="space-y-1 mb-3">
                    {[
                      { id: 'singing-bowl', label: 'Tibetan 432Hz Drone', desc: 'Resonant harmonic peace' },
                      { id: 'ocean', label: 'Pacific Ocean Surf', desc: 'Rhythmic parasympathetic waves' },
                      { id: 'rain', label: 'Gentle Temple Rain', desc: 'Soothing pink noise' },
                      { id: 'forest', label: 'Forest Wind Whispers', desc: 'Calming soft air breeze' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleSoundSelect(s.id as any)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          currentSound === s.id
                            ? 'bg-[#E3EDE7] text-[#2D5A43] font-semibold'
                            : 'hover:bg-[#F9F7F4] text-[#4A5D52]'
                        }`}
                      >
                        <div>
                          <div>{s.label}</div>
                          <div className="text-[10px] text-[#7B9284]">{s.desc}</div>
                        </div>
                        {currentSound === s.id && (
                          <span className="w-2 h-2 rounded-full bg-[#2D5A43] animate-ping" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Volume Slider & Bell Test */}
                  <div className="pt-2 border-t border-[#F0EAE1] space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#6F8678]">
                      <span>Volume</span>
                      <span>{volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full h-1.5 bg-[#E7DFD5] rounded-lg appearance-none cursor-pointer accent-[#2D5A43]"
                    />

                    <button
                      onClick={() => sound.playSingingBowl(432, 3.5)}
                      className="w-full mt-1 py-1.5 text-[11px] font-medium text-[#2D5A43] bg-[#E8F0EC] hover:bg-[#D9E6DF] rounded-lg transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>🔔 Ring Tibetan Singing Bowl</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Daily Streak Badge */}
            <div
              id="streak-indicator-badge"
              onClick={() => onNavigate('dashboard')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#F6EFE6] border border-[#E9DFD2] cursor-pointer hover:bg-[#EFE5D9] transition-all"
              title={`${streakDays} Day Mindful Practice Streak`}
            >
              <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span className="text-xs font-bold text-[#5C4533]">{streakDays}d Streak</span>
            </div>

            {/* Quick AI Companion Button */}
            <button
              id="quick-ai-button"
              onClick={() => onNavigate('ai-wellness')}
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-medium shadow-xs shadow-[#2D5A43]/20 transition-all hover:scale-102"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Ask AI Guide</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              id="mobile-nav-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#4A5D52] hover:bg-[#F2ECE4] transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E7DFD5] bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-1 animate-in slide-in-from-top-3">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#EAE4DC] text-[#1E2923] font-semibold'
                    : 'text-[#4A5D52] hover:bg-[#F3EFEA]'
                }`}
              >
                <span className={isActive ? 'text-[#2D5A43]' : 'text-[#7B9284]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-3 border-t border-[#E7DFD5]">
            <button
              onClick={() => {
                onNavigate('ai-wellness');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#2D5A43] text-white text-sm font-medium"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Open AI Wellness Companion</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
