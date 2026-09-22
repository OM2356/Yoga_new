import React, { useState } from 'react';
import { Asana } from '../types';
import { ASANAS } from '../data/wellnessData';
import { AsanaIllustration } from './AsanaIllustrations';
import { sound } from '../utils/audio';
import {
  Search,
  SlidersHorizontal,
  Play,
  Heart,
  Clock,
  Sparkles,
  Info,
  CheckCircle,
  X,
  ChevronRight,
  Plus,
  Trash2,
  Volume2,
} from 'lucide-react';

interface YogaViewProps {
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  onSessionComplete: (minutes: number) => void;
  initialSelectedAsana?: Asana | null;
  onClearInitialSelected?: () => void;
}

export const YogaView: React.FC<YogaViewProps> = ({
  favoriteIds,
  onToggleFavorite,
  onSessionComplete,
  initialSelectedAsana,
  onClearInitialSelected,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedEnergy, setSelectedEnergy] = useState<string>('All');
  const [selectedCyclePhase, setSelectedCyclePhase] = useState<string>('All');

  // Modal inspection state
  const [inspectAsana, setInspectAsana] = useState<Asana | null>(initialSelectedAsana || null);

  // Custom Sequence Drawer
  const [customSequence, setCustomSequence] = useState<Asana[]>([
    ASANAS[0],
    ASANAS[5],
    ASANAS[1],
    ASANAS[11],
  ]);
  const [sequenceDrawerOpen, setSequenceDrawerOpen] = useState(false);

  // Active Flow Player State
  const [isPlayingFlow, setIsPlayingFlow] = useState(false);
  const [flowAsanas, setFlowAsanas] = useState<Asana[]>([]);
  const [flowTitle, setFlowTitle] = useState('');
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [poseSecondsRemaining, setPoseSecondsRemaining] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [flowCompleted, setFlowCompleted] = useState(false);

  // Handle flow timer
  React.useEffect(() => {
    let timer: any = null;
    if (isPlayingFlow && !isPaused && !flowCompleted) {
      timer = setInterval(() => {
        setPoseSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Advance to next pose
            if (currentPoseIndex < flowAsanas.length - 1) {
              sound.playTransitionChime();
              setCurrentPoseIndex((idx) => idx + 1);
              const nextPose = flowAsanas[currentPoseIndex + 1];
              return nextPose ? nextPose.durationSeconds : 60;
            } else {
              // Flow complete!
              sound.playSingingBowl(432, 4);
              setFlowCompleted(true);
              const totalSec = flowAsanas.reduce((acc, p) => acc + p.durationSeconds, 0);
              onSessionComplete(Math.max(1, Math.round(totalSec / 60)));
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlayingFlow, isPaused, currentPoseIndex, flowAsanas, flowCompleted]);

  // Start a flow
  const startFlowSession = (asanas: Asana[], title: string) => {
    if (asanas.length === 0) return;
    sound.playSingingBowl(432, 3);
    setFlowAsanas(asanas);
    setFlowTitle(title);
    setCurrentPoseIndex(0);
    setPoseSecondsRemaining(asanas[0].durationSeconds);
    setIsPaused(false);
    setFlowCompleted(false);
    setIsPlayingFlow(true);
  };

  // Preset flows
  const presetFlows = [
    {
      title: 'Gentle Spinal Decompression',
      duration: '10 min',
      poses: [ASANAS[0], ASANAS[5], ASANAS[6], ASANAS[9], ASANAS[11]],
      category: 'Restorative',
    },
    {
      title: 'Solar Energy & Strength',
      duration: '12 min',
      poses: [ASANAS[1], ASANAS[2], ASANAS[4], ASANAS[8], ASANAS[11]],
      category: 'Energizing',
    },
    {
      title: 'Deep Hip & Emotional Release',
      duration: '14 min',
      poses: [ASANAS[0], ASANAS[10], ASANAS[6], ASANAS[7], ASANAS[11]],
      category: 'Grounding',
    },
  ];

  // Filtering
  const filteredAsanas = ASANAS.filter((asana) => {
    const matchesSearch =
      asana.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asana.sanskritName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asana.targetAreas.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || asana.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || asana.level === selectedLevel;
    const matchesEnergy = selectedEnergy === 'All' || asana.energyLevel === selectedEnergy;
    const matchesCycle =
      selectedCyclePhase === 'All' ||
      (asana.cyclePhases && asana.cyclePhases.includes(selectedCyclePhase as any));

    return matchesSearch && matchesCategory && matchesLevel && matchesEnergy && matchesCycle;
  });

  const categories = ['All', 'Standing', 'Seated', 'Prone', 'Supine', 'Inversion', 'Balance'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4 border-b border-[#E7DFD5] pb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#5E7969] block mb-2">
            The Asana Sanctuary
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1A251E] tracking-tight">
            Yoga Postures & Fluid Sequences
          </h1>
          <p className="text-sm sm:text-base text-[#4E6457] mt-2 max-w-xl font-light">
            Master precise bodily alignment, conscious breath timing, and therapeutic benefits across classical Hatha and Yin postures.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSequenceDrawerOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F6F3EE] text-[#24352A] text-xs font-semibold uppercase tracking-wider border border-[#D5CFC4] shadow-2xs flex items-center space-x-2 transition-all"
          >
            <span>Custom Flow</span>
            <span className="px-2 py-0.5 rounded-full bg-[#E5ECE7] text-[#2D5A43] font-bold text-[10px]">
              {customSequence.length}
            </span>
          </button>

          <button
            onClick={() => startFlowSession(customSequence, 'My Custom Sequence')}
            className="px-5 py-2.5 rounded-xl bg-[#2D5A43] hover:bg-[#234734] text-white text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center space-x-1.5 transition-all hover:scale-102"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Flow</span>
          </button>
        </div>
      </div>

      {/* Preset Recommended Flows */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#526B5C]">
            Featured Guided Sequences
          </h2>
          <span className="text-xs text-[#7B9585]">Auto-timed with Tibetan gong cues</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {presetFlows.map((preset, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-[#E7DFD5] hover:border-[#BFD5C7] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2D5A43] bg-[#E8F1EC] px-2.5 py-1 rounded-full">
                    {preset.category}
                  </span>
                  <span className="text-xs text-[#6F8677] flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{preset.duration}</span>
                  </span>
                </div>
                <h3 className="text-lg font-serif text-[#1C2820] mb-2">{preset.title}</h3>
                <p className="text-xs text-[#5C7466] leading-relaxed mb-4">
                  Includes {preset.poses.map((p) => p.name).join(' → ')}.
                </p>
              </div>

              <button
                onClick={() => startFlowSession(preset.poses, preset.title)}
                className="w-full py-2.5 rounded-xl bg-[#F4EFEB] hover:bg-[#2D5A43] hover:text-white text-[#2B3C32] text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Begin Practice</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="bg-white p-6 rounded-3xl border border-[#E7DFD5] shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7C9385]" />
            <input
              type="text"
              placeholder="Search by English or Sanskrit name, e.g. Balasana, Warrior, Spine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-sm text-[#1E2923] placeholder-[#8A9E92] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8A9E92] hover:text-[#1E2923]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Level Filter */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs text-[#627A6C] whitespace-nowrap">Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#24352B] focus:outline-none"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
            </select>

            <span className="text-xs text-[#627A6C] whitespace-nowrap ml-2">Energy:</span>
            <select
              value={selectedEnergy}
              onChange={(e) => setSelectedEnergy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#24352B] focus:outline-none"
            >
              <option value="All">All Energies</option>
              <option value="Restorative / Low">Restorative</option>
              <option value="Moderate">Moderate</option>
              <option value="Energizing / High">Energizing</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 border-t border-[#F2ECE3]">
          <span className="text-xs font-semibold text-[#627A6C] shrink-0 mr-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#2D5A43] text-white'
                  : 'bg-[#F4EFEB] text-[#4A5E51] hover:bg-[#EAE4DC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Asana Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#668070]">
            Showing <strong>{filteredAsanas.length}</strong> classical postures
          </span>
          {(selectedCategory !== 'All' || selectedLevel !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedLevel('All');
                setSelectedEnergy('All');
                setSearchQuery('');
              }}
              className="text-xs text-[#2D5A43] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAsanas.map((asana) => {
            const isFav = favoriteIds.includes(asana.id);
            return (
              <div
                key={asana.id}
                id={`asana-card-${asana.id}`}
                className="bg-white rounded-3xl border border-[#E7DFD5] p-6 hover:shadow-md hover:border-[#BFD5C7] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4E6A5A] bg-[#E8F0EC] px-2.5 py-0.5 rounded-full">
                      {asana.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(asana.id);
                      }}
                      className="p-1 text-[#8C9E93] hover:text-rose-500 transition-colors"
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFav ? 'fill-rose-500 text-rose-500' : 'text-[#8C9E93]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Asana Silhouette Preview */}
                  <div
                    onClick={() => setInspectAsana(asana)}
                    className="h-36 w-full bg-[#FAF8F5] rounded-2xl p-4 flex items-center justify-center text-[#2D5A43] mb-4 cursor-pointer group-hover:bg-[#F3EFEA] transition-colors"
                  >
                    <AsanaIllustration type={asana.svgType} className="w-full h-full max-h-28" />
                  </div>

                  <div onClick={() => setInspectAsana(asana)} className="cursor-pointer">
                    <h3 className="text-xl font-serif text-[#1B271F] group-hover:text-[#2D5A43] transition-colors">
                      {asana.name}
                    </h3>
                    <p className="text-xs italic font-serif text-[#5E7969] mb-3">
                      {asana.sanskritName}
                    </p>
                    <p className="text-xs text-[#526B5C] line-clamp-2 leading-relaxed mb-4">
                      {asana.benefits[0]}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F2EDE5] flex items-center justify-between text-xs">
                  <span className="text-[#6D8576] flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{Math.round(asana.durationSeconds / 60)} min</span>
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        if (!customSequence.some((p) => p.id === asana.id)) {
                          setCustomSequence([...customSequence, asana]);
                        }
                        setSequenceDrawerOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EAE4DB] text-[#4A6253] border border-[#E3DBD0] transition-colors"
                      title="Add to sequence"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setInspectAsana(asana)}
                      className="px-3 py-1.5 rounded-lg bg-[#2D5A43] hover:bg-[#214332] text-white font-medium text-xs transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Detail Asana Modal */}
      {inspectAsana && (
        <div
          id="asana-detail-modal"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
          onClick={() => {
            setInspectAsana(null);
            onClearInitialSelected?.();
          }}
        >
          <div
            className="bg-white max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E0D7CC] my-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#3D6A50] bg-[#E8F1EC] px-3 py-1 rounded-full">
                  {inspectAsana.category} • {inspectAsana.level}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#1C2820] mt-2">
                  {inspectAsana.name}
                </h2>
                <p className="text-sm italic font-serif text-[#5E7969]">
                  {inspectAsana.sanskritName} ({inspectAsana.englishName})
                </p>
              </div>
              <button
                onClick={() => {
                  setInspectAsana(null);
                  onClearInitialSelected?.();
                }}
                className="p-2 rounded-xl text-[#789382] hover:bg-[#F3EFEA] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Illustration Banner */}
            <div className="h-44 w-full bg-[#FAF8F5] rounded-2xl p-4 flex items-center justify-center text-[#2D5A43]">
              <AsanaIllustration type={inspectAsana.svgType} className="w-full h-full max-h-36" />
            </div>

            {/* Breath Cue Callout */}
            <div className="bg-[#F0F5F2] p-4 rounded-2xl border border-[#CFE0D5] flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-[#2D5A43] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D5A43]">
                  Synchronized Breath Cue
                </h4>
                <p className="text-xs text-[#405B4B] leading-relaxed mt-0.5">
                  {inspectAsana.breathCue}
                </p>
              </div>
            </div>

            {/* Step-by-Step Alignment Cues */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#637D6E] mb-3">
                Alignment & Movement Steps
              </h4>
              <ol className="space-y-2">
                {inspectAsana.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-[#3C5244] leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-[#E8F0EC] text-[#2D5A43] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Benefits & Precautions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#F2ECE3]">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#3D6A50] mb-2">
                  Physiological Benefits
                </h5>
                <ul className="space-y-1.5 text-xs text-[#4E6657]">
                  {inspectAsana.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-2">
                  Contraindications & Care
                </h5>
                <ul className="space-y-1.5 text-xs text-[#6F5B57]">
                  {inspectAsana.precautions.map((p, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#F0EAE1]">
              <button
                onClick={() => {
                  startFlowSession([inspectAsana], `Solo Focus: ${inspectAsana.name}`);
                  setInspectAsana(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#2D5A43] hover:bg-[#204231] text-white text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Practice this pose now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Sequence Builder Drawer */}
      {sequenceDrawerOpen && (
        <div
          id="custom-sequence-drawer"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in"
          onClick={() => setSequenceDrawerOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E7DFD5] mb-5">
                <div>
                  <h3 className="text-xl font-serif text-[#1C2820]">Your Custom Flow</h3>
                  <p className="text-xs text-[#6D8777]">
                    {customSequence.length} poses • ~
                    {Math.round(customSequence.reduce((acc, p) => acc + p.durationSeconds, 0) / 60)} min total
                  </p>
                </div>
                <button
                  onClick={() => setSequenceDrawerOpen(false)}
                  className="p-1.5 text-[#7A9383] hover:bg-[#F2ECE4] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {customSequence.map((pose, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD5] flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-[#E5EDE7] text-[#2D5A43] font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-medium text-[#1E2923]">{pose.name}</h4>
                        <span className="text-[11px] text-[#6E8878]">
                          {Math.round(pose.durationSeconds / 60)} min hold
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const updated = customSequence.filter((_, i) => i !== idx);
                        setCustomSequence(updated);
                      }}
                      className="p-1.5 text-[#8F9E95] hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#E7DFD5] space-y-2">
              <button
                disabled={customSequence.length === 0}
                onClick={() => {
                  setSequenceDrawerOpen(false);
                  startFlowSession(customSequence, 'My Custom Sequence');
                }}
                className="w-full py-3.5 rounded-xl bg-[#2D5A43] hover:bg-[#214332] text-white text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Begin Flow Player</span>
              </button>
              <button
                onClick={() => setCustomSequence([])}
                className="w-full py-2 text-xs text-[#80998A] hover:text-rose-600 transition-colors"
              >
                Clear Sequence
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Interactive Flow Player Modal */}
      {isPlayingFlow && (
        <div
          id="live-flow-player-modal"
          className="fixed inset-0 z-50 bg-[#16201A]/95 backdrop-blur-md flex items-center justify-center p-4 text-white overflow-y-auto animate-in fade-in"
        >
          <div className="max-w-2xl w-full p-6 sm:p-10 flex flex-col items-center text-center space-y-6">
            {!flowCompleted ? (
              <>
                {/* Header info */}
                <div className="flex items-center justify-between w-full text-xs text-[#88AC97] border-b border-[#293B30] pb-4">
                  <span>{flowTitle}</span>
                  <span>
                    Pose {currentPoseIndex + 1} of {flowAsanas.length}
                  </span>
                  <button
                    onClick={() => setIsPlayingFlow(false)}
                    className="hover:text-white transition-colors"
                  >
                    Exit Flow
                  </button>
                </div>

                {/* Current Pose Details */}
                <div className="space-y-1">
                  <h2 className="text-3xl sm:text-4xl font-serif text-white">
                    {flowAsanas[currentPoseIndex]?.name}
                  </h2>
                  <p className="text-sm italic font-serif text-[#A3C4B1]">
                    {flowAsanas[currentPoseIndex]?.sanskritName}
                  </p>
                </div>

                {/* Pose Illustration */}
                <div className="h-56 w-72 bg-[#202E26] rounded-3xl p-6 flex items-center justify-center text-emerald-300 border border-[#2F4438] shadow-lg">
                  <AsanaIllustration
                    type={flowAsanas[currentPoseIndex]?.svgType}
                    className="w-full h-full"
                  />
                </div>

                {/* Countdown Timer Display */}
                <div className="space-y-2">
                  <div className="text-5xl sm:text-6xl font-serif font-light text-white tracking-wider">
                    {Math.floor(poseSecondsRemaining / 60)}:
                    {(poseSecondsRemaining % 60).toString().padStart(2, '0')}
                  </div>
                  <p className="text-xs text-[#9BBBA8] max-w-md">
                    {flowAsanas[currentPoseIndex]?.breathCue}
                  </p>
                </div>

                {/* Player Controls */}
                <div className="flex items-center space-x-6 pt-4">
                  <button
                    onClick={() => {
                      if (currentPoseIndex > 0) {
                        setCurrentPoseIndex((idx) => idx - 1);
                        setPoseSecondsRemaining(flowAsanas[currentPoseIndex - 1].durationSeconds);
                      }
                    }}
                    disabled={currentPoseIndex === 0}
                    className="px-4 py-2 rounded-xl bg-[#26372D] hover:bg-[#32493C] text-xs font-semibold uppercase disabled:opacity-30"
                  >
                    Previous
                  </button>

                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="w-14 h-14 rounded-full bg-[#3D7A5A] hover:bg-[#4E9972] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                  >
                    {isPaused ? <Play className="w-6 h-6 fill-current ml-0.5" /> : <span className="text-xl font-bold">❚❚</span>}
                  </button>

                  <button
                    onClick={() => {
                      if (currentPoseIndex < flowAsanas.length - 1) {
                        sound.playTransitionChime();
                        setCurrentPoseIndex((idx) => idx + 1);
                        setPoseSecondsRemaining(flowAsanas[currentPoseIndex + 1].durationSeconds);
                      } else {
                        setFlowCompleted(true);
                        sound.playSingingBowl(432, 4);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-[#26372D] hover:bg-[#32493C] text-xs font-semibold uppercase"
                  >
                    Skip
                  </button>
                </div>
              </>
            ) : (
              // Flow Completed Screen
              <div className="py-8 space-y-6 text-center animate-in zoom-in-95">
                <div className="w-20 h-20 rounded-full bg-[#2F543E] text-emerald-300 mx-auto flex items-center justify-center shadow-xl border border-emerald-500/40">
                  <Sparkles className="w-10 h-10 text-amber-300" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-serif text-white">
                    Namaste. Practice Complete.
                  </h2>
                  <p className="text-sm text-[#A0C4AF] max-w-md mx-auto leading-relaxed">
                    You have successfully completed your session. Take a moment to notice the warmth, spaciousness, and peaceful clarity vibrating through your body.
                  </p>
                </div>

                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#202E26] border border-[#2E4337] text-xs text-[#B2D6C1]">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>
                    Logged{' '}
                    {Math.max(1, Math.round(flowAsanas.reduce((acc, p) => acc + p.durationSeconds, 0) / 60))}{' '}
                    Mindful Minutes to your streak
                  </span>
                </div>

                <div>
                  <button
                    onClick={() => setIsPlayingFlow(false)}
                    className="px-8 py-3.5 rounded-2xl bg-[#3D7A5A] hover:bg-[#4E9972] text-white font-medium text-xs uppercase tracking-wider shadow-lg"
                  >
                    Return to Sanctuary
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
