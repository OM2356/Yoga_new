import React, { useState } from 'react';
import { ChatMessage, GeneratedRoutine, Asana } from '../types';
import { ASANAS } from '../data/wellnessData';
import { sound } from '../utils/audio';
import {
  Sparkles,
  Bot,
  Send,
  Loader2,
  Play,
  RotateCcw,
  Compass,
  CheckCircle2,
  Heart,
  Calendar,
  Zap,
} from 'lucide-react';

interface AIWellnessViewProps {
  currentCycleDay: number;
  onStartFlow: (asanas: Asana[], title: string) => void;
}

export const AIWellnessView: React.FC<AIWellnessViewProps> = ({
  currentCycleDay,
  onStartFlow,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'routine'>('chat');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Namaste. I am your FlowState AI Wellness Companion, grounded in classical yoga traditions, somatic science, and Ayurvedic cycle wisdom. How does your body feel today, or what would you like guidance on?",
      timestamp: 'Just now',
      source: 'gemini',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Routine Generator State
  const [mood, setMood] = useState('Anxious');
  const [energy, setEnergy] = useState('Restorative / Low');
  const [tensionArea, setTensionArea] = useState('Upper back and neck');
  const [availableMinutes, setAvailableMinutes] = useState(15);
  const [isGeneratingRoutine, setIsGeneratingRoutine] = useState(false);
  const [generatedRoutine, setGeneratedRoutine] = useState<GeneratedRoutine | null>(null);

  // Quick prompt chips
  const promptChips = [
    'How do I relieve tight neck and shoulders after a workday?',
    'What breathwork quickly stops racing thoughts?',
    'Recommend gentle poses for day 2 of my cycle',
    'I feel sluggish this morning, how do I awaken gently?',
  ];

  // Send chat message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: text.trim(),
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsSending(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history: messages,
          context: {
            currentCycleDay,
            primaryGoal: 'Stress Relief & Mobility',
          },
        }),
      });

      const data = await res.json();
      const aiReply: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: data.reply || 'May your breath bring you peace and presence.',
        timestamp: 'Now',
        source: data.source,
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      const fallbackReply: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: "I'm listening deeply. When experiencing tension, try lengthening your exhalations to twice the count of your inhalations, and gently rest your forehead in Child's Pose (Balasana) to stimulate the vagus nerve.",
        timestamp: 'Now',
        source: 'local-coach',
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsSending(false);
    }
  };

  // Generate Routine
  const handleGenerateRoutine = async () => {
    setIsGeneratingRoutine(true);
    setGeneratedRoutine(null);

    try {
      const res = await fetch('/api/gemini/routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood,
          energy,
          physicalTension: tensionArea,
          availableMinutes,
          cyclePhase: currentCycleDay <= 5 ? 'Menstrual' : currentCycleDay <= 12 ? 'Follicular' : currentCycleDay <= 16 ? 'Ovulatory' : 'Luteal',
        }),
      });

      const data = await res.json();
      setGeneratedRoutine(data);
      sound.playSingingBowl(432, 2.5);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingRoutine(false);
    }
  };

  // Launch generated routine into flow player
  const handleLaunchGeneratedFlow = () => {
    if (!generatedRoutine) return;
    // Map asana names or use curated matching
    const mappedAsanas: Asana[] = [];
    for (const item of generatedRoutine.asanas) {
      const found = ASANAS.find(
        (a) =>
          a.name.toLowerCase().includes(item.name.toLowerCase()) ||
          a.sanskritName.toLowerCase().includes(item.name.toLowerCase()) ||
          a.englishName.toLowerCase().includes(item.english?.toLowerCase() || '')
      );
      if (found) {
        mappedAsanas.push(found);
      }
    }

    // Fallback if model names were novel
    const finalAsanas = mappedAsanas.length > 0 ? mappedAsanas : [ASANAS[0], ASANAS[5], ASANAS[6], ASANAS[11]];
    onStartFlow(finalAsanas, generatedRoutine.title);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto pt-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E5EDE7] text-[#294F3B] text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Powered by Gemini 3.8 Flash</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif text-[#19241D] tracking-tight">
          AI Holistic Wellness Guide
        </h1>
        <p className="text-sm sm:text-base text-[#4E6657] mt-2 font-light">
          Your personal 24/7 mindful guide for custom asana sequencing, breathwork advice, and somatic tension release.
        </p>

        {/* Tab switch */}
        <div className="inline-flex p-1.5 rounded-2xl bg-[#EDE7DF] border border-[#DDD3C6] mt-6">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'chat'
                ? 'bg-white text-[#2D5A43] shadow-xs'
                : 'text-[#64796C] hover:text-[#19241D]'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Consult AI Companion</span>
          </button>
          <button
            onClick={() => setActiveTab('routine')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'routine'
                ? 'bg-white text-[#2D5A43] shadow-xs'
                : 'text-[#64796C] hover:text-[#19241D]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Generate Adaptive Routine</span>
          </button>
        </div>
      </div>

      {/* ===================== TAB 1: CHAT ===================== */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-[#E7DFD5] shadow-xs flex flex-col h-[650px] overflow-hidden animate-in fade-in">
          {/* Chat Header */}
          <div className="p-4 sm:p-5 border-b border-[#F0EAE1] bg-[#FAF8F5] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#2D5A43] to-[#407B5C] flex items-center justify-center text-white shadow-xs">
                <Bot className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1C2820]">FlowState Mindful Companion</h3>
                <span className="text-[11px] text-[#5E7969] flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Cycle Day {currentCycleDay} Context Aware</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'reset',
                    sender: 'ai',
                    text: 'Namaste. The conversation has been reset. How may I support your practice now?',
                    timestamp: 'Just now',
                  },
                ]);
              }}
              className="text-xs text-[#7B9585] hover:text-[#1C2820] flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Chat</span>
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#FCFBF9]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in`}
                >
                  <div
                    className={`max-w-xl rounded-3xl p-4 sm:p-5 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#2D5A43] text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-[#202E26] rounded-bl-xs border border-[#E7DFD5] shadow-xs'
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-[#4E755D] mb-1.5">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>AI Holistic Guide</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div
                      className={`text-[10px] mt-2 text-right ${
                        isUser ? 'text-emerald-200' : 'text-[#879E90]'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex justify-start">
                <div className="bg-white text-[#2D5A43] rounded-3xl p-4 border border-[#E7DFD5] flex items-center space-x-2 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-[#2D5A43]" />
                  <span>Channeling holistic yogic wisdom...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-3 bg-[#FAF8F5] border-t border-[#F0EAE1] overflow-x-auto flex items-center space-x-2">
            <span className="text-[11px] font-semibold text-[#668070] shrink-0 mr-1">Suggestions:</span>
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-[#EAE4DB] text-[#34483C] text-xs border border-[#E2DAD0] shrink-0 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 sm:p-4 bg-white border-t border-[#E7DFD5] flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask about poses for back pain, breathwork for stress, or cycle advice..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              className="flex-1 px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E2DAD0] text-sm text-[#1C2820] placeholder-[#8C9E94] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/30"
            />
            <button
              id="send-ai-message-btn"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isSending}
              className="p-3 rounded-2xl bg-[#2D5A43] hover:bg-[#204030] text-white disabled:opacity-40 transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: ROUTINE GENERATOR ===================== */}
      {activeTab === 'routine' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7DFD5] shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-serif text-[#1C2820]">
                Tell Us How You Feel Right Now
              </h3>
              <p className="text-xs text-[#5D7666]">
                Our AI architecture synthesizes somatic sequencing rules to construct an optimal session.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Mood */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#30473A]">Current State / Mood</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#203026] focus:outline-none"
                >
                  <option value="Anxious">Anxious / Racing Mind</option>
                  <option value="Low Energy">Fatigued / Depleted</option>
                  <option value="Focused">Focused & Ready to Flow</option>
                  <option value="Restless">Restless & Agitated</option>
                  <option value="Sluggish">Sluggish / Heavy Body</option>
                  <option value="Overwhelmed">Emotionally Overwhelmed</option>
                </select>
              </div>

              {/* Energy */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#30473A]">Desired Energy Level</label>
                <select
                  value={energy}
                  onChange={(e) => setEnergy(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#203026] focus:outline-none"
                >
                  <option value="Restorative / Low">Restorative & Grounding</option>
                  <option value="Moderate">Balanced Fluid Hatha</option>
                  <option value="Energizing / High">Energizing Solar Flow</option>
                </select>
              </div>

              {/* Tension Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#30473A]">Primary Tension Area</label>
                <select
                  value={tensionArea}
                  onChange={(e) => setTensionArea(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#203026] focus:outline-none"
                >
                  <option value="Upper back and neck">Upper Back & Cervical Neck</option>
                  <option value="Lower back and hips">Lumbar Spine & Pelvic Hips</option>
                  <option value="Tight chest and shoulders">Tight Chest & Shallow Breath</option>
                  <option value="Hamstrings and legs">Hamstrings & Lower Limbs</option>
                  <option value="Full body stiffness">Full Body Stiffness</option>
                </select>
              </div>

              {/* Available Minutes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#30473A]">Practice Duration</label>
                <select
                  value={availableMinutes}
                  onChange={(e) => setAvailableMinutes(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E0D7CC] text-xs text-[#203026] focus:outline-none"
                >
                  <option value={10}>10 Minutes (Quick Reset)</option>
                  <option value={15}>15 Minutes (Balanced)</option>
                  <option value={20}>20 Minutes (Deep Immersion)</option>
                  <option value={30}>30 Minutes (Full Masterclass)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                id="generate-ai-routine-btn"
                onClick={handleGenerateRoutine}
                disabled={isGeneratingRoutine}
                className="px-6 py-3.5 rounded-2xl bg-[#2D5A43] hover:bg-[#204030] text-white text-xs font-semibold uppercase tracking-wider shadow-md flex items-center space-x-2 transition-all disabled:opacity-50"
              >
                {isGeneratingRoutine ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                    <span>Architecting Sequence...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>Generate Tailored Routine</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Routine Card */}
          {generatedRoutine && (
            <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-[#E0D7CC] shadow-md space-y-6 animate-in slide-in-from-bottom-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#EAE3D9] pb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2D5A43] bg-[#E5EDE7] px-3 py-1 rounded-full">
                    AI Customized • {generatedRoutine.durationMinutes} Minutes
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif text-[#1A251E] mt-3">
                    {generatedRoutine.title}
                  </h2>
                  <p className="text-xs italic text-[#526B5C] mt-1 font-serif">
                    Theme: {generatedRoutine.theme}
                  </p>
                </div>

                <button
                  id="launch-generated-routine-btn"
                  onClick={handleLaunchGeneratedFlow}
                  className="px-6 py-3 rounded-2xl bg-[#2D5A43] hover:bg-[#204030] text-white text-xs font-semibold uppercase tracking-wider shadow-md flex items-center justify-center space-x-2 shrink-0 transition-transform hover:scale-102"
                >
                  <Play className="w-4 h-4 fill-current text-emerald-200" />
                  <span>Start This Flow Now</span>
                </button>
              </div>

              {/* Breathwork Prescription */}
              <div className="bg-white p-5 rounded-2xl border border-[#E6DFD4] space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D5A43] block">
                  Prescribed Breathwork: {generatedRoutine.breathwork.name} ({generatedRoutine.breathwork.duration})
                </span>
                <p className="text-xs text-[#486353] leading-relaxed">
                  {generatedRoutine.breathwork.instructions}
                </p>
              </div>

              {/* Asana Flow List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#5C7767]">
                  Sequence Architecture ({generatedRoutine.asanas.length} Poses):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {generatedRoutine.asanas.map((pose, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-[#E6DFD4] flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-full bg-[#E8F0EC] text-[#2D5A43] text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <h5 className="text-sm font-medium text-[#1A251E]">{pose.name}</h5>
                          <span className="text-[11px] text-[#698574]">
                            {pose.english} • {pose.focus}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#2D5A43] shrink-0 ml-2">
                        {pose.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Somatic Affirmation */}
              <div className="p-4 rounded-2xl bg-[#E8F0EC] border border-[#CDE0D4] text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#2D5A43] block mb-1">
                  Daily Somatic Anchor
                </span>
                <p className="font-serif italic text-sm text-[#1B2B21]">
                  "{generatedRoutine.affirmation}"
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
