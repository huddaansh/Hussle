import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { T } from '../utils/theme';
import { Algo } from '../utils/algo';
import { callAI } from '../services/ai';

export default function JournalScreen({ entries, settings, onSave, existingDraft }) {
  const [text, setText] = useState(existingDraft?.text || '');
  const [score, setScore] = useState(existingDraft?.score || 5);
  const [mood, setMood] = useState(existingDraft?.mood || '');
  const [screenTime, setScreenTime] = useState(existingDraft?.screenTime || '');
  const [intention, setIntention] = useState(existingDraft?.intention || '');
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const autoSaveRef = useRef(null);

  const today = new Date().toISOString().split('T')[0];
  const yesterday = entries.find(e => {
    const d = new Date(); d.setDate(d.getDate()-1);
    return e.date === d.toISOString().split('T')[0];
  });
  const yesterdayIntention = yesterday?.intention;
  const moods = ['Locked In','Focused','Neutral','Tired','Off','Distracted','Lazy'];

  // Auto-save every 10 seconds
  useEffect(() => {
    if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    autoSaveRef.current = setInterval(() => {
      if (text.trim().length > 10) {
        saveDraft();
      }
    }, 10000);
    return () => { if (autoSaveRef.current) clearInterval(autoSaveRef.current); };
  }, [text, score, mood, screenTime, intention]);

  const saveDraft = () => {
    const draft = {
      id: existingDraft?.id || Date.now().toString(),
      date: today,
      text, score, mood, screenTime, intention,
      isDraft: true,
      honestyScore: Algo.getSelfHonestyScore(text),
      evaluation: null, wins: [], misses: [],
      bsCheck: null, wordOfDay: null, tomorrowChallenge: null,
      pendingEval: true,
      createdAt: existingDraft?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSave(draft, true); // true = isDraft
    setLastSaved(new Date());
  };

  const handleSubmit = async () => {
    if (text.trim().length < 50) { Alert.alert('Too short', 'Write at least 50 characters. Be specific.'); return; }
    setLoading(true);
    const honestyScore = Algo.getSelfHonestyScore(text);
    let aiResult = null;
    if (settings?.apiKeys?.[settings?.aiProvider || 'groq']) {
      aiResult = await callAI(text, entries, screenTime, yesterdayIntention, settings);
    }
    const entry = {
      id: existingDraft?.id || Date.now().toString(),
      date: today,
      text, score, mood, screenTime, intention,
      isDraft: false,
      honestyScore: aiResult?.honestyRating || honestyScore,
      evaluation: aiResult?.evaluation || null,
      wins: aiResult?.wins || [],
      misses: aiResult?.misses || [],
      bsCheck: aiResult?.bsCheck || null,
      wordOfDay: aiResult?.wordOfDay || null,
      tomorrowChallenge: aiResult?.tomorrowChallenge || null,
      pendingEval: !aiResult,
      createdAt: existingDraft?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLoading(false);
    onSave(entry, false);
  };

  const timeSinceSave = lastSaved ? Math.round((new Date() - lastSaved) / 60000) : null;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>TODAY'S LOG</Text>
        <Text style={styles.dateText}>{new Date().toDateString()}</Text>
        {lastSaved && <Text style={styles.autoSaved}>Auto-saved {timeSinceSave === 0 ? 'just now' : `${timeSinceSave}m ago`}</Text>}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {yesterdayIntention && (
          <View style={styles.intentionCheck}>
            <Text style={styles.intentionLabel}>YESTERDAY YOU SAID:</Text>
            <Text style={styles.intentionText}>"{yesterdayIntention}"</Text>
            <Text style={styles.intentionSub}>Did you do it? Be honest below.</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WHAT DID YOU DO TODAY?</Text>
          <Text style={styles.hint}>Be specific. Vague entries get flagged.</Text>
          <TextInput
            style={styles.bigInput}
            multiline
            placeholder="Write everything. What did you study, practice, avoid, waste time on. Be honest."
            placeholderTextColor={T.textMuted}
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{text.length} chars {text.length < 100 ? '— write more' : '✓'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RATE YOUR DAY: {score}/10</Text>
          <View style={styles.scoreRow}>
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <TouchableOpacity key={n}
                style={[styles.scoreBtn, score === n && styles.scoreBtnActive,
                  { backgroundColor: n <= 3 ? '#1a0000' : n <= 6 ? '#1a0f00' : '#001a0a' }]}
                onPress={() => setScore(n)}>
                <Text style={[styles.scoreBtnText, score === n && { color: n <= 3 ? T.red : n <= 6 ? T.orange : T.green }]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MOOD</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.moodRow}>
              {moods.map(m => (
                <TouchableOpacity key={m} style={[styles.moodChip, mood === m && styles.moodChipActive]} onPress={() => setMood(m)}>
                  <Text style={[styles.moodText, mood === m && { color: T.accent }]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SCREEN TIME (OPTIONAL)</Text>
          <Text style={styles.hint}>Paste from Digital Wellbeing — AI will cross-check your claims.</Text>
          <TextInput
            style={styles.smallInput}
            multiline
            placeholder="e.g. Instagram: 3h 20m, YouTube: 2h..."
            placeholderTextColor={T.textMuted}
            value={screenTime}
            onChangeText={setScreenTime}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TOMORROW'S INTENTION</Text>
          <Text style={styles.hint}>One specific thing. AI checks this tomorrow.</Text>
          <TextInput
            style={styles.smallInput}
            placeholder="e.g. Complete 2 LeetCode problems and read 20 pages"
            placeholderTextColor={T.textMuted}
            value={intention}
            onChangeText={setIntention}
          />
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.draftBtn} onPress={saveDraft}>
            <Text style={styles.draftBtnText}>SAVE DRAFT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.submitBtn, loading && { opacity: 0.6 }]} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color={T.text} size="small" /> : <Text style={styles.submitBtnText}>SUBMIT & EVALUATE</Text>}
          </TouchableOpacity>
        </View>

        {!settings?.apiKeys?.[settings?.aiProvider || 'groq'] && (
          <Text style={styles.noApiNote}>⚠ No API key set. Add in Settings for AI evaluation.</Text>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg },
  header: { padding: 16, paddingTop: 8, borderBottomWidth: 1, borderBottomColor: T.border },
  title: { color: T.text, fontSize: 20, fontWeight: '900', letterSpacing: 4 },
  dateText: { color: T.textSub, fontSize: 12, marginTop: 2 },
  autoSaved: { color: T.green, fontSize: 10, fontWeight: '700', marginTop: 4 },

  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { color: T.textSub, fontSize: 10, fontWeight: '800', letterSpacing: 3, marginBottom: 8 },
  hint: { color: T.textMuted, fontSize: 11, marginBottom: 8 },

  intentionCheck: { margin: 16, backgroundColor: '#1a1400', borderRadius: 12, padding: 14, borderLeftWidth: 3, borderLeftColor: T.gold },
  intentionLabel: { color: T.gold, fontSize: 9, fontWeight: '800', letterSpacing: 2, marginBottom: 4 },
  intentionText: { color: T.text, fontSize: 13, fontStyle: 'italic', marginBottom: 4 },
  intentionSub: { color: T.textSub, fontSize: 11 },

  bigInput: { backgroundColor: T.card, borderRadius: 12, padding: 14, color: T.text, fontSize: 15, lineHeight: 24, minHeight: 180, borderWidth: 1, borderColor: T.border },
  smallInput: { backgroundColor: T.card, borderRadius: 12, padding: 14, color: T.text, fontSize: 14, lineHeight: 22, minHeight: 80, borderWidth: 1, borderColor: T.border },
  charCount: { color: T.textSub, fontSize: 10, marginTop: 4, textAlign: 'right' },

  scoreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  scoreBtn: { width: 32, height: 32, borderRadius: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: T.border },
  scoreBtnActive: { borderColor: T.accent, borderWidth: 2 },
  scoreBtnText: { color: T.textSub, fontSize: 13, fontWeight: '700' },

  moodRow: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  moodChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: T.card, borderWidth: 1, borderColor: T.border },
  moodChipActive: { borderColor: T.accent },
  moodText: { color: T.textSub, fontSize: 13, fontWeight: '600' },

  btnRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 24, gap: 10 },
  draftBtn: { flex: 1, backgroundColor: T.card, borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: T.border },
  draftBtnText: { color: T.textSub, fontSize: 13, fontWeight: '800', letterSpacing: 2 },
  submitBtn: { flex: 2, backgroundColor: T.accent, borderRadius: 12, padding: 16, alignItems: 'center' },
  submitBtnText: { color: T.text, fontSize: 13, fontWeight: '900', letterSpacing: 2 },
  noApiNote: { color: T.orange, fontSize: 11, textAlign: 'center', marginTop: 12, marginHorizontal: 16 },
});
