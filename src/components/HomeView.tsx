import React from 'react';
import { PageView, Asana, PranayamaExercise } from '../types';
import { ASANAS, PRANAYAMA_EXERCISES, CYCLE_PHASES } from '../data/wellnessData';
import { AsanaIllustration } from './AsanaIllustrations';
import { sound } from '../utils/audio';
import {
  Sparkles,
  ArrowRight,
  Wind,
  Moon,
  Bot,
  Heart,
  CheckCircle2,
  Clock,
  Compass,
  Play,
  Flower2,
  Shield,
  Smile,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (page: PageView) => void;
  onSelectAsana: (asana: Asana) => void;
  onStartFlow: (asanas: Asana[], title: string) => void;
  currentCycleDay: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onSelectAsana,
  onStartFlow,
  currentCycleDay,
}) => {
  // Current phase calculation
  const currentPhase =
    currentCycleDay <= 5
      ? CYCLE_PHASES[0]
      : currentCycleDay <= 12
      ? CYCLE_PHASES[1]
      : currentCycleDay <= 16
      ? CYCLE_PHASES[2]
      : CYCLE_PHASES[3];

  const featuredAsana = ASANAS[0]; // Balasana
  const featuredPranayama: PranayamaExercise = PRANAYAMA_EXERCISES[0]; // Box Breathing

  // Quick 10-min morning sequence
  const morningFlowAsanas = [
    ASANAS.find((a) => a.id === 'marjaryasana-bitilasana')!,
    ASANAS.find((a) => a.id === 'adho-mukha-svanasana')!,
    ASANAS.find((a) => a.id === 'virabhadrasana-ii')!,
    ASANAS.find((a) => a.id === 'vrikshasana')!,
    ASANAS.find((a) => a.id === 'savasana')!,
  ].filter(Boolean);

  const handleQuickFlow = () => {
    sound.playSingingBowl(432, 2.5);
    onStartFlow(morningFlowAsanas, 'Morning Awakening Flow (10 Min)');
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20">
        {/* Soft background ambient gradient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#EAEFEA]/80 via-[#F5F2EC]/40 to-transparent pointer-events-none -z-10 rounded-3xl" />

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E5ECE7] border border-[#CDE0D4] text-[#294F3B] text-xs font-medium mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Holistic Infradian & Somatic Wellness Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-normal text-[#1A251E] tracking-tight leading-[1.15] mb-6">
            Find your natural rhythm.{' '}
            <span className="italic font-serif text-[#2D5A43] block sm:inline">
              Restore your sacred flow.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4D6355] max-w-2xl mx-auto leading-relaxed mb-10 font-sans font-light">
            A sanctuary combining timeless yoga asanas, restorative pranayama breathwork, infradian cycle syncing, and intelligent AI wellness guidance.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              id="hero-quick-flow-btn"
              onClick={handleQuickFlow}
              className="px-6 py-3.5 rounded-2xl bg-[#2D5A43] hover:bg-[#234734] text-white font-medium text-sm shadow-md shadow-[#2D5A43]/20 flex items-center space-x-2.5 transition-all hover:scale-102"
            >
              <Play className="w-4 h-4 fill-current text-emerald-200" />
              <span>Begin 10-Min Flow</span>
            </button>

            <button
              id="hero-explore-asanas-btn"
              onClick={() => onNavigate('yoga')}
              className="px-6 py-3.5 rounded-2xl bg-[#F0EAE1] hover:bg-[#E6DED3] text-[#24352B] font-medium text-sm border border-[#DDD3C6] flex items-center space-x-2 transition-all"
            >
              <span>Explore 12 Core Asanas</span>
              <ArrowRight className="w-4 h-4 text-[#5D7767]" />
            </button>

            <button
              id="hero-consult-ai-btn"
              onClick={() => onNavigate('ai-wellness')}
              className="px-5 py-3.5 rounded-2xl bg-white hover:bg-[#F9F7F4] text-[#2D5A43] font-medium text-sm border border-[#CDE0D4] flex items-center space-x-2 transition-all shadow-xs"
            >
              <Bot className="w-4 h-4 text-[#2D5A43]" />
              <span>Consult AI Companion</span>
            </button>
          </div>
        </div>

        {/* Featured Daily Routine Card Banner */}
        <div className="max-w-5xl mx-auto mt-14 px-4 sm:px-6">
          <div className="bg-gradient-to-r from-[#F6F3EE] via-[#EBF2EE] to-[#F7EFE8] rounded-3xl p-6 sm:p-8 border border-[#E2DDD3] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#3D6B51]">
                <Flower2 className="w-4 h-4" />
                <span>Today's Adaptive Recommendation</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-[#1C2820]">
                {currentPhase.title} Practice
              </h3>
              <p className="text-sm text-[#4C6454] max-w-xl leading-relaxed">
                Currently in <strong className="font-semibold">{currentPhase.phase} Phase</strong> (Cycle Day {currentCycleDay}): {currentPhase.yogaFocus}
              </p>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
              <button
                onClick={() => onNavigate('cycle')}
                className="w-full md:w-auto px-5 py-3 rounded-xl bg-white hover:bg-[#F7F4EE] text-[#1E2B22] text-xs font-semibold uppercase tracking-wider border border-[#D5CFC4] shadow-2xs transition-all text-center"
              >
                View Cycle Guide
              </button>
              <button
                onClick={handleQuickFlow}
                className="w-full md:w-auto px-5 py-3 rounded-xl bg-[#2D5A43] hover:bg-[#224433] text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center space-x-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Practice</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars of FlowState */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#5E7969] block mb-2">
            The Holistic Architecture
          </span>
          <h2 className="text-3xl font-serif text-[#1A251E]">
            A complete ecosystem for mind and body
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Yoga Asanas */}
          <div
            id="pillar-card-yoga"
            onClick={() => onNavigate('yoga')}
            className="group bg-white p-7 rounded-3xl border border-[#E7DFD5] hover:border-[#BED6C7] hover:shadow-lg hover:shadow-[#2D5A43]/5 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E8F1EC] text-[#2D5A43] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-medium text-[#1A251E] mb-2">
                Yoga & Asana Precision
              </h3>
              <p className="text-sm text-[#52685B] leading-relaxed mb-4">
                Explore authentic postures with Sanskrit anatomy, step-by-step alignment cues, and live guided session pacing.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-[#2D5A43] space-x-1 group-hover:translate-x-1 transition-transform">
              <span>Enter Asana Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Breath & Meditation */}
          <div
            id="pillar-card-meditation"
            onClick={() => onNavigate('meditation')}
            className="group bg-white p-7 rounded-3xl border border-[#E7DFD5] hover:border-[#BED6C7] hover:shadow-lg hover:shadow-[#2D5A43]/5 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EBF0F5] text-[#2F5472] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-medium text-[#1A251E] mb-2">
                Pranayama & Meditation
              </h3>
              <p className="text-sm text-[#52685B] leading-relaxed mb-4">
                Harmonize your autonomic nervous system using an expanding breathwork pacer and resonant 432 Hz singing bowls.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-[#2F5472] space-x-1 group-hover:translate-x-1 transition-transform">
              <span>Begin Breath Practice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Cycle Syncing */}
          <div
            id="pillar-card-cycle"
            onClick={() => onNavigate('cycle')}
            className="group bg-white p-7 rounded-3xl border border-[#E7DFD5] hover:border-[#BED6C7] hover:shadow-lg hover:shadow-[#2D5A43]/5 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F6EDE9] text-[#A34E3B] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Moon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-medium text-[#1A251E] mb-2">
                Infradian Cycle Syncing
              </h3>
              <p className="text-sm text-[#52685B] leading-relaxed mb-4">
                Tailor movement, intensity, and nutrition across the 4 hormonal seasons to prevent burnout and support fertility.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-[#A34E3B] space-x-1 group-hover:translate-x-1 transition-transform">
              <span>View Cycle Guidance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: AI Wellness Companion */}
          <div
            id="pillar-card-ai"
            onClick={() => onNavigate('ai-wellness')}
            className="group bg-white p-7 rounded-3xl border border-[#E7DFD5] hover:border-[#BED6C7] hover:shadow-lg hover:shadow-[#2D5A43]/5 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F7F2E8] text-[#9A7029] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-medium text-[#1A251E] mb-2">
                AI Wellness Coach
              </h3>
              <p className="text-sm text-[#52685B] leading-relaxed mb-4">
                Powered by Gemini. Receive personalized sequences adapted to your physical tension, energy, and cycle day.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-[#9A7029] space-x-1 group-hover:translate-x-1 transition-transform">
              <span>Chat with Coach</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pair: Asana of the Day & Pranayama Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Asana Spotlight */}
          <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-[#E5DDD2] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#577262] bg-[#E5EDE7] px-3 py-1 rounded-full">
                  Asana Spotlight
                </span>
                <span className="text-xs text-[#7A9384] flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{Math.round(featuredAsana.durationSeconds / 60)} min hold</span>
                </span>
              </div>

              <div className="flex items-baseline space-x-3 mb-2">
                <h3 className="text-2xl font-serif text-[#1C2820]">
                  {featuredAsana.name}
                </h3>
                <span className="text-sm italic font-serif text-[#5E7969]">
                  ({featuredAsana.sanskritName})
                </span>
              </div>

              <p className="text-sm text-[#4D6556] leading-relaxed mb-6">
                {featuredAsana.benefits[0]}. A cornerstone pose for calming hyperactive nervous systems and decompressing the spine.
              </p>

              {/* Minimal Line Art Illustration */}
              <div className="h-44 w-full bg-white rounded-2xl border border-[#E7DFD5] p-4 flex items-center justify-center text-[#2D5A43] mb-6">
                <AsanaIllustration type={featuredAsana.svgType} className="w-full h-full max-h-36" />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => onSelectAsana(featuredAsana)}
                className="flex-1 py-3 rounded-xl bg-[#2D5A43] hover:bg-[#224433] text-white text-xs font-semibold uppercase tracking-wider transition-all text-center shadow-xs"
              >
                Inspect Cues & Steps
              </button>
              <button
                onClick={() => onNavigate('yoga')}
                className="px-4 py-3 rounded-xl bg-white hover:bg-[#F2ECE4] text-[#34483C] text-xs font-semibold border border-[#D5CFC4] transition-all"
              >
                Browse All Poses
              </button>
            </div>
          </div>

          {/* Pranayama Spotlight */}
          <div className="bg-[#F2F6F4] p-8 rounded-3xl border border-[#D1E0D7] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2F5A41] bg-[#DBE8E0] px-3 py-1 rounded-full">
                  Pranayama Spotlight
                </span>
                <span className="text-xs text-[#5D826E]">
                  Pattern: {featuredPranayama.inhale}-{featuredPranayama.hold1}-{featuredPranayama.exhale}-{featuredPranayama.hold2}
                </span>
              </div>

              <div className="flex items-baseline space-x-3 mb-2">
                <h3 className="text-2xl font-serif text-[#1C2820]">
                  {featuredPranayama.name}
                </h3>
              </div>

              <p className="text-sm text-[#4A6455] leading-relaxed mb-6">
                {featuredPranayama.subtitle}. Equal ratio breathing designed to induce instantaneous poise, equilibrium, and mental stillness.
              </p>

              {/* Interactive Breathing Rhythm Preview */}
              <div className="h-44 w-full bg-white rounded-2xl border border-[#D5E4DB] p-6 flex flex-col items-center justify-center text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3D7A5A] to-[#2D5A43] flex items-center justify-center text-white shadow-md animate-pulse">
                  <Wind className="w-8 h-8" />
                </div>
                <span className="text-xs font-medium text-[#405D4D] mt-3">
                  4s Inhale • 4s Hold • 4s Exhale • 4s Rest
                </span>
                <span className="text-[11px] text-[#799988]">6 Conscious Cycles recommended</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => onNavigate('meditation')}
                className="flex-1 py-3 rounded-xl bg-[#2D5A43] hover:bg-[#224433] text-white text-xs font-semibold uppercase tracking-wider transition-all text-center shadow-xs"
              >
                Launch Breath Pacer
              </button>
              <button
                onClick={() => onNavigate('deep-dive')}
                className="px-4 py-3 rounded-xl bg-white hover:bg-[#EAF0EC] text-[#34483C] text-xs font-semibold border border-[#BED2C5] transition-all"
              >
                View Deep Dives
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Somatic Trust & Testimonials */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-[#E7DFD5] p-8 sm:p-12 shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#5D7968] mb-4">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>The Mindful Guarantee</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif text-[#19241D] mb-6">
            "Yoga is not about touching your toes; it is about what you learn on the way down."
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#F0EAE1]">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-[#2D5A43] shrink-0 mt-0.5" />
              <div>
                <h5 className="text-sm font-semibold text-[#1C2820]">Safe Alignment Cues</h5>
                <p className="text-xs text-[#5C7466] leading-relaxed">
                  Clear contraindications and modifications for every spinal state.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-[#2D5A43] shrink-0 mt-0.5" />
              <div>
                <h5 className="text-sm font-semibold text-[#1C2820]">Cycle-Aware Pacing</h5>
                <p className="text-xs text-[#5C7466] leading-relaxed">
                  Honoring the 28-day hormonal rhythm rather than rigid daily strain.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-[#2D5A43] shrink-0 mt-0.5" />
              <div>
                <h5 className="text-sm font-semibold text-[#1C2820]">Synthesized Audio</h5>
                <p className="text-xs text-[#5C7466] leading-relaxed">
                  Authentic 432Hz bowls and natural soundscapes computed on-device.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
