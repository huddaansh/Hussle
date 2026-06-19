import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { T } from '../utils/theme';

export default function TimelineScreen({ entries, onSelect }) {
  const sorted = [...entries].sort((a,b) => new Date(b.date) - new Date(a.date));

  // Group by month
  const grouped = {};
  sorted.forEach(e => {
    const d = new Date(e.date);
    const key = `${d.toLocaleString('default', { month: 'long' }).toUpperCase()} ${d.getFullYear()}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(e);
  });

  const scoreColor = (s) => s >= 7 ? T.green : s >= 5 ? T.orange : T.red;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>TIMELINE</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.keys(grouped).length === 0 ? (
          <Text style={styles.empty}>No entries yet. Start logging today.</Text>
        ) : Object.entries(grouped).map(([month, monthEntries]) => (
          <View key={month}>
            <Text style={styles.monthLabel}>{month}</Text>
            {monthEntries.map(e => (
              <TouchableOpacity key={e.id} style={styles.entryRow} onPress={() => onSelect(e)}>
                <View style={styles.dateBlock}>
                  <Text style={styles.dayNum}>{new Date(e.date).getDate()}</Text>
                  <Text style={styles.dayName}>{new Date(e.date).toLocaleString('default', { weekday: 'short' }).toUpperCase()}</Text>
                </View>
                <View style={styles.entryContent}>
                  {e.wordOfDay && <Text style={styles.wordTag}>{e.wordOfDay.toUpperCase()}</Text>}
                  <Text style={styles.preview} numberOfLines={2}>{e.text}</Text>
                  <View style={styles.entryMeta}>
                    {e.mood && <Text style={styles.metaTag}>{e.mood}</Text>}
                    {e.isDraft && <Text style={[styles.metaTag, { color: T.orange }]}>DRAFT</Text>}
                  </View>
                </View>
                <View style={styles.scoreBlock}>
                  <Text style={[styles.score, { color: scoreColor(e.score) }]}>{e.score}</Text>
                  <View style={[styles.scoreDot, { backgroundColor: scoreColor(e.score) }]} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg },
  header: { padding: 16, paddingTop: 8, borderBottomWidth: 1, borderBottomColor: T.border },
  title: { color: T.text, fontSize: 20, fontWeight: '900', letterSpacing: 4 },
  empty: { color: T.textSub, textAlign: 'center', marginTop: 60, fontSize: 14 },
  monthLabel: { color: T.textSub, fontSize: 10, fontWeight: '800', letterSpacing: 3, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8 },
  entryRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: T.border, gap: 14 },
  dateBlock: { alignItems: 'center', width: 36 },
  dayNum: { color: T.text, fontSize: 22, fontWeight: '900' },
  dayName: { color: T.textMuted, fontSize: 9, letterSpacing: 1, marginTop: 2 },
  entryContent: { flex: 1 },
  wordTag: { color: T.accent, fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 4 },
  preview: { color: T.text, fontSize: 13, lineHeight: 19 },
  entryMeta: { flexDirection: 'row', gap: 8, marginTop: 6 },
  metaTag: { color: T.textSub, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  scoreBlock: { alignItems: 'center', justifyContent: 'center', gap: 4 },
  score: { fontSize: 20, fontWeight: '900' },
  scoreDot: { width: 6, height: 6, borderRadius: 3 },
});
