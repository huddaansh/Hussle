import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { T } from '../utils/theme';
import { Algo } from '../utils/algo';

export default function HomeScreen({ entries, onNewEntry, onViewEntry }) {
  const streak = Algo.getStreak(entries);
  const bestStreak = Algo.getBestStreak(entries);
  const patterns = Algo.getPatterns(entries);
  const today = new Date().toISOString().split('T')[0];
  const todayEntry = entries.find(e => e.date === today);
  const recent = [...entries].sort((a,b) => new Date(a.date)-new Date(b.date)).slice(-7);
  const avgScore = recent.length ? (recent.reduce((a,e) => a+(e.score||0),0)/recent.length).toFixed(1) : '—';

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>HUSSLE</Text>
          <Text style={styles.date}>{new Date().toDateString().toUpperCase()}</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakFire}>🔥</Text>
          <Text style={styles.streakNum}>{streak}</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{streak}</Text>
          <Text style={styles.statLabel}>STREAK</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNum, { color: T.gold }]}>{avgScore}</Text>
          <Text style={styles.statLabel}>AVG SCORE</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNum, { color: T.green }]}>{entries.length}</Text>
          <Text style={styles.statLabel}>TOTAL DAYS</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNum, { color: T.orange }]}>{bestStreak}</Text>
          <Text style={styles.statLabel}>BEST</Text>
        </View>
      </View>

      {/* Pattern Alerts */}
      {patterns.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠ PATTERN ALERTS</Text>
          {patterns.map((p, i) => (
            <View key={i} style={[styles.flagCard, { borderLeftColor: p.type === 'danger' ? T.red : T.orange }]}>
              <Text style={styles.flagText}>{p.msg}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Today */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TODAY</Text>
        {todayEntry ? (
          <TouchableOpacity style={styles.todayDone} onPress={() => onViewEntry(todayEntry)}>
            <Text style={styles.todayIcon}>✓</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.todayDoneText}>{todayEntry.isDraft ? 'Draft saved' : 'Entry submitted'}</Text>
              {todayEntry.wordOfDay && <Text style={styles.wordOfDay}>Word: <Text style={{ color: T.accent }}>{todayEntry.wordOfDay}</Text></Text>}
              {todayEntry.score && <Text style={styles.todayScore}>Score: {todayEntry.score}/10</Text>}
              {todayEntry.isDraft && <Text style={styles.draftBadge}>DRAFT — tap to continue</Text>}
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.newEntryBtn} onPress={onNewEntry}>
            <Text style={styles.newEntryBtnText}>+ LOG TODAY</Text>
            <Text style={styles.newEntryBtnSub}>Don't skip. Every day counts.</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Streak Section */}
      {streak === 0 ? (
        <View style={styles.section}>
          <View style={styles.streakCard}>
            <Text style={styles.streakCardIcon}>💀</Text>
            <Text style={styles.streakCardText}>No streak. Start today.</Text>
            <Text style={styles.streakCardSub}>Best ever: {bestStreak} days</Text>
          </View>
        </View>
      ) : (
        <View style={styles.section}>
          <View style={styles.streakCard}>
            <Text style={styles.streakCardIcon}>🔥</Text>
            <Text style={styles.streakCardBig}>{streak}</Text>
            <Text style={styles.streakCardText}>Day Streak</Text>
            <Text style={styles.streakCardSub}>Best ever: {bestStreak} days</Text>
          </View>
        </View>
      )}

      {/* Score Graph */}
      {recent.length >= 2 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LAST 7 DAYS</Text>
          <View style={styles.miniGraph}>
            {recent.map((e, i) => (
              <View key={i} style={styles.barWrapper}>
                <View style={[styles.bar, {
                  height: Math.max(4, ((e.score||0)/10)*70),
                  backgroundColor: (e.score||0) >= 7 ? T.green : (e.score||0) >= 5 ? T.orange : T.red
                }]} />
                <Text style={styles.barLabel}>{new Date(e.date).getDate()}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 16, paddingTop: 8 },
  appName: { color: T.text, fontSize: 26, fontWeight: '900', letterSpacing: 4 },
  date: { color: T.textSub, fontSize: 10, letterSpacing: 2, marginTop: 2 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a0000', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: T.accent },
  streakFire: { fontSize: 16 },
  streakNum: { color: T.accent, fontSize: 18, fontWeight: '900', marginLeft: 4 },

  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 4 },
  statCard: { flex: 1, backgroundColor: T.card, borderRadius: 10, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: T.border },
  statNum: { color: T.accent, fontSize: 22, fontWeight: '900' },
  statLabel: { color: T.textSub, fontSize: 8, letterSpacing: 1, marginTop: 2 },

  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { color: T.textSub, fontSize: 10, fontWeight: '800', letterSpacing: 3, marginBottom: 10 },

  flagCard: { backgroundColor: T.card, borderRadius: 8, padding: 12, marginBottom: 8, borderLeftWidth: 3 },
  flagText: { color: T.text, fontSize: 13, lineHeight: 20 },

  todayDone: { backgroundColor: T.card, borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: T.green },
  todayIcon: { color: T.green, fontSize: 24, fontWeight: '900' },
  todayDoneText: { color: T.text, fontSize: 14, fontWeight: '700' },
  wordOfDay: { color: T.textSub, fontSize: 12, marginTop: 2 },
  todayScore: { color: T.textSub, fontSize: 12, marginTop: 2 },
  draftBadge: { color: T.orange, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginTop: 4 },

  newEntryBtn: { backgroundColor: T.accent, borderRadius: 12, padding: 20, alignItems: 'center' },
  newEntryBtnText: { color: T.text, fontSize: 16, fontWeight: '900', letterSpacing: 3 },
  newEntryBtnSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },

  streakCard: { backgroundColor: T.card, borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#2a1a00' },
  streakCardIcon: { fontSize: 40, marginBottom: 8 },
  streakCardBig: { color: T.accent, fontSize: 56, fontWeight: '900' },
  streakCardText: { color: T.text, fontSize: 16, fontWeight: '800', letterSpacing: 2, marginTop: 4 },
  streakCardSub: { color: T.textSub, fontSize: 12, marginTop: 8 },

  miniGraph: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 90, backgroundColor: T.card, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: T.border },
  barWrapper: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 3, minHeight: 4 },
  barLabel: { color: T.textSub, fontSize: 9, marginTop: 4 },
});
