import React, { useState } from 'react';
import { UserProfile, Asana, PageView, KnowledgeArticle } from '../types';
import { ASANAS, CYCLE_PHASES, KNOWLEDGE_ARTICLES } from '../data/wellnessData';
import { AsanaIllustration } from './AsanaIllustrations';
import { sound } from '../utils/audio';
import {
  Flame,
  Clock,
  CheckCircle2,
  Calendar,
  Heart,
  Bookmark,
  Sparkles,
  ArrowRight,
  Smile,
  Activity,
  Play,
  Moon,
} from 'lucide-react';

interface DashboardViewProps {
  userProfile: UserProfile;
  favoriteIds: string[];
  bookmarkedIds: string[];
  onNavigate: (page: PageView) => void;
  onSelectAsana: (asana: Asana) => void;
  onStartFlow: (asanas: Asana[], title: string) => void;
  onUpdateCycleDay: (day: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  favoriteIds,
  bookmarkedIds,
  onNavigate,
  onSelectAsana,
  onStartFlow,
  onUpdateCycleDay,
}) => {
  const [loggedFeeling, setLoggedFeeling] = useState<string | null>(null);

  const favAsanas = ASANAS.filter((a: Asana) => favoriteIds.includes(a.id));
  const bookmarkedArticles = KNOWLEDGE_ARTICLES.filter((a: KnowledgeArticle) => bookmarkedIds.includes(a.id));

  const currentPhase =
    userProfile.currentCycleDay <= 5
      ? CYCLE_PHASES[0]
      : userProfile.currentCycleDay <= 12
      ? CYCLE_PHASES[1]
      : userProfile.currentCycleDay <= 16
      ? CYCLE_PHASES[2]
      : CYCLE_PHASES[3];

  const feelings = ['Calm & Grounded', 'Restless', 'Stiff in Shoulders', 'Radiant Energy', 'Tender & Depleted'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4 border-b border-[#E7DFD5] pb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#5E7969] block mb-2">
            Your Sanctuary Ledger
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1A251E] tracking-tight">
            Personal Practice Journal
          </h1>
          <p className="text-sm sm:text-base text-[#4E6457] mt-2 max-w-xl font-light">
            Reflecting your dedication to nervous system equilibrium, breath awareness, and cyclical bodily presence.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('yoga')}
            className="px-5 py-2.5 rounded-xl bg-[#2D5A43] hover:bg-[#204030] text-white text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center space-x-1.5 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Practice Today</span>
          </button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Streak */}
        <div className="bg-white p-6 rounded-3xl border border-[#E7DFD5] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1C2820]">
              {userProfile.streakDays} Days
            </div>
            <div className="text-xs text-[#6F8677] uppercase tracking-wider font-semibold">
              Conscious Streak
            </div>
          </div>
        </div>

        {/* Mindful Minutes */}
        <div className="bg-white p-6 rounded-3xl border border-[#E7DFD5] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1C2820]">
              {userProfile.totalMindfulMinutes}
            </div>
            <div className="text-xs text-[#6F8677] uppercase tracking-wider font-semibold">
              Mindful Minutes
            </div>
          </div>
        </div>

        {/* Practices Completed */}
        <div className="bg-white p-6 rounded-3xl border border-[#E7DFD5] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#1C2820]">
              {userProfile.sessionsCompleted}
            </div>
            <div className="text-xs text-[#6F8677] uppercase tracking-wider font-semibold">
              Practices Done
            </div>
          </div>
        </div>

        {/* Current Cycle Phase */}
        <div
          onClick={() => onNavigate('cycle')}
          className="bg-white p-6 rounded-3xl border border-[#E7DFD5] shadow-xs flex items-center space-x-4 cursor-pointer hover:border-[#BED6C7] transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Moon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-serif font-bold text-[#1C2820]">
              Day {userProfile.currentCycleDay}
            </div>
            <div className="text-xs text-[#6F8677] uppercase tracking-wider font-semibold">
              {currentPhase.phase} Phase
            </div>
          </div>
        </div>
      </div>

      {/* Daily Somatic Check-In */}
      <section className="bg-gradient-to-r from-[#F7F3EE] via-[#EEF5F1] to-[#F7F0E8] p-6 sm:p-8 rounded-3xl border border-[#E2DDD3] space-y-4 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#3D6B51]">
          <Activity className="w-4 h-4" />
          <span>Daily Somatic Check-in</span>
        </div>

        <h3 className="text-xl font-serif text-[#1C2820]">
          How is your nervous system landing right now?
        </h3>

        <div className="flex flex-wrap gap-2.5 pt-1">
          {feelings.map((feeling, idx) => (
            <button
              key={idx}
              onClick={() => {
                setLoggedFeeling(feeling);
                sound.playSingingBowl(432, 1.5);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-medium transition-all ${
                loggedFeeling === feeling
                  ? 'bg-[#2D5A43] text-white shadow-xs'
                  : 'bg-white hover:bg-[#F2EDE5] text-[#2C3E33] border border-[#DDD5CA]'
              }`}
            >
              {feeling}
            </button>
          ))}
        </div>

        {loggedFeeling && (
          <div className="text-xs text-[#385645] bg-white/80 p-3 rounded-xl border border-white/80 animate-in fade-in">
            Logged <strong>"{loggedFeeling}"</strong>. We suggest honoring this physical sensation with gentle spinal flexion or Box Breathing.
          </div>
        )}
      </section>

      {/* Favorite Asanas */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-serif text-[#1C2820]">
            Saved Asanas ({favAsanas.length})
          </h3>
          <button
            onClick={() => onNavigate('yoga')}
            className="text-xs text-[#2D5A43] hover:underline font-semibold"
          >
            Explore Library
          </button>
        </div>

        {favAsanas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favAsanas.map((asana: Asana) => (
              <div
                key={asana.id}
                onClick={() => onSelectAsana(asana)}
                className="bg-white rounded-3xl border border-[#E7DFD5] p-5 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="h-32 w-full bg-[#FAF8F5] rounded-2xl p-3 flex items-center justify-center text-[#2D5A43] mb-3 group-hover:bg-[#F3EFEA] transition-colors">
                    <AsanaIllustration type={asana.svgType} className="w-full h-full max-h-24" />
                  </div>
                  <h4 className="text-base font-serif text-[#1C2820] group-hover:text-[#2D5A43] transition-colors">
                    {asana.name}
                  </h4>
                  <p className="text-[11px] italic font-serif text-[#6D8777]">
                    {asana.sanskritName}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#F2EDE5] text-[11px] text-[#7B9585] flex items-center justify-between mt-3">
                  <span>{Math.round(asana.durationSeconds / 60)} min hold</span>
                  <span className="text-[#2D5A43] font-medium group-hover:underline">View</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-[#E7DFD5] text-center text-xs text-[#6F8A79]">
            No favorite postures saved yet. Tap the heart icon on any posture in the Asana Library to add it here.
          </div>
        )}
      </section>

      {/* Bookmarked Articles */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-serif text-[#1C2820]">
            Saved Reading ({bookmarkedArticles.length})
          </h3>
          <button
            onClick={() => onNavigate('knowledge')}
            className="text-xs text-[#2D5A43] hover:underline font-semibold"
          >
            Visit Knowledge Hub
          </button>
        </div>

        {bookmarkedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookmarkedArticles.map((art: KnowledgeArticle) => (
              <div
                key={art.id}
                onClick={() => onNavigate('knowledge')}
                className="bg-white p-6 rounded-3xl border border-[#E7DFD5] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2D5A43] bg-[#E8F1EC] px-2.5 py-0.5 rounded-full">
                    {art.category}
                  </span>
                  <h4 className="text-lg font-serif text-[#1C2820] mt-2 mb-1">{art.title}</h4>
                  <p className="text-xs text-[#526B5C] line-clamp-2">{art.summary}</p>
                </div>
                <div className="mt-4 pt-2 border-t border-[#F2EDE5] text-xs text-[#2D5A43] font-medium flex items-center space-x-1">
                  <span>Open Knowledge Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-[#E7DFD5] text-center text-xs text-[#6F8A79]">
            No articles bookmarked yet. Explore the Knowledge Hub to save neurobiology and somatics research.
          </div>
        )}
      </section>
    </div>
  );
};
