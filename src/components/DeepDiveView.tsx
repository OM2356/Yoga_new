import React, { useState, useEffect } from 'react';
import { DeepDiveProgram } from '../types';
import { DEEP_DIVE_PROGRAMS } from '../data/wellnessData';
import { sound } from '../utils/audio';
import {
  Sparkles,
  Clock,
  Play,
  Pause,
  CheckCircle2,
  ArrowRight,
  Shield,
  Activity,
  Heart,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

interface DeepDiveViewProps {
  onSessionComplete: (minutes: number) => void;
}

export const DeepDiveView: React.FC<DeepDiveViewProps> = ({ onSessionComplete }) => {
  const [selectedProgram, setSelectedProgram] = useState<DeepDiveProgram>(DEEP_DIVE_PROGRAMS[0]);
  const [activeSession, setActiveSession] = useState<DeepDiveProgram | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepSecondsRemaining, setStepSecondsRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Start deep dive session
  const handleStartSession = (program: DeepDiveProgram) => {
    sound.playSingingBowl(432, 3);
    setActiveSession(program);
    setCurrentStepIndex(0);
    setStepSecondsRemaining(program.steps[0].durationMinutes * 60);
    setIsPaused(false);
    setSessionCompleted(false);
  };

  // Step countdown timer
  useEffect(() => {
    let timer: any = null;
    if (activeSession && !isPaused && !sessionCompleted) {
      timer = setInterval(() => {
        setStepSecondsRemaining((prev) => {
          if (prev <= 1) {
            if (currentStepIndex < activeSession.steps.length - 1) {
              sound.playTransitionChime();
              setCurrentStepIndex((idx) => idx + 1);
              const nextStep = activeSession.steps[currentStepIndex + 1];
              return nextStep ? nextStep.durationMinutes * 60 : 60;
            } else {
              sound.playSingingBowl(432, 4);
              setSessionCompleted(true);
              onSessionComplete(activeSession.durationMinutes);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeSession, isPaused, currentStepIndex, sessionCompleted]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4 border-b border-[#E7DFD5] pb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#5E7969] block mb-2">
            Targeted Somatic Programs
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1A251E] tracking-tight">
            Deep Dive Immersions
          </h1>
          <p className="text-sm sm:text-base text-[#4E6457] mt-2 max-w-xl font-light">
            Multi-stage, protocol-driven somatic journeys formulated to undo chronic postural strain, reset adrenal burnout, and restore structural balance.
          </p>
        </div>
      </div>

      {/* Program Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {DEEP_DIVE_PROGRAMS.map((program) => {
          const isSelected = selectedProgram.id === program.id;
          return (
            <div
              key={program.id}
              onClick={() => setSelectedProgram(program)}
              className={`p-8 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#2D5A43] shadow-lg ring-1 ring-[#2D5A43]/20'
                  : 'bg-[#FAF8F5] border-[#E5DDD2] hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#2D5A43] bg-[#E8F1EC] px-3 py-1 rounded-full">
                    {program.durationMinutes} Minutes • Complete Immersion
                  </span>
                  <Activity className="w-5 h-5 text-[#4E755D]" />
                </div>

                <h3 className="text-2xl font-serif text-[#1C2820] mb-2">{program.title}</h3>
                <p className="text-sm text-[#50695B] leading-relaxed mb-6 font-light">
                  {program.subtitle}
                </p>

                <div className="space-y-3 mb-6 bg-[#F6F3EE] p-4 rounded-2xl border border-[#E7DFD5]">
                  <div className="text-xs text-[#2E4537]">
                    <strong className="font-semibold text-[#1C2820]">Target Outcome:</strong>{' '}
                    {program.targetOutcome}
                  </div>
                  <div className="text-xs text-[#2E4537]">
                    <strong className="font-semibold text-[#1C2820]">Recommended for:</strong>{' '}
                    {program.suitableFor}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#678272]">
                    Program Phases ({program.steps.length} Steps):
                  </h4>
                  {program.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-white border border-[#EBE3D7]"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-[#E5EDE7] text-[#2D5A43] text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-[#202E26] font-medium">{step.title}</span>
                      </div>
                      <span className="text-[#7A9384] text-[11px]">{step.durationMinutes}m</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleStartSession(program)}
                className="w-full py-3.5 rounded-2xl bg-[#2D5A43] hover:bg-[#204030] text-white text-xs font-semibold uppercase tracking-wider shadow-md flex items-center justify-center space-x-2 transition-all hover:scale-101"
              >
                <Play className="w-4 h-4 fill-current text-emerald-200" />
                <span>Begin Guided {program.durationMinutes}-Min Immersion</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Active Session Player Modal */}
      {activeSession && (
        <div
          id="deep-dive-session-modal"
          className="fixed inset-0 z-50 bg-[#16201A]/95 backdrop-blur-md flex items-center justify-center p-4 text-white overflow-y-auto animate-in fade-in"
        >
          <div className="max-w-2xl w-full p-6 sm:p-10 flex flex-col items-center text-center space-y-6">
            {!sessionCompleted ? (
              <>
                <div className="flex items-center justify-between w-full text-xs text-[#8BB09B] border-b border-[#293B30] pb-4">
                  <span>{activeSession.title}</span>
                  <span>
                    Step {currentStepIndex + 1} of {activeSession.steps.length}
                  </span>
                  <button
                    onClick={() => setActiveSession(null)}
                    className="hover:text-white transition-colors"
                  >
                    Exit Session
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-emerald-300 font-semibold">
                    {activeSession.steps[currentStepIndex]?.type.toUpperCase()}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif text-white">
                    {activeSession.steps[currentStepIndex]?.title}
                  </h2>
                  <p className="text-sm text-[#A2C7B2] max-w-lg mx-auto pt-1 leading-relaxed">
                    {activeSession.steps[currentStepIndex]?.description}
                  </p>
                </div>

                {/* Big Timer */}
                <div className="text-6xl sm:text-7xl font-serif font-light text-white my-4 tracking-wider">
                  {Math.floor(stepSecondsRemaining / 60)}:
                  {(stepSecondsRemaining % 60).toString().padStart(2, '0')}
                </div>

                {/* Somatic Cues Box */}
                <div className="bg-[#202E26] p-5 rounded-2xl border border-[#2E4337] w-full text-left space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                    Somatic Somatosensory Cues:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#BED8C8]">
                    {activeSession.steps[currentStepIndex]?.cues.map((cue, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span>{cue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-6 pt-4">
                  <button
                    onClick={() => {
                      if (currentStepIndex > 0) {
                        setCurrentStepIndex((i) => i - 1);
                        setStepSecondsRemaining(
                          activeSession.steps[currentStepIndex - 1].durationMinutes * 60
                        );
                      }
                    }}
                    disabled={currentStepIndex === 0}
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
                      if (currentStepIndex < activeSession.steps.length - 1) {
                        sound.playTransitionChime();
                        setCurrentStepIndex((i) => i + 1);
                        setStepSecondsRemaining(
                          activeSession.steps[currentStepIndex + 1].durationMinutes * 60
                        );
                      } else {
                        sound.playSingingBowl(432, 4);
                        setSessionCompleted(true);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-[#26372D] hover:bg-[#32493C] text-xs font-semibold uppercase"
                  >
                    Next Step
                  </button>
                </div>
              </>
            ) : (
              // Completed screen
              <div className="py-8 space-y-6 text-center animate-in zoom-in-95">
                <div className="w-20 h-20 rounded-full bg-[#2F543E] text-emerald-300 mx-auto flex items-center justify-center shadow-xl border border-emerald-500/40">
                  <CheckCircle2 className="w-10 h-10 text-emerald-300" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-serif text-white">
                    Immersion Complete
                  </h2>
                  <p className="text-sm text-[#A4C9B4] max-w-md mx-auto leading-relaxed">
                    You have successfully completed the {activeSession.title}. Notice the profound shift in your spinal decompression and parasympathetic calmness.
                  </p>
                </div>
                <button
                  onClick={() => setActiveSession(null)}
                  className="px-8 py-3.5 rounded-2xl bg-[#3D7A5A] hover:bg-[#4E9972] text-white font-medium text-xs uppercase tracking-wider"
                >
                  Return to Deep Dives
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
