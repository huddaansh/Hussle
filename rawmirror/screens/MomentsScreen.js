import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { T } from '../utils/theme';

const CATEGORIES = ['All', 'Career', 'Education', 'Personal', 'Other'];

export default function MomentsScreen({ entries, onSelect }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const moments = entries.filter(e => e.isMoment);
  const filtered = activeCategory === 'All' ? moments : moments.filter(e => e.momentCategory === activeCategory);
  const sorted = [...filtered].sort((a,b) => new Date(b.date) - new Date(a.date));

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>MOMENTS</Text>
        <Text style={styles.sub}>Your starred entries</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
        <View style={styles.catRow}>
          {CATEGORIES.map(c => (
            <TouchableOpacity key={c} style={[styles.catChip, activeCategory === c && styles.catChipActive]} onPress={() => setActiveCategory(c)}>
              <Text style={[styles.catText, activeCategory === c && { color: T.accent }]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {sorted.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>★</Text>
            <Text style={styles.emptyText}>No moments yet</Text>
            <Text style={styles.emptySub}>Open any entry and tap "Mark as Moment" to save it here.</Text>
          </View>
        ) : sorted.map(e => (
          <TouchableOpacity key={e.id} style={styles.momentCard} onPress={() => onSelect(e)}>
            <View style={styles.momentLeft}>
              <Text style={styles.momentStar}>★</Text>
            </View>
            <View style={styles.momentContent}>
              <Text style={styles.momentTitle} numberOfLines={1}>{e.text?.split('\n')[0] || e.text?.substring(0, 60)}</Text>
              <Text style={styles.momentDate}>{e.date}</Text>
              {e.momentCategory && <Text style={styles.momentCat}>{e.momentCategory}</Text>}
            </View>
            <Text style={styles.momentArrow}>›</Text>
          </TouchableOpacity>
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
  sub: { color: T.textSub, fontSize: 12, marginTop: 2 },
  catScroll: { borderBottomWidth: 1, borderBottomColor: T.border },
  catRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  catChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: T.card, borderWidth: 1, borderColor: T.border },
  catChipActive: { borderColor: T.accent },
  catText: { color: T.textSub, fontSize: 12, fontWeight: '700' },
  emptyState: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyIcon: { color: T.textMuted, fontSize: 48, marginBottom: 12 },
  emptyText: { color: T.text, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  emptySub: { color: T.textSub, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  momentCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: T.border, gap: 12 },
  momentLeft: { width: 32, alignItems: 'center' },
  momentStar: { color: T.gold, fontSize: 22 },
  momentContent: { flex: 1 },
  momentTitle: { color: T.text, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  momentDate: { color: T.textSub, fontSize: 11, letterSpacing: 1 },
  momentCat: { color: T.accent, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginTop: 2 },
  momentArrow: { color: T.textSub, fontSize: 20 },
});
