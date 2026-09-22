import React, { useState, useEffect, useRef } from 'react';
import { PranayamaExercise, MeditationPreset } from '../types';
import { PRANAYAMA_EXERCISES, MEDITATION_PRESETS } from '../data/wellnessData';
import { sound } from '../utils/audio';
import {
  Wind,
  Moon,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  Bell,
  Clock,
  CheckCircle2,
  Heart,
  Compass,
} from 'lucide-react';

interface MeditationViewProps {
  onSessionComplete: (minutes: number) => void;
}

export const MeditationView: React.FC<MeditationViewProps> = ({ onSessionComplete }) => {
  const [activeTab, setActiveTab] = useState<'breath' | 'timer'>('breath');

  // Pranayama State
  const [selectedExercise, setSelectedExercise] = useState<PranayamaExercise>(PRANAYAMA_EXERCISES[0]);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold Empty'>('Inhale');
  const [phaseSecondsRemaining, setPhaseSecondsRemaining] = useState(selectedExercise.inhale);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [breathSessionFinished, setBreathSessionFinished] = useState(false);

  // Meditation Timer State
  const [selectedPreset, setSelectedPreset] = useState<MeditationPreset>(MEDITATION_PRESETS[0]);
  const [timerMinutes, setTimerMinutes] = useState(10);
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState(10 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const [intervalBell, setIntervalBell] = useState(true);

  // Reset Pranayama when exercise changes
  useEffect(() => {
    setIsBreathingActive(false);
    setBreathPhase('Inhale');
    setPhaseSecondsRemaining(selectedExercise.inhale);
    setCompletedCycles(0);
    setBreathSessionFinished(false);
  }, [selectedExercise]);

  // Pranayama Engine
  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive && !breathSessionFinished) {
      interval = setInterval(() => {
        setPhaseSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Transition phase
            if (breathPhase === 'Inhale') {
              if (selectedExercise.hold1 > 0) {
                setBreathPhase('Hold');
                sound.playBreathPulse(false);
                return selectedExercise.hold1;
              } else {
                setBreathPhase('Exhale');
                sound.playBreathPulse(false);
                return selectedExercise.exhale;
              }
            } else if (breathPhase === 'Hold') {
              setBreathPhase('Exhale');
              sound.playBreathPulse(false);
              return selectedExercise.exhale;
            } else if (breathPhase === 'Exhale') {
              if (selectedExercise.hold2 > 0) {
                setBreathPhase('Hold Empty');
                return selectedExercise.hold2;
              } else {
                // Completed one cycle
                const nextCycle = completedCycles + 1;
                setCompletedCycles(nextCycle);
                if (nextCycle >= selectedExercise.cyclesCount) {
                  sound.playSingingBowl(432, 3.5);
                  setBreathSessionFinished(true);
                  setIsBreathingActive(false);
                  onSessionComplete(3);
                  return 0;
                }
                setBreathPhase('Inhale');
                sound.playBreathPulse(true);
                return selectedExercise.inhale;
              }
            } else {
              // Hold Empty transition to Inhale
              const nextCycle = completedCycles + 1;
              setCompletedCycles(nextCycle);
              if (nextCycle >= selectedExercise.cyclesCount) {
                sound.playSingingBowl(432, 3.5);
                setBreathSessionFinished(true);
                setIsBreathingActive(false);
                onSessionComplete(3);
                return 0;
              }
              setBreathPhase('Inhale');
              sound.playBreathPulse(true);
              return selectedExercise.inhale;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathPhase, selectedExercise, completedCycles, breathSessionFinished]);

  // Meditation Timer Engine
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !timerFinished) {
      interval = setInterval(() => {
        setTimerSecondsRemaining((prev) => {
          if (prev <= 1) {
            sound.playSingingBowl(432, 5);
            setIsTimerRunning(false);
            setTimerFinished(true);
            onSessionComplete(timerMinutes);
            return 0;
          }

          // Interval Bell (e.g. every 5 minutes)
          if (intervalBell && (timerMinutes * 60 - prev) > 0 && (timerMinutes * 60 - prev) % 300 === 0) {
            sound.playTransitionChime();
          }

          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerFinished, timerMinutes, intervalBell]);

  const handleStartTimer = () => {
    sound.playSingingBowl(432, 3);
    setIsTimerRunning(true);
    setTimerFinished(false);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = (mins: number) => {
    setIsTimerRunning(false);
    setTimerFinished(false);
    setTimerMinutes(mins);
    setTimerSecondsRemaining(mins * 60);
  };

  // Breath visual circle scale calculations
  let circleScale = 'scale-100';
  if (breathPhase === 'Inhale') {
    circleScale = 'scale-140';
  } else if (breathPhase === 'Hold') {
    circleScale = 'scale-140';
  } else if (breathPhase === 'Exhale') {
    circleScale = 'scale-90';
  } else {
    circleScale = 'scale-90';
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto pt-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#5E7969] block mb-2">
          Autonomic Harmony
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif text-[#19241D] tracking-tight">
          Pranayama & Meditation Sanctuary
        </h1>
        <p className="text-sm sm:text-base text-[#4E6657] mt-2 font-light">
          Regulate your autonomic vagal tone with real-time breath pacing and tranquil Tibetan singing bowl timers.
        </p>

        {/* Tab switch */}
        <div className="inline-flex p-1.5 rounded-2xl bg-[#EDE7DF] border border-[#DDD3C6] mt-6">
          <button
            onClick={() => setActiveTab('breath')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'breath'
                ? 'bg-white text-[#2D5A43] shadow-xs'
                : 'text-[#64796C] hover:text-[#19241D]'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Pranayama Breathwork</span>
          </button>
          <button
            onClick={() => setActiveTab('timer')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'timer'
                ? 'bg-white text-[#2D5A43] shadow-xs'
                : 'text-[#64796C] hover:text-[#19241D]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Meditation Timer</span>
          </button>
        </div>
      </div>

      {/* ===================== TAB 1: PRANAYAMA BREATHWORK ===================== */}
      {activeTab === 'breath' && (
        <div className="space-y-10 animate-in fade-in">
          {/* Exercise Selector Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRANAYAMA_EXERCISES.map((exercise) => {
              const isSelected = selectedExercise.id === exercise.id;
              return (
                <div
                  key={exercise.id}
                  onClick={() => setSelectedExercise(exercise)}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-[#2D5A43] shadow-md ring-1 ring-[#2D5A43]/20'
                      : 'bg-[#FAF8F5] border-[#E5DDD2] hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2D5A43] bg-[#E8F1EC] px-2 py-0.5 rounded-full">
                        {exercise.category}
                      </span>
                      <span className="text-xs text-[#7B9585]">
                        {exercise.inhale}-{exercise.hold1}-{exercise.exhale}-{exercise.hold2}s
                      </span>
                    </div>
                    <h3 className="text-base font-serif text-[#1C2820] mb-1">{exercise.name}</h3>
                    <p className="text-xs text-[#566E5F] line-clamp-2">{exercise.subtitle}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#F2ECE3] text-[11px] text-[#7B9585]">
                    {exercise.cyclesCount} cycles • {exercise.bestTime}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Breathing Visualizer Arena */}
          <div className="bg-gradient-to-b from-white to-[#F8F5F0] rounded-3xl border border-[#E7DFD5] p-8 sm:p-14 shadow-xs flex flex-col items-center justify-center text-center relative overflow-hidden">
            {!breathSessionFinished ? (
              <>
                <div className="mb-6 space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#5A7665]">
                    {selectedExercise.sanskritName}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif text-[#1A251E]">
                    {selectedExercise.name}
                  </h2>
                  <p className="text-xs text-[#5D7768] max-w-md mx-auto">
                    Cycle {completedCycles + 1} of {selectedExercise.cyclesCount}
                  </p>
                </div>

                {/* Animated Breathing Orb */}
                <div className="relative my-8 flex items-center justify-center w-72 h-72">
                  {/* Outer pulsating wave ring */}
                  <div
                    className={`absolute inset-0 rounded-full border border-[#2D5A43]/20 transition-transform duration-1000 ${
                      isBreathingActive ? circleScale : 'scale-100'
                    }`}
                  />
                  <div
                    className={`absolute inset-4 rounded-full border-2 border-dashed border-[#2D5A43]/30 transition-transform duration-1000 ${
                      isBreathingActive ? circleScale : 'scale-100'
                    }`}
                  />

                  {/* Core Breathing Orb */}
                  <div
                    className={`w-48 h-48 rounded-full bg-gradient-to-br from-[#407B5C] to-[#244E38] text-white flex flex-col items-center justify-center shadow-xl shadow-[#2D5A43]/20 transition-transform duration-1000 ${
                      isBreathingActive ? circleScale : 'scale-100'
                    }`}
                  >
                    <span className="text-xs font-semibold tracking-widest uppercase text-emerald-200">
                      {isBreathingActive ? breathPhase : 'Ready'}
                    </span>
                    <span className="text-5xl font-serif font-light my-1">
                      {isBreathingActive ? phaseSecondsRemaining : selectedExercise.inhale}
                    </span>
                    <span className="text-[11px] text-[#A2C7B2]">
                      {isBreathingActive ? `${selectedExercise.cyclesCount - completedCycles} cycles left` : 'Press Start'}
                    </span>
                  </div>
                </div>

                {/* Breathwork Controls */}
                <div className="flex items-center space-x-4 mt-4">
                  {!isBreathingActive ? (
                    <button
                      id="start-breathwork-btn"
                      onClick={() => {
                        sound.playSingingBowl(432, 2.5);
                        setIsBreathingActive(true);
                      }}
                      className="px-8 py-3.5 rounded-2xl bg-[#2D5A43] hover:bg-[#224433] text-white font-medium text-xs uppercase tracking-wider shadow-md flex items-center space-x-2 transition-all hover:scale-102"
                    >
                      <Play className="w-4 h-4 fill-current text-emerald-200" />
                      <span>Start Breathing Pacer</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsBreathingActive(false)}
                      className="px-8 py-3.5 rounded-2xl bg-[#EAE2D7] hover:bg-[#DDD3C6] text-[#24352B] font-medium text-xs uppercase tracking-wider flex items-center space-x-2"
                    >
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause Pacer</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsBreathingActive(false);
                      setBreathPhase('Inhale');
                      setPhaseSecondsRemaining(selectedExercise.inhale);
                      setCompletedCycles(0);
                    }}
                    className="p-3.5 rounded-2xl bg-[#F0EAE1] hover:bg-[#E4DCCE] text-[#4E6657] transition-colors"
                    title="Reset Pacer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Guidelines */}
                <div className="max-w-md mx-auto mt-8 text-xs text-[#637C6D] space-y-1">
                  <p className="font-semibold text-[#30483A]">Instructions:</p>
                  <p>{selectedExercise.instructions[0]}</p>
                </div>
              </>
            ) : (
              // Finished Pranayama Celebration
              <div className="py-6 space-y-6 text-center animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-[#E5EDE7] text-[#2D5A43] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-serif text-[#1C2820]">
                    Pranayama Practice Complete
                  </h3>
                  <p className="text-sm text-[#506A5B] max-w-md mx-auto">
                    You have completed all {selectedExercise.cyclesCount} cycles of {selectedExercise.name}. Your nervous system is now deeply balanced and primed for stillness.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setBreathSessionFinished(false);
                    setCompletedCycles(0);
                    setPhaseSecondsRemaining(selectedExercise.inhale);
                  }}
                  className="px-6 py-3 rounded-xl bg-[#2D5A43] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#204231]"
                >
                  Practice Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== TAB 2: MEDITATION TIMER ===================== */}
      {activeTab === 'timer' && (
        <div className="space-y-10 animate-in fade-in">
          {/* Preset Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MEDITATION_PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    setSelectedPreset(preset);
                    handleResetTimer(preset.durationMinutes);
                  }}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-[#2D5A43] shadow-md ring-1 ring-[#2D5A43]/20'
                      : 'bg-[#FAF8F5] border-[#E5DDD2] hover:bg-white'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2D5A43] bg-[#E8F1EC] px-2 py-0.5 rounded-full">
                      {preset.category}
                    </span>
                    <h3 className="text-base font-serif text-[#1C2820] mt-2 mb-1">
                      {preset.title}
                    </h3>
                    <p className="text-xs text-[#526B5C] line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-[#F2ECE3] flex items-center justify-between text-xs text-[#769180]">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{preset.durationMinutes} min</span>
                    </span>
                    <span>🔔 Bell: 3m</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timer Arena */}
          <div className="bg-gradient-to-b from-white to-[#F8F5F0] rounded-3xl border border-[#E7DFD5] p-8 sm:p-14 shadow-xs flex flex-col items-center justify-center text-center">
            {!timerFinished ? (
              <>
                <div className="mb-6 space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#5C7767]">
                    Mindful Stillness
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif text-[#1A251E]">
                    {selectedPreset.title}
                  </h2>
                  <p className="text-xs italic font-serif text-[#4C6858] max-w-md mx-auto pt-1">
                    "{selectedPreset.reflectionPrompt}"
                  </p>
                </div>

                {/* Big Circular Timer */}
                <div className="relative my-8 flex items-center justify-center w-64 h-64">
                  <div className="w-56 h-56 rounded-full border-4 border-[#E5DDD2] flex flex-col items-center justify-center bg-white shadow-inner">
                    <span className="text-5xl sm:text-6xl font-serif font-light text-[#1C2820] tracking-wider">
                      {Math.floor(timerSecondsRemaining / 60)}:
                      {(timerSecondsRemaining % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs text-[#7A9383] mt-2">
                      {isTimerRunning ? 'Resting in presence' : 'Ready'}
                    </span>
                  </div>
                </div>

                {/* Duration Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                  {[3, 5, 10, 15, 20, 30].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => handleResetTimer(mins)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        timerMinutes === mins
                          ? 'bg-[#2D5A43] text-white'
                          : 'bg-[#F0EAE1] text-[#4A5E51] hover:bg-[#E4DCCE]'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-4">
                  {!isTimerRunning ? (
                    <button
                      id="start-meditation-timer-btn"
                      onClick={handleStartTimer}
                      className="px-8 py-3.5 rounded-2xl bg-[#2D5A43] hover:bg-[#224433] text-white font-medium text-xs uppercase tracking-wider shadow-md flex items-center space-x-2 transition-all hover:scale-102"
                    >
                      <Play className="w-4 h-4 fill-current text-emerald-200" />
                      <span>Start Meditation</span>
                    </button>
                  ) : (
                    <button
                      onClick={handlePauseTimer}
                      className="px-8 py-3.5 rounded-2xl bg-[#EAE2D7] hover:bg-[#DDD3C6] text-[#24352B] font-medium text-xs uppercase tracking-wider flex items-center space-x-2"
                    >
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause Session</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleResetTimer(timerMinutes)}
                    className="p-3.5 rounded-2xl bg-[#F0EAE1] hover:bg-[#E4DCCE] text-[#4E6657] transition-colors"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => sound.playSingingBowl(432, 3.5)}
                    className="p-3.5 rounded-2xl bg-[#E8F1EC] hover:bg-[#D9E7E0] text-[#2D5A43] transition-colors"
                    title="Test Singing Bowl Bell"
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              // Session Finished Screen
              <div className="py-6 space-y-6 text-center animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-[#E5EDE7] text-[#2D5A43] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-serif text-[#1C2820]">
                    Meditation Complete
                  </h3>
                  <p className="text-sm text-[#506A5B] max-w-md mx-auto">
                    Logged {timerMinutes} mindful minutes to your sanctuary journal. Carry this inner silence with you into the world.
                  </p>
                </div>
                <button
                  onClick={() => handleResetTimer(timerMinutes)}
                  className="px-6 py-3 rounded-xl bg-[#2D5A43] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#204231]"
                >
                  Sit Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
