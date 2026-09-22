import React from 'react';
import { PageView } from '../types';
import { Sparkles, Heart, ShieldCheck, Flower2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#1C2620] text-[#E5EAE7] border-t border-[#2A3930] pt-14 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2D3E34]">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#3D7A5A] to-[#2D5A43] flex items-center justify-center text-white shadow-sm">
                <Flower2 className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <span className="text-xl font-serif font-medium tracking-tight text-white">
                  FlowState
                </span>
                <span className="block text-[9px] font-sans tracking-widest uppercase text-[#96B2A2]">
                  Holistic Sanctuary
                </span>
              </div>
            </div>
            <p className="text-sm text-[#9BB5A6] leading-relaxed">
              Cultivating somatic presence, rhythmic breath, and hormonal equilibrium through timeless yogic wisdom and intelligent guidance.
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#7A9887]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Evidence-based somatic principles</span>
            </div>
          </div>

          {/* Practices Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A2C2AF] mb-4">
              Practices
            </h4>
            <ul className="space-y-2.5 text-sm text-[#B6CEC0]">
              <li>
                <button
                  onClick={() => onNavigate('yoga')}
                  className="hover:text-white transition-colors"
                >
                  Asana Library & Cues
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('meditation')}
                  className="hover:text-white transition-colors"
                >
                  Pranayama Breathwork
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('meditation')}
                  className="hover:text-white transition-colors"
                >
                  Singing Bowl Timers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('deep-dive')}
                  className="hover:text-white transition-colors"
                >
                  Desk Worker Recovery
                </button>
              </li>
            </ul>
          </div>

          {/* Syncing & AI */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A2C2AF] mb-4">
              Holistic Systems
            </h4>
            <ul className="space-y-2.5 text-sm text-[#B6CEC0]">
              <li>
                <button
                  onClick={() => onNavigate('cycle')}
                  className="hover:text-white transition-colors"
                >
                  Infradian Cycle Syncing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-wellness')}
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>AI Wellness Companion</span>
                  <Sparkles className="w-3 h-3 text-amber-300" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('knowledge')}
                  className="hover:text-white transition-colors"
                >
                  Neurobiology & Ayurveda
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Personal Practice Log
                </button>
              </li>
            </ul>
          </div>

          {/* Daily Intention / Prompt */}
          <div className="bg-[#24332B] p-5 rounded-2xl border border-[#32453B]">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#85A693] block mb-2">
              Daily Somatic Intention
            </span>
            <p className="font-serif italic text-sm text-[#E7EFEB] leading-relaxed mb-3">
              "Inhale spaciousness; exhale what has already served its purpose. Peace is not found in the absence of waves, but in learning to rest within them."
            </p>
            <div className="flex items-center text-xs text-[#96B3A2] space-x-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Dedicated to conscious living</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7B9988] space-y-3 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} FlowState Wellness. Crafted with mindful precision.
          </div>
          <div className="flex items-center space-x-6">
            <span>Natural Soundscapes: 432 Hz Synthesizer</span>
            <span>Non-dogmatic & Body Inclusive</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
