export const Algo = {
  getStreak: (entries) => {
    if (!entries.length) return 0;
    const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    let current = new Date(); current.setHours(0,0,0,0);
    for (let e of sorted) {
      const d = new Date(e.date); d.setHours(0,0,0,0);
      const diff = Math.round((current - d) / 86400000);
      if (diff === streak) streak++;
      else break;
    }
    return streak;
  },

  getBestStreak: (entries) => {
    if (!entries.length) return 0;
    const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
    let best = 1, current = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i-1].date);
      const curr = new Date(sorted[i].date);
      const diff = Math.round((curr - prev) / 86400000);
      if (diff === 1) { current++; best = Math.max(best, current); }
      else current = 1;
    }
    return best;
  },

  getPatterns: (entries) => {
    const flags = [];
    if (entries.length < 3) return flags;
    const recent = entries.slice(-7);
    const scores = recent.map(e => e.score).filter(Boolean);
    if (scores.length >= 3) {
      const avg = scores.reduce((a,b) => a+b, 0) / scores.length;
      if (avg < 5) flags.push({ type: 'warning', msg: 'Your average score this week is below 5. You are underperforming consistently.' });
      const last3 = scores.slice(-3);
      if (last3.every((s,i) => i === 0 || s < last3[i-1])) flags.push({ type: 'danger', msg: 'Scores dropping 3 days in a row. Wake up.' });
    }
    const moods = recent.map(e => e.mood).filter(Boolean);
    const negativeMoods = moods.filter(m => ['tired','off','distracted','lazy'].includes(m?.toLowerCase()));
    if (negativeMoods.length >= 3) flags.push({ type: 'warning', msg: `Negative mood detected ${negativeMoods.length} out of last ${moods.length} days.` });
    const honesty = recent.map(e => e.honestyScore).filter(Boolean);
    if (honesty.length >= 3) {
      const avgH = honesty.reduce((a,b)=>a+b,0)/honesty.length;
      if (avgH < 5) flags.push({ type: 'danger', msg: 'Low self-honesty scores detected. Are you lying to yourself?' });
    }
    return flags;
  },

  getSelfHonestyScore: (entry) => {
    let score = 10;
    if (entry.length < 100) score -= 3;
    if (entry.split(' ').length < 20) score -= 2;
    const vague = ['did stuff','was okay','fine','alright','good day','bad day'];
    vague.forEach(v => { if (entry.toLowerCase().includes(v)) score -= 1; });
    return Math.max(1, Math.min(10, score));
  },

  moodToScore: (mood) => {
    const map = { 'Locked In': 10, 'Focused': 8, 'Neutral': 5, 'Tired': 4, 'Off': 3, 'Distracted': 3, 'Lazy': 2 };
    return map[mood] || 5;
  },
};
