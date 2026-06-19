import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { T } from '../utils/theme';
import { Algo } from '../utils/algo';

const { width } = Dimensions.get('window');

// ─── HEATMAP ─────────────────────────────────────────────────────────────────
function Heatmap({ entries }) {
  const entryMap = {};
  entries.forEach(e => { entryMap[e.date] = e.score || 0; });

  const today = new Date();
  const days = [];
  for (let i = 181; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({ date: dateStr, score: entryMap[dateStr] || 0, day: d.getDay() });
  }

  // Pad start to Sunday
  const firstDay = days[0].day;
  const padded = [...Array(firstDay).fill(null), ...days];
  const weeks = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));

  const cellColor = (score) => {
    if (!score) return '#1a1a1a';
    if (score <= 3) return '#4a0000';
    if (score <= 6) return '#aa2200';
    return T.accent;
  };

  const DAYS = ['S','M','T','W','T','F','S'];
  const cellSize = Math.floor((width - 48) / weeks.length) - 2;

  return (
    <View>
      <View style={styles.heatmapDayRow}>
        {DAYS.map((d, i) => <Text key={i} style={styles.heatmapDayLabel}>{d}</Text>)}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.heatmapGrid}>
          {weeks.map((week, wi) => (
            <View key={wi} style={styles.heatmapCol}>
              {week.map((day, di) => (
                <View key={di} style={[
                  styles.heatmapCell,
                  { backgroundColor: day ? cellColor(day.score) : 'transparent', width: cellSize, height: cellSize }
                ]} />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.heatmapLegend}>
        <Text style={styles.legendLabel}>Less</Text>
        {['#1a1a1a','#4a0000','#aa2200',T.accent].map((c,i) => (
          <View key={i} style={[styles.legendCell, { backgroundColor: c }]} />
        ))}
        <Text style={styles.legendLabel}>More</Text>
      </View>
    </View>
  );
}

// ─── TREND GRAPH ─────────────────────────────────────────────────────────────
function TrendGraph({ data, color, label, maxVal = 10 }) {
  if (data.length < 2) return (
    <View style={styles.emptyGraph}>
      <Text style={styles.emptyGraphText}>Not enough data yet</Text>
    </View>
  );

  const graphWidth = width - 64;
  const graphHeight = 80;
  const avg = (data.reduce((a,b) => a+b, 0) / data.length).toFixed(1);
  const max = Math.max(...data, 1);

  return (
    <View style={styles.graphCard}>
      <View style={styles.graphHeader}>
        <Text style={styles.graphLabel}>{label}</Text>
        <Text style={[styles.graphAvg, { color }]}>AVG {avg}</Text>
      </View>
      <View style={[styles.graphArea, { height: graphHeight }]}>
        {data.map((val, i) => {
          const x = (i / (data.length - 1)) * graphWidth;
          const y = graphHeight - (val / maxVal) * graphHeight;
          return (
            <View key={i} style={[styles.graphDot, { left: x - 3, top: y - 3, backgroundColor: color }]} />
          );
        })}
        {data.slice(1).map((val, i) => {
          const x1 = (i / (data.length - 1)) * graphWidth;
          const y1 = graphHeight - (data[i] / maxVal) * graphHeight;
          const x2 = ((i + 1) / (data.length - 1)) * graphWidth;
          const y2 = graphHeight - (val / maxVal) * graphHeight;
          const lineWidth = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
          const angle = Math.atan2(y2-y1, x2-x1) * 180 / Math.PI;
          return (
            <View key={i} style={[styles.graphLine, {
              left: x1, top: y1,
              width: lineWidth,
              transform: [{ rotate: `${angle}deg` }],
              backgroundColor: color,
            }]} />
          );
        })}
      </View>
    </View>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
export default function TrendsScreen({ entries }) {
  const [range, setRange] = useState('30D');
  const [tab, setTab] = useState('graphs');

  const ranges = { '7D': 7, '30D': 30, '90D': 90, '1Y': 365 };
  const days = ranges[range];
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - days);
  const filtered = entries
    .filter(e => new Date(e.date) >= cutoff)
    .sort((a,b) => new Date(a.date) - new Date(b.date));

  const scores = filtered.map(e => e.score || 0);
  const honesty = filtered.map(e => e.honestyScore || 0);
  const moods = filtered.map(e => Algo.moodToScore(e.mood));

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>TRENDS</Text>
        <View style={styles.tabRow}>
          <TouchableOpacity style={[styles.tabBtn, tab === 'graphs' && styles.tabBtnActive]} onPress={() => setTab('graphs')}>
            <Text style={[styles.tabBtnText, tab === 'graphs' && { color: T.accent }]}>GRAPHS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabBtn, tab === 'heatmap' && styles.tabBtnActive]} onPress={() => setTab('heatmap')}>
            <Text style={[styles.tabBtnText, tab === 'heatmap' && { color: T.accent }]}>HEATMAP</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {tab === 'graphs' ? (
          <View>
            <View style={styles.rangeRow}>
              {Object.keys(ranges).map(r => (
                <TouchableOpacity key={r} style={[styles.rangeBtn, range === r && styles.rangeBtnActive]} onPress={() => setRange(r)}>
                  <Text style={[styles.rangeBtnText, range === r && { color: T.accent }]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.section}>
              <TrendGraph data={scores} color={T.text} label="SCORE" />
            </View>
            <View style={styles.section}>
              <TrendGraph data={moods} color={T.gold} label="MOOD" />
            </View>
            <View style={styles.section}>
              <TrendGraph data={honesty} color={T.green} label="HONESTY" />
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LAST 6 MONTHS</Text>
            <Heatmap entries={entries} />
          </View>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg },
  header: { padding: 16, paddingTop: 8, borderBottomWidth: 1, borderBottomColor: T.border },
  title: { color: T.text, fontSize: 20, fontWeight: '900', letterSpacing: 4, marginBottom: 12 },
  tabRow: { flexDirection: 'row', gap: 8 },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: T.card, borderWidth: 1, borderColor: T.border },
  tabBtnActive: { borderColor: T.accent },
  tabBtnText: { color: T.textSub, fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  rangeRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 16 },
  rangeBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: T.card, borderWidth: 1, borderColor: T.border },
  rangeBtnActive: { borderColor: T.accent },
  rangeBtnText: { color: T.textSub, fontSize: 11, fontWeight: '700' },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { color: T.textSub, fontSize: 10, fontWeight: '800', letterSpacing: 3, marginBottom: 12 },

  // Graph
  graphCard: { backgroundColor: T.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: T.border, marginBottom: 12 },
  graphHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  graphLabel: { color: T.textSub, fontSize: 10, fontWeight: '800', letterSpacing: 3 },
  graphAvg: { fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  graphArea: { position: 'relative' },
  graphDot: { position: 'absolute', width: 6, height: 6, borderRadius: 3 },
  graphLine: { position: 'absolute', height: 1.5, transformOrigin: 'left center' },
  emptyGraph: { backgroundColor: T.card, borderRadius: 12, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: T.border, marginBottom: 12 },
  emptyGraphText: { color: T.textMuted, fontSize: 13 },

  // Heatmap
  heatmapDayRow: { flexDirection: 'column', position: 'absolute', left: 0 },
  heatmapDayLabel: { color: T.textMuted, fontSize: 8, height: 12, marginBottom: 2 },
  heatmapGrid: { flexDirection: 'row', gap: 2 },
  heatmapCol: { flexDirection: 'column', gap: 2 },
  heatmapCell: { borderRadius: 2 },
  heatmapLegend: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  legendLabel: { color: T.textMuted, fontSize: 10 },
  legendCell: { width: 10, height: 10, borderRadius: 2 },
});
