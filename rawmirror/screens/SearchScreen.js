import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { T } from '../utils/theme';

export default function SearchScreen({ entries, onSelect }) {
  const [query, setQuery] = useState('');

  const results = query.trim().length < 2 ? [] : entries.filter(e => {
    const q = query.toLowerCase();
    return (
      e.text?.toLowerCase().includes(q) ||
      e.mood?.toLowerCase().includes(q) ||
      e.wordOfDay?.toLowerCase().includes(q) ||
      e.date?.includes(q)
    );
  }).sort((a,b) => new Date(b.date) - new Date(a.date));

  const highlight = (text, q) => {
    if (!q || !text) return <Text style={styles.previewText}>{text}</Text>;
    const parts = text.split(new RegExp(`(${q})`, 'gi'));
    return (
      <Text style={styles.previewText}>
        {parts.map((p, i) =>
          p.toLowerCase() === q.toLowerCase()
            ? <Text key={i} style={styles.highlight}>{p}</Text>
            : p
        )}
      </Text>
    );
  };

  const scoreColor = (s) => s >= 7 ? T.green : s >= 5 ? T.orange : T.red;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>SEARCH</Text>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search entries, moods, keywords..."
            placeholderTextColor={T.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        {query.trim().length >= 2 && (
          <Text style={styles.resultCount}>{results.length} result{results.length !== 1 ? 's' : ''} found</Text>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {query.trim().length < 2 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>Search your past entries</Text>
            <Text style={styles.emptySub}>Find entries by keyword, mood, or date</Text>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No results for "{query}"</Text>
          </View>
        ) : results.map(e => (
          <TouchableOpacity key={e.id} style={styles.resultCard} onPress={() => onSelect(e)}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultDate}>{e.date}</Text>
              <View style={styles.resultRight}>
                {e.mood && <Text style={styles.resultMood}>{e.mood}</Text>}
                <Text style={[styles.resultScore, { color: scoreColor(e.score) }]}>{e.score}/10</Text>
              </View>
            </View>
            {e.wordOfDay && <Text style={styles.resultWord}>{e.wordOfDay.toUpperCase()}</Text>}
            <View style={styles.previewBox} numberOfLines={3}>
              {highlight(e.text?.substring(0, 150), query)}
            </View>
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
  title: { color: T.text, fontSize: 20, fontWeight: '900', letterSpacing: 4, marginBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: T.card, borderRadius: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: T.border, gap: 8 },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, color: T.text, fontSize: 15, paddingVertical: 12 },
  clearBtn: { color: T.textSub, fontSize: 16, padding: 4 },
  resultCount: { color: T.textSub, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginTop: 8 },
  emptyState: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { color: T.text, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  emptySub: { color: T.textSub, fontSize: 13, textAlign: 'center' },
  resultCard: { marginHorizontal: 16, marginTop: 12, backgroundColor: T.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: T.border },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  resultDate: { color: T.textSub, fontSize: 11, letterSpacing: 1 },
  resultRight: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  resultMood: { color: T.textSub, fontSize: 10, fontWeight: '700' },
  resultScore: { fontSize: 13, fontWeight: '900' },
  resultWord: { color: T.accent, fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 6 },
  previewBox: { },
  previewText: { color: T.textSub, fontSize: 13, lineHeight: 20 },
  highlight: { color: T.accent, fontWeight: '800', backgroundColor: '#2a0000' },
});
