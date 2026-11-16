/**
 * 水晶音樂純前端 Web Audio API 合成引擎模板 (Crystal Music Engine Template)
 * 零版權問題、無外部音檔載入延遲、純程式即時合成清脆水晶音色。
 */

class CrystalMusicEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.currentTrack = 0;
    this.timer = null;
    this.noteIndex = 0;

    // 四首不同調性、速度與音階的樂曲資料
    this.tracks = [
      {
        name: '清晨微風 (C大調悠揚)',
        scale: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25],
        tempoMs: 380,
        pattern: [0, 2, 4, 7, 5, 4, 2, 0, 4, 5, 7, 4, 2, 1, 0, 2]
      },
      {
        name: '山林漫步 (G大調輕快)',
        scale: [392.00, 440.00, 493.88, 587.33, 659.25, 783.99, 880.00],
        tempoMs: 300,
        pattern: [0, 1, 2, 4, 3, 2, 1, 0, 2, 4, 5, 4, 2, 0, 1, 0]
      },
      {
        name: '陽光茶園 (F大調溫暖)',
        scale: [349.23, 392.00, 440.00, 466.16, 523.25, 587.33, 698.46],
        tempoMs: 440,
        pattern: [0, 2, 4, 3, 2, 0, 1, 3, 2, 4, 6, 4, 2, 0, 1, 0]
      },
      {
        name: '寧靜星空 (A小調沉靜)',
        scale: [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25],
        tempoMs: 500,
        pattern: [0, 2, 3, 5, 4, 3, 2, 0, 1, 2, 4, 2, 1, 0, 2, 0]
      }
    ];
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playCrystalBell(freq, duration = 1.2) {
    if (!this.audioCtx || this.isMuted) return;
    const now = this.audioCtx.currentTime;

    // 主音正弦波 (Sine)
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // 泛音層 (Harmonic chime) 營造水晶清脆質感
    const harmonic = this.audioCtx.createOscillator();
    const harmonicGain = this.audioCtx.createGain();
    harmonic.type = 'sine';
    harmonic.frequency.setValueAtTime(freq * 2.76, now);

    // 音量包絡 (ADSR: 瞬發打擊感 + 悠長衰減)
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    harmonicGain.gain.setValueAtTime(0, now);
    harmonicGain.gain.linearRampToValueAtTime(0.06, now + 0.015);
    harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.45));

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    harmonic.connect(harmonicGain);
    harmonicGain.connect(this.audioCtx.destination);

    osc.start(now);
    harmonic.start(now);
    osc.stop(now + duration);
    harmonic.stop(now + duration);
  }

  start() {
    this.init();
    this.isPlaying = true;
    this.tick();
  }

  tick() {
    if (!this.isPlaying) return;
    const track = this.tracks[this.currentTrack];
    const notePatternIndex = track.pattern[this.noteIndex % track.pattern.length];
    const freq = track.scale[notePatternIndex % track.scale.length];

    this.playCrystalBell(freq);
    this.noteIndex++;
    this.timer = setTimeout(() => this.tick(), track.tempoMs);
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) clearTimeout(this.timer);
  }

  switchTrack(index) {
    this.currentTrack = index % this.tracks.length;
    this.noteIndex = 0;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

if (typeof module !== 'undefined') {
  module.exports = CrystalMusicEngine;
}
