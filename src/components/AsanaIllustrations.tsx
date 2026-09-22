import React from 'react';

interface AsanaIllustrationProps {
  type: string;
  className?: string;
}

export const AsanaIllustration: React.FC<AsanaIllustrationProps> = ({ type, className = 'w-full h-full' }) => {
  switch (type) {
    case 'childs-pose':
      return (
        <svg viewBox="0 0 200 120" className={className} fill="none" stroke="currentColor">
          {/* Ground line */}
          <line x1="20" y1="105" x2="180" y2="105" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
          {/* Body curve: folded knees, torso draped forward, forehead to ground */}
          <path
            d="M 50 100 C 50 80, 70 65, 95 65 C 115 65, 135 75, 155 95"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Arms reaching forward */}
          <path d="M 120 75 L 165 100 L 180 100" strokeWidth="2.5" strokeLinecap="round" />
          {/* Head resting */}
          <circle cx="155" cy="98" r="8" fill="currentColor" opacity="0.85" />
          {/* Torso softness accent */}
          <path d="M 65 95 C 65 75, 85 85, 105 85" strokeWidth="1.5" opacity="0.4" />
        </svg>
      );

    case 'downward-dog':
      return (
        <svg viewBox="0 0 200 140" className={className} fill="none" stroke="currentColor">
          <line x1="20" y1="125" x2="180" y2="125" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
          {/* Inverted V apex at pelvis */}
          <path d="M 45 125 L 100 45 L 155 125" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {/* Arms / torso line */}
          <path d="M 100 45 L 140 125" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
          {/* Head relaxed between arms */}
          <circle cx="120" cy="80" r="7" fill="currentColor" opacity="0.85" />
          {/* Spine lengthening vector */}
          <path d="M 98 48 Q 110 65 125 85" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
        </svg>
      );

    case 'warrior-two':
      return (
        <svg viewBox="0 0 200 140" className={className} fill="none" stroke="currentColor">
          <line x1="20" y1="125" x2="180" y2="125" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
          {/* Front lunge leg (bent knee) */}
          <path d="M 145 125 L 145 88 L 105 80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {/* Back leg (straight) */}
          <path d="M 50 125 L 105 80" strokeWidth="3" strokeLinecap="round" />
          {/* Torso upright */}
          <path d="M 105 80 L 105 45" strokeWidth="3" strokeLinecap="round" />
          {/* Arms extended horizontally */}
          <path d="M 50 50 L 160 50" strokeWidth="2.5" strokeLinecap="round" />
          {/* Head gazing forward */}
          <circle cx="105" cy="33" r="8" fill="currentColor" opacity="0.85" />
        </svg>
      );

    case 'tree-pose':
      return (
        <svg viewBox="0 0 200 150" className={className} fill="none" stroke="currentColor">
          <line x1="40" y1="135" x2="160" y2="135" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
          {/* Standing leg straight */}
          <path d="M 100 135 L 100 85" strokeWidth="3" strokeLinecap="round" />
          {/* Bent leg placed on inner thigh */}
          <path d="M 100 85 L 125 105 L 100 102" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Torso */}
          <path d="M 100 85 L 100 48" strokeWidth="3" strokeLinecap="round" />
          {/* Arms in Anjali Mudra / overhead branch */}
          <path d="M 100 58 Q 85 30 100 20 Q 115 30 100 58" strokeWidth="2" strokeLinecap="round" />
          {/* Head */}
          <circle cx="100" cy="38" r="7" fill="currentColor" opacity="0.85" />
        </svg>
      );

    case 'cobra-pose':
      return (
        <svg viewBox="0 0 200 120" className={className} fill="none" stroke="currentColor">
          <line x1="20" y1="105" x2="180" y2="105" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
          {/* Legs on floor extending back */}
          <path d="M 30 105 L 100 103" strokeWidth="3" strokeLinecap="round" />
          {/* Chest arcing up */}
          <path d="M 100 103 Q 120 100 135 65" strokeWidth="3" strokeLinecap="round" />
          {/* Supporting arms */}
          <path d="M 125 75 L 115 105" strokeWidth="2.5" strokeLinecap="round" />
          {/* Head looking gently up */}
          <circle cx="140" cy="55" r="7" fill="currentColor" opacity="0.85" />
        </svg>
      );

    case 'cat-cow':
      return (
        <svg viewBox="0 0 200 120" className={className} fill="none" stroke="currentColor">
          <line x1="20" y1="105" x2="180" y2="105" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
          {/* Tabletop arms and knees */}
          <path d="M 60 105 L 60 75" strokeWidth="3" strokeLinecap="round" />
          <path d="M 140 105 L 140 75" strokeWidth="3" strokeLinecap="round" />
          {/* Undulating spine */}
          <path d="M 60 75 Q 100 88 140 75" strokeWidth="3" strokeLinecap="round" />
          {/* Gentle head lift */}
          <circle cx="152" cy="70" r="7" fill="currentColor" opacity="0.85" />
          {/* Flow waves indicator */}
          <path d="M 85 62 Q 100 55 115 62" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5" />
        </svg>
      );

    case 'seated-fold':
      return (
        <svg viewBox="0 0 200 120" className={className} fill="none" stroke="currentColor">
          <line x1="20" y1="105" x2="180" y2="105" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
          {/* Straight legs on mat */}
          <path d="M 60 103 L 155 103" strokeWidth="3" strokeLinecap="round" />
          {/* Folded torso along thighs */}
          <path d="M 60 103 Q 90 75 135 88" strokeWidth="3" strokeLinecap="round" />
          {/* Arms holding feet */}
          <path d="M 85 85 L 150 102" strokeWidth="2" strokeLinecap="round" />
          {/* Head resting toward shins */}
          <circle cx="130" cy="85" r="7" fill="currentColor" opacity="0.85" />
        </svg>
      );

    case 'legs-up-wall':
      return (
        <svg viewBox="0 0 200 130" className={className} fill="none" stroke="currentColor">
          {/* Floor & Wall */}
          <line x1="30" y1="115" x2="170" y2="115" strokeWidth="1.5" opacity="0.4" />
          <line x1="145" y1="115" x2="145" y2="20" strokeWidth="2" opacity="0.4" />
          {/* Torso on floor */}
          <path d="M 75 115 L 140 115" strokeWidth="3" strokeLinecap="round" />
          {/* Legs straight up wall */}
          <path d="M 140 115 L 140 35" strokeWidth="3" strokeLinecap="round" />
          {/* Arms out wide in cactus/rest */}
          <path d="M 105 115 Q 105 95 85 95" strokeWidth="2" strokeLinecap="round" />
          {/* Head on floor */}
          <circle cx="65" cy="112" r="7" fill="currentColor" opacity="0.85" />
        </svg>
      );

    case 'bridge-pose':
      return (
        <svg viewBox="0 0 200 120" className={className} fill="none" stroke="currentColor">
          <line x1="20" y1="105" x2="180" y2="105" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
          {/* Feet on floor */}
          <path d="M 50 105 L 65 75 L 105 55 L 145 95 L 155 105" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {/* Shoulders on mat */}
          <circle cx="160" cy="100" r="7" fill="currentColor" opacity="0.85" />
          {/* Energy lift vector */}
          <path d="M 105 80 L 105 60" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5" />
        </svg>
      );

    case 'supine-twist':
      return (
        <svg viewBox="0 0 200 120" className={className} fill="none" stroke="currentColor">
          <line x1="20" y1="105" x2="180" y2="105" strokeWidth="1.5" opacity="0.3" />
          {/* Torso supine */}
          <path d="M 60 102 L 120 102" strokeWidth="3" strokeLinecap="round" />
          {/* Knees twisted over */}
          <path d="M 115 102 Q 130 85 155 90" strokeWidth="3" strokeLinecap="round" />
          {/* Open arms */}
          <path d="M 85 102 L 85 75" strokeWidth="2" strokeLinecap="round" />
          <circle cx="50" cy="100" r="7" fill="currentColor" opacity="0.85" />
        </svg>
      );

    case 'pigeon-pose':
      return (
        <svg viewBox="0 0 200 120" className={className} fill="none" stroke="currentColor">
          <line x1="20" y1="105" x2="180" y2="105" strokeWidth="1.5" opacity="0.3" />
          {/* Front bent hip & back leg */}
          <path d="M 40 105 L 95 102" strokeWidth="3" strokeLinecap="round" />
          <path d="M 95 102 Q 115 90 135 98" strokeWidth="3" strokeLinecap="round" />
          {/* Torso folded forward over front shin */}
          <path d="M 115 95 L 145 75 L 165 95" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="165" cy="93" r="7" fill="currentColor" opacity="0.85" />
        </svg>
      );

    default: // savasana
      return (
        <svg viewBox="0 0 200 100" className={className} fill="none" stroke="currentColor">
          <line x1="20" y1="85" x2="180" y2="85" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
          {/* Peaceful relaxed horizontal figure */}
          <path d="M 45 80 L 150 80" strokeWidth="3" strokeLinecap="round" />
          {/* Feet falling outward */}
          <path d="M 45 80 L 35 76" strokeWidth="2.5" strokeLinecap="round" />
          {/* Arms resting beside body */}
          <path d="M 95 80 L 125 76" strokeWidth="2" strokeLinecap="round" />
          {/* Head resting on ground */}
          <circle cx="162" cy="77" r="7" fill="currentColor" opacity="0.85" />
          {/* Subtle aura ripples */}
          <circle cx="162" cy="77" r="14" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
        </svg>
      );
  }
};
