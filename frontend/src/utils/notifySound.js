/** Short notification chime via Web Audio API (no audio file needed). */
export function playNotificationSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const playTone = (freq, start, dur, gainValue = 0.08) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur + 0.02);
    };

    playTone(880, now, 0.12, 0.09);
    playTone(1175, now + 0.12, 0.16, 0.07);

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 500);
  } catch {
    // Ignore audio errors (autoplay policies, etc.)
  }
}
