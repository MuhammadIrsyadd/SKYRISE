export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.enabled = true;
  }

  playTone(freq, type, duration, volume = 0.1) {
    if (!this.enabled) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playPlace(accuracy) {
    if (accuracy === 'PERFECT') {
      this.playTone(440, 'sine', 0.2, 0.1);
      this.playTone(880, 'sine', 0.3, 0.05);
    } else if (accuracy === 'GREAT') {
      this.playTone(330, 'square', 0.1, 0.05);
    } else if (accuracy === 'GOOD') {
      this.playTone(220, 'triangle', 0.1, 0.05);
    } else {
      this.playTone(110, 'sawtooth', 0.3, 0.1);
    }
  }

  playGameOver() {
    this.playTone(110, 'sawtooth', 0.5, 0.1);
    this.playTone(82.4, 'sawtooth', 1.0, 0.1);
  }
}
