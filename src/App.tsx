import React, { useState, useEffect } from 'react';
import { PageView, UserProfile, Asana } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { YogaView } from './components/YogaView';
import { MeditationView } from './components/MeditationView';
import { CyclePracticeView } from './components/CyclePracticeView';
import { DeepDiveView } from './components/DeepDiveView';
import { AIWellnessView } from './components/AIWellnessView';
import { KnowledgeHubView } from './components/KnowledgeHubView';
import { DashboardView } from './components/DashboardView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');

  // User Profile & Stats (persisted locally)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('flowstate_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      name: 'Seeker',
      currentCycleDay: 8,
      streakDays: 4,
      totalMindfulMinutes: 145,
      sessionsCompleted: 12,
      favoriteAsanaIds: ['balasana', 'adho-mukha-svanasana', 'viparita-karani'],
      savedArticleIds: ['science-of-pranayama'],
      cycleTrackingEnabled: true,
      primaryGoal: 'Stress Relief & Sleep',
      moodLogs: [],
    };
  });

  const [favoriteIds, setFavoriteIds] = useState<string[]>(userProfile.favoriteAsanaIds);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(userProfile.savedArticleIds);

  // Inspection asana state
  const [initialSelectedAsana, setInitialSelectedAsana] = useState<Asana | null>(null);

  // Save profile changes
  useEffect(() => {
    const updated: UserProfile = {
      ...userProfile,
      favoriteAsanaIds: favoriteIds,
      savedArticleIds: bookmarkedIds,
    };
    try {
      localStorage.setItem('flowstate_profile', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  }, [userProfile, favoriteIds, bookmarkedIds]);

  // Practice session completion logger
  const handleSessionComplete = (minutes: number) => {
    setUserProfile((prev) => ({
      ...prev,
      totalMindfulMinutes: prev.totalMindfulMinutes + minutes,
      sessionsCompleted: prev.sessionsCompleted + 1,
      streakDays: prev.streakDays + 1,
    }));
  };

  // Favorites toggle
  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bookmarks toggle
  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Cycle Day update
  const handleUpdateCycleDay = (day: number) => {
    setUserProfile((prev) => ({
      ...prev,
      currentCycleDay: day,
    }));
  };

  // Flow launcher from any page
  const handleStartFlow = (asanas: Asana[], title: string) => {
    setCurrentPage('yoga');
  };

  // Inspect specific asana
  const handleSelectAsana = (asana: Asana) => {
    setInitialSelectedAsana(asana);
    setCurrentPage('yoga');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1D2B22] font-sans selection:bg-[#2D5A43] selection:text-white antialiased">
      {/* Navigation Header with Sound & Cycle indicators */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        streakDays={userProfile.streakDays}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomeView
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectAsana={handleSelectAsana}
            onStartFlow={handleStartFlow}
            currentCycleDay={userProfile.currentCycleDay}
          />
        )}

        {currentPage === 'yoga' && (
          <YogaView
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            onSessionComplete={handleSessionComplete}
            initialSelectedAsana={initialSelectedAsana}
            onClearInitialSelected={() => setInitialSelectedAsana(null)}
          />
        )}

        {currentPage === 'meditation' && (
          <MeditationView onSessionComplete={handleSessionComplete} />
        )}

        {currentPage === 'cycle' && (
          <CyclePracticeView
            currentCycleDay={userProfile.currentCycleDay}
            onUpdateCycleDay={handleUpdateCycleDay}
            onStartFlow={handleStartFlow}
            onSelectAsana={handleSelectAsana}
          />
        )}

        {currentPage === 'deep-dive' && (
          <DeepDiveView onSessionComplete={handleSessionComplete} />
        )}

        {currentPage === 'ai-wellness' && (
          <AIWellnessView
            currentCycleDay={userProfile.currentCycleDay}
            onStartFlow={handleStartFlow}
          />
        )}

        {currentPage === 'knowledge' && (
          <KnowledgeHubView
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardView
            userProfile={userProfile}
            favoriteIds={favoriteIds}
            bookmarkedIds={bookmarkedIds}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectAsana={handleSelectAsana}
            onStartFlow={handleStartFlow}
            onUpdateCycleDay={handleUpdateCycleDay}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
