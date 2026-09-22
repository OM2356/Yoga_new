export type PageView =
  | 'home'
  | 'yoga'
  | 'meditation'
  | 'cycle'
  | 'deep-dive'
  | 'ai-wellness'
  | 'knowledge'
  | 'dashboard';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export type EnergyLevel = 'Restorative / Low' | 'Moderate' | 'Energizing / High';

export interface Asana {
  id: string;
  name: string;
  sanskritName: string;
  englishName: string;
  category: 'Standing' | 'Seated' | 'Prone' | 'Supine' | 'Inversion' | 'Balance';
  level: ExperienceLevel;
  durationSeconds: number;
  energyLevel: EnergyLevel;
  targetAreas: string[];
  benefits: string[];
  precautions: string[];
  steps: string[];
  breathCue: string;
  moodTags: string[];
  cyclePhases?: ('Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal')[];
  svgType: string;
}

export interface PranayamaExercise {
  id: string;
  name: string;
  sanskritName: string;
  subtitle: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  cyclesCount: number;
  category: 'Calming' | 'Balancing' | 'Energizing' | 'Focus';
  benefits: string[];
  instructions: string[];
  bestTime: string;
}

export interface MeditationPreset {
  id: string;
  title: string;
  durationMinutes: number;
  category: 'Morning Clarity' | 'Stress Relief' | 'Body Scan' | 'Deep Sleep' | 'Self-Compassion';
  description: string;
  bellIntervalMinutes?: number;
  suggestedSound?: string;
  reflectionPrompt: string;
}

export interface CyclePhaseInfo {
  phase: 'Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal';
  dayRange: string;
  title: string;
  season: string;
  energy: string;
  hormoneNote: string;
  yogaFocus: string;
  recommendedAsanaIds: string[];
  breathworkRecommendation: string;
  nutritionTips: string[];
  colorHex: string;
  bgClass: string;
  accentClass: string;
}

export interface DeepDiveProgram {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  targetOutcome: string;
  suitableFor: string;
  steps: {
    title: string;
    durationMinutes: number;
    type: 'breath' | 'movement' | 'somatic-release' | 'stillness';
    description: string;
    cues: string[];
  }[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  subtitle: string;
  category: 'Somatic Science' | 'Ayurveda & Habits' | 'Cycle Syncing' | 'Breathwork' | 'Mindfulness';
  readTime: string;
  author: string;
  date: string;
  summary: string;
  sections: {
    heading: string;
    content: string;
  }[];
  keyTakeaways: string[];
  tags: string[];
}

export interface UserProfile {
  name: string;
  streakDays: number;
  totalMindfulMinutes: number;
  sessionsCompleted: number;
  favoriteAsanaIds: string[];
  savedArticleIds: string[];
  currentCycleDay: number;
  cycleTrackingEnabled: boolean;
  primaryGoal: 'Flexibility & Strength' | 'Stress Relief & Sleep' | 'Hormonal Balance' | 'Daily Mindfulness';
  moodLogs: {
    date: string;
    mood: string;
    energy: string;
    note?: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'local-coach';
}

export interface GeneratedRoutine {
  title: string;
  durationMinutes: number;
  theme: string;
  breathwork: {
    name: string;
    duration: string;
    instructions: string;
  };
  asanas: {
    name: string;
    english: string;
    duration: string;
    focus: string;
  }[];
  affirmation: string;
  source?: string;
}
