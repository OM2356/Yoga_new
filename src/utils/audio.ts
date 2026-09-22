// Web Audio API Synthesizer for FlowState Wellness
// Tibetan singing bowl chimes, interval gongs, and ambient nature generators (Rain, Ocean, Forest, Bowls)

export type SoundscapeType = 'rain' | 'ocean' | 'singing-bowl' | 'forest' | 'white-noise' | 'none';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientSourceNode: AudioNode | null = null;
  private currentAmbientType: string | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;

  private initCtx(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play Tibetan singing bowl bell chime
  public playSingingBowl(freq = 432, duration = 3.5) {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      // Master bell gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.4 * this.volume, now + 0.05);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      masterGain.connect(ctx.destination);

      // Fundamental harmonic
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // Warm shimmer harmonic
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.76, now); // Metallic partial

      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.18, now);
      osc2Gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.8);
      osc2.connect(osc2Gain);
      osc2Gain.connect(masterGain);

      // Sub-harmonic depth
      const osc3 = ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq * 0.5, now);
      const osc3Gain = ctx.createGain();
      osc3Gain.gain.setValueAtTime(0.2, now);
      osc3Gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc3.connect(osc3Gain);
      osc3Gain.connect(masterGain);

      osc1.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + duration);
      osc2.stop(now + duration);
      osc3.stop(now + duration);
    } catch (e) {
      console.warn('Audio play failed:', e);
    }
  }

  // Soft cue chime for pose transition
  public playTransitionChime() {
    this.playSingingBowl(528, 2.5); // 528Hz "Miracle / Transformation" frequency
  }

  // Gentle breath guide click/soft tone
  public playBreathPulse(isInhale: boolean) {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const startFreq = isInhale ? 220 : 330;
      const endFreq = isInhale ? 330 : 220;

      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.3);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05 * this.volume, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      // safe fallback
    }
  }

  // Start continuous ambient soundscape
  public startAmbient(type: 'rain' | 'ocean' | 'singing-bowl' | 'forest' | 'white-noise') {
    this.stopAmbient();
    if (this.isMuted) return;

    try {
      const ctx = this.initCtx();
      this.currentAmbientType = type;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.25 * this.volume, ctx.currentTime + 1.2);
      masterGain.connect(ctx.destination);
      this.ambientGain = masterGain;

      if (type === 'rain') {
        // Pink noise filtered through lowpass
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();
        this.ambientSourceNode = whiteNoise;
      } else if (type === 'ocean') {
        // Modulated filtered pink noise simulating breaking surf waves
        const bufferSize = ctx.sampleRate * 4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(350, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);

        // LFO for surf waves (0.1 Hz)
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(280, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();
        this.ambientSourceNode = noise;
      } else if (type === 'singing-bowl') {
        // Continuous soothing 432 Hz warm harmonic drone
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const osc3 = ctx.createOscillator();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc3.type = 'sine';

        osc1.frequency.setValueAtTime(216, ctx.currentTime);
        osc2.frequency.setValueAtTime(432, ctx.currentTime);
        osc3.frequency.setValueAtTime(648, ctx.currentTime);

        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.3, ctx.currentTime);

        osc1.connect(masterGain);
        osc2.connect(masterGain);
        osc3.connect(subGain);
        subGain.connect(masterGain);

        osc1.start();
        osc2.start();
        osc3.start();

        this.ambientSourceNode = osc1;
      } else {
        // Forest gentle breeze
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime);

        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();
        this.ambientSourceNode = noise;
      }
    } catch (e) {
      console.warn('Ambient start failed:', e);
    }
  }

  public stopAmbient() {
    if (this.ambientGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
        setTimeout(() => {
          if (this.ambientSourceNode) {
            try {
              (this.ambientSourceNode as any).stop?.();
            } catch {}
            this.ambientSourceNode.disconnect();
            this.ambientSourceNode = null;
          }
          this.currentAmbientType = null;
        }, 850);
      } catch (e) {
        this.ambientSourceNode = null;
        this.currentAmbientType = null;
      }
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAmbient();
    }
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(0.25 * this.volume, this.ctx.currentTime);
    }
  }

  public getCurrentAmbient(): string | null {
    return this.currentAmbientType;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const sound = new SoundEngine();
