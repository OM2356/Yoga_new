import React, { useState } from 'react';
import { CyclePhaseInfo, Asana } from '../types';
import { CYCLE_PHASES, ASANAS } from '../data/wellnessData';
import { AsanaIllustration } from './AsanaIllustrations';
import { sound } from '../utils/audio';
import {
  Moon,
  Sun,
  Flame,
  Snowflake,
  Wind,
  Play,
  Heart,
  Calendar,
  Sparkles,
  ArrowRight,
  Utensils,
  ShieldAlert,
} from 'lucide-react';

interface CyclePracticeViewProps {
  currentCycleDay: number;
  onUpdateCycleDay: (day: number) => void;
  onStartFlow: (asanas: Asana[], title: string) => void;
  onSelectAsana: (asana: Asana) => void;
}

export const CyclePracticeView: React.FC<CyclePracticeViewProps> = ({
  currentCycleDay,
  onUpdateCycleDay,
  onStartFlow,
  onSelectAsana,
}) => {
  const [selectedDay, setSelectedDay] = useState(currentCycleDay);

  // Active selected phase
  const activePhase: CyclePhaseInfo =
    selectedDay <= 5
      ? CYCLE_PHASES[0]
      : selectedDay <= 12
      ? CYCLE_PHASES[1]
      : selectedDay <= 16
      ? CYCLE_PHASES[2]
      : CYCLE_PHASES[3];

  const phaseAsanas = ASANAS.filter((a) => activePhase.recommendedAsanaIds.includes(a.id));

  const handleStartPhasePractice = () => {
    sound.playSingingBowl(432, 2.5);
    onStartFlow(phaseAsanas, `${activePhase.phase} Phase Practice (${activePhase.season})`);
  };

  const getPhaseSeasonIcon = (season: string) => {
    switch (season) {
      case 'Winter':
        return <Snowflake className="w-5 h-5 text-rose-700" />;
      case 'Spring':
        return <Wind className="w-5 h-5 text-emerald-700" />;
      case 'Summer':
        return <Sun className="w-5 h-5 text-amber-600" />;
      default:
        return <Flame className="w-5 h-5 text-orange-700" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4 border-b border-[#E7DFD5] pb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#5E7969] block mb-2">
            Infradian Biology
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1A251E] tracking-tight">
            Cycle Syncing & Hormonal Flow
          </h1>
          <p className="text-sm sm:text-base text-[#4E6457] mt-2 max-w-xl font-light">
            Align your movement, breathwork, and nutrition with the four biological seasons of your monthly infradian rhythm.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-white border border-[#E7DFD5] shadow-xs flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-[#2D5A43]" />
            <div>
              <div className="text-[10px] text-[#789383] uppercase tracking-wider font-semibold">
                Your Current Day
              </div>
              <div className="text-sm font-bold text-[#1C2820]">
                Day {selectedDay} • {activePhase.phase}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 28-Day Cycle Wheel / Timeline */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7DFD5] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-serif text-[#1A251E]">28-Day Biological Rhythm Tracker</h3>
            <p className="text-xs text-[#5D7666]">
              Drag the day slider or tap a day to explore phase-tailored yogic recommendations.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#2D5A43] bg-[#E8F1EC] px-3 py-1 rounded-full">
              Day {selectedDay} of 28
            </span>
            <button
              onClick={() => onUpdateCycleDay(selectedDay)}
              className="text-xs text-[#2D5A43] hover:underline font-medium"
            >
              Set as my current day
            </button>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-3 pt-2">
          <input
            id="cycle-day-slider"
            type="range"
            min="1"
            max="28"
            value={selectedDay}
            onChange={(e) => setSelectedDay(parseInt(e.target.value, 10))}
            className="w-full h-3 bg-gradient-to-r from-rose-200 via-emerald-200 via-amber-200 to-orange-200 rounded-lg appearance-none cursor-pointer accent-[#2D5A43]"
          />

          {/* 4 Phase Segment Legend */}
          <div className="grid grid-cols-4 gap-2 text-center pt-2">
            {[
              { phase: 'Menstrual', range: '1-5', color: 'text-rose-800 bg-rose-50 border-rose-200' },
              { phase: 'Follicular', range: '6-12', color: 'text-emerald-800 bg-emerald-50 border-emerald-200' },
              { phase: 'Ovulatory', range: '13-16', color: 'text-amber-800 bg-amber-50 border-amber-200' },
              { phase: 'Luteal', range: '17-28', color: 'text-orange-800 bg-orange-50 border-orange-200' },
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  const day = i === 0 ? 1 : i === 1 ? 8 : i === 2 ? 14 : 20;
                  setSelectedDay(day);
                }}
                className={`py-2 px-1 rounded-xl border text-[11px] font-medium transition-all ${
                  p.color
                } ${activePhase.phase === p.phase ? 'ring-2 ring-[#2D5A43]' : 'opacity-70 hover:opacity-100'}`}
              >
                <div className="font-semibold">{p.phase}</div>
                <div className="text-[10px] opacity-75">Days {p.range}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Phase Deep Dive Banner */}
      <section className={`rounded-3xl p-8 sm:p-10 border transition-all ${activePhase.bgClass} ${activePhase.accentClass}`}>
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-white shadow-xs">
                {getPhaseSeasonIcon(activePhase.season)}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#243A2C]">
                {activePhase.dayRange} • {activePhase.title}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif text-[#152319]">
              {activePhase.phase} Phase
            </h2>

            <p className="text-sm text-[#384F40] leading-relaxed">
              {activePhase.hormoneNote}
            </p>

            <div className="bg-white/80 p-5 rounded-2xl border border-white/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2D5A43] block">
                Practice Guidance & Energy Focus
              </span>
              <p className="text-xs text-[#3A5243] leading-relaxed">
                {activePhase.yogaFocus}
              </p>
            </div>
          </div>

          {/* Quick Action & Nutrition Card */}
          <div className="w-full lg:w-96 bg-white p-6 rounded-3xl border border-[#E7DFD5] shadow-xs flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#526D5D] mb-3">
                <Utensils className="w-4 h-4 text-emerald-600" />
                <span>Nourishing Food Pairings</span>
              </div>
              <ul className="space-y-2 text-xs text-[#42594A]">
                {activePhase.nutritionTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleStartPhasePractice}
              className="w-full py-3.5 rounded-2xl bg-[#2D5A43] hover:bg-[#204030] text-white text-xs font-semibold uppercase tracking-wider shadow-md flex items-center justify-center space-x-2 transition-all hover:scale-102"
            >
              <Play className="w-4 h-4 fill-current text-emerald-200" />
              <span>Start {activePhase.phase} Flow</span>
            </button>
          </div>
        </div>
      </section>

      {/* Recommended Poses for This Phase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif text-[#1C2820]">
              Recommended Asanas for {activePhase.phase}
            </h3>
            <p className="text-xs text-[#637C6D]">
              Carefully chosen to support circulation and pelvic ease during this biological phase.
            </p>
          </div>
          <button
            onClick={handleStartPhasePractice}
            className="text-xs text-[#2D5A43] hover:underline font-semibold flex items-center space-x-1"
          >
            <span>Play All {phaseAsanas.length} Poses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {phaseAsanas.map((asana) => (
            <div
              key={asana.id}
              onClick={() => onSelectAsana(asana)}
              className="bg-white rounded-3xl border border-[#E7DFD5] p-5 hover:shadow-md hover:border-[#BFD5C7] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4E6A5A] bg-[#E8F0EC] px-2.5 py-0.5 rounded-full">
                  {asana.level}
                </span>

                <div className="h-32 w-full bg-[#FAF8F5] rounded-2xl p-3 flex items-center justify-center text-[#2D5A43] my-3 group-hover:bg-[#F3EFEA] transition-colors">
                  <AsanaIllustration type={asana.svgType} className="w-full h-full max-h-24" />
                </div>

                <h4 className="text-base font-serif text-[#1C2820] group-hover:text-[#2D5A43] transition-colors">
                  {asana.name}
                </h4>
                <p className="text-[11px] italic font-serif text-[#6D8777] mb-2">
                  {asana.sanskritName}
                </p>
              </div>

              <div className="pt-2 border-t border-[#F2EDE5] text-[11px] text-[#7B9585] flex items-center justify-between">
                <span>{Math.round(asana.durationSeconds / 60)} min hold</span>
                <span className="text-[#2D5A43] font-medium group-hover:underline">Inspect</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
