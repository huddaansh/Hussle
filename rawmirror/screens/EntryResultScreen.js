import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { T } from '../utils/theme';

export default function EntryResultScreen({ entry, onBack, onToggleMoment }) {
  const [showMomentPicker, setShowMomentPicker] = useState(false);
  const categories = ['Career', 'Education', 'Personal', 'Other'];

  const handleMoment = (category) => {
    onToggleMoment(entry, category);
    setShowMomentPicker(false);
  };

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={onBack}><Text style={styles.back}>← BACK</Text></TouchableOpacity>
        <Text style={styles.navTitle}>{entry.date}</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Word of Day */}
      {entry.wordOfDay && (
        <View style={styles.wordCard}>
          <Text style={styles.wordLabel}>WORD OF THE DAY</Text>
          <Text style={styles.wordText}>{entry.wordOfDay.toUpperCase()}</Text>
        </View>
      )}

      {/* Draft badge */}
      {entry.isDraft && (
        <View style={styles.draftBanner}>
          <Text style={styles.draftBannerText}>⚠ DRAFT — Not yet evaluated</Text>
        </View>
      )}

      {/* Scores */}
      <View style={styles.scoresRow}>
        <View style={styles.scoreCard}>
          <Text style={[styles.scoreNum, { color: entry.score >= 7 ? T.green : entry.score >= 5 ? T.orange : T.red }]}>{entry.score}</Text>
          <Text style={styles.scoreLabel}>DAY SCORE</Text>
        </View>
        <View style={styles.scoreCard}>
          <Text style={[styles.scoreNum, { color: entry.honestyScore >= 7 ? T.green : entry.honestyScore >= 5 ? T.orange : T.red }]}>{entry.honestyScore}</Text>
          <Text style={styles.scoreLabel}>HONESTY</Text>
        </View>
        {entry.mood && (
          <View style={styles.scoreCard}>
            <Text style={[styles.scoreNum, { fontSize: 13, marginTop: 6 }]}>{entry.mood}</Text>
            <Text style={styles.scoreLabel}>MOOD</Text>
          </View>
        )}
      </View>

      {/* AI Evaluation */}
      {entry.evaluation ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI EVALUATION</Text>
          <View style={styles.evalCard}>
            <Text style={styles.evalText}>{entry.evaluation}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.section}>
          <View style={styles.pendingCard}>
            <Text style={styles.pendingText}>⏳ {entry.isDraft ? 'Submit entry to get AI evaluation.' : 'Evaluation pending — will run when API key is available.'}</Text>
          </View>
        </View>
      )}

      {/* BS Check */}
      {entry.bsCheck && entry.bsCheck !== 'VERIFIED' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 BS DETECTOR</Text>
          <View style={[styles.evalCard, { borderLeftColor: T.red }]}>
            <Text style={styles.evalText}>{entry.bsCheck}</Text>
          </View>
        </View>
      )}

      {/* Wins & Misses */}
      {(entry.wins?.length > 0 || entry.misses?.length > 0) && (
        <View style={styles.section}>
          <View style={styles.winsRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionTitle, { color: T.green }]}>✓ WINS</Text>
              {entry.wins?.map((w, i) => <Text key={i} style={styles.winItem}>• {w}</Text>)}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionTitle, { color: T.red }]}>✗ MISSES</Text>
              {entry.misses?.map((m, i) => <Text key={i} style={styles.missItem}>• {m}</Text>)}
            </View>
          </View>
        </View>
      )}

      {/* Tomorrow Challenge */}
      {entry.tomorrowChallenge && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TOMORROW — NO EXCUSES</Text>
          <View style={[styles.evalCard, { borderLeftColor: T.gold }]}>
            <Text style={styles.evalText}>{entry.tomorrowChallenge}</Text>
          </View>
        </View>
      )}

      {/* Mark as Moment */}
      <View style={styles.section}>
        {entry.isMoment ? (
          <TouchableOpacity style={styles.momentBtn} onPress={() => onToggleMoment(entry, null)}>
            <Text style={styles.momentBtnText}>★ SAVED AS MOMENT — TAP TO REMOVE</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.momentBtn} onPress={() => setShowMomentPicker(!showMomentPicker)}>
              <Text style={styles.momentBtnText}>☆ MARK AS MOMENT</Text>
            </TouchableOpacity>
            {showMomentPicker && (
              <View style={styles.catPicker}>
                {categories.map(c => (
                  <TouchableOpacity key={c} style={styles.catPickerItem} onPress={() => handleMoment(c)}>
                    <Text style={styles.catPickerText}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}
      </View>

      {/* Raw Entry */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>YOUR ENTRY</Text>
        <View style={styles.rawCard}>
          <Text style={styles.rawText}>{entry.text}</Text>
        </View>
      </View>

      {entry.screenTime ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SCREEN TIME</Text>
          <View style={styles.rawCard}>
            <Text style={styles.rawText}>{entry.screenTime}</Text>
          </View>
        </View>
      ) : null}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 8 },
  back: { color: T.accent, fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  navTitle: { color: T.text, fontSize: 13, fontWeight: '900', letterSpacing: 2 },
  wordCard: { margin: 16, backgroundColor: '#1a0000', borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: T.accent },
  wordLabel: { color: T.textSub, fontSize: 9, fontWeight: '800', letterSpacing: 3, marginBottom: 6 },
  wordText: { color: T.accent, fontSize: 36, fontWeight: '900', letterSpacing: 4 },
  draftBanner: { marginHorizontal: 16, backgroundColor: '#1a0f00', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: T.orange },
  draftBannerText: { color: T.orange, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  scoresRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginTop: 12 },
  scoreCard: { flex: 1, backgroundColor: T.card, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: T.border },
  scoreNum: { color: T.text, fontSize: 32, fontWeight: '900' },
  scoreLabel: { color: T.textSub, fontSize: 9, letterSpacing: 2, marginTop: 4 },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { color: T.textSub, fontSize: 10, fontWeight: '800', letterSpacing: 3, marginBottom: 10 },
  evalCard: { backgroundColor: T.card, borderRadius: 12, padding: 14, borderLeftWidth: 3, borderLeftColor: T.accent },
  evalText: { color: T.text, fontSize: 14, lineHeight: 22 },
  pendingCard: { backgroundColor: T.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: T.orange },
  pendingText: { color: T.orange, fontSize: 13, lineHeight: 20 },
  winsRow: { flexDirection: 'row', gap: 16 },
  winItem: { color: T.green, fontSize: 13, lineHeight: 20, marginBottom: 4 },
  missItem: { color: T.red, fontSize: 13, lineHeight: 20, marginBottom: 4 },
  rawCard: { backgroundColor: T.card2, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: T.border },
  rawText: { color: T.textSub, fontSize: 13, lineHeight: 21 },
  momentBtn: { backgroundColor: T.card, borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: T.gold },
  momentBtnText: { color: T.gold, fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  catPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  catPickerItem: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: T.card2, borderRadius: 20, borderWidth: 1, borderColor: T.border },
  catPickerText: { color: T.text, fontSize: 13, fontWeight: '600' },
});
