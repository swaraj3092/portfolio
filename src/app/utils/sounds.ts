const SOUNDS = {
  slash: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', // Minimalist clean tick for section jumps
  tech: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Digital boot for Terminal
  send: 'https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3', // High-tech chime for Transmission
  hover: 'https://assets.mixkit.co/active_storage/sfx/2562/2562-preview.mp3', // Soft digital blip for UI items
};

class SoundManager {
  private audios: Map<string, HTMLAudioElement> = new Map();

  private enabled = true;

  constructor() {
    if (typeof window === 'undefined') return;
    try {
      Object.entries(SOUNDS).forEach(([key, url]) => {
        const audio = new Audio();
        audio.src = url;
        audio.preload = 'auto';
        audio.volume = 0.3;
        this.audios.set(key, audio);
      });
    } catch (e) {
      console.error('SoundManager init failed', e);
    }
  }

  isEnabled() {
    return this.enabled;
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  private synthTick(frequency: number, type: OscillatorType = 'sine', duration = 0.1) {
    if (typeof window === 'undefined' || !this.enabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + duration);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  play(name: string, volume?: number) {
    if (typeof window === 'undefined' || !this.enabled) return;
    
    // Use synthesized sounds for core UI to bypass server issues (403/404)
    if (name === 'slash' || name === 'hover') {
      this.synthTick(name === 'slash' ? 800 : 1200, 'sine', 0.05);
      return;
    }

    try {
      const audio = this.audios.get(name);
      if (audio) {
        const clone = audio.cloneNode() as HTMLAudioElement;
        if (volume !== undefined) clone.volume = volume;
        clone.play().catch(() => {
          // Final fallback to synth if play fails
          this.synthTick(1000);
        });
      }
    } catch (e) {
      this.synthTick(1000);
    }
  }

  // Convenience methods to prevent crashes
  playHover() { this.play('hover', 0.15); }
  playClick() { this.play('hover', 0.2); }
  playSuccess() { this.play('tech', 0.5); }
}

export const soundManager = new SoundManager();
