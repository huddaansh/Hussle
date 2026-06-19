import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { T } from '../utils/theme';

const TABS = [
  { key: 'home', label: 'Home', icon: '⌂' },
  { key: 'journal', label: 'Journal', icon: '✎' },
  { key: 'timeline', label: 'Timeline', icon: '☰' },
  { key: 'moments', label: 'Moments', icon: '★' },
  { key: 'settings', label: 'Settings', icon: '⚙' },
];

export default function BottomNav({ active, onPress }) {
  return (
    <View style={styles.container}>
      {TABS.map(tab => (
        <TouchableOpacity key={tab.key} style={styles.tab} onPress={() => onPress(tab.key)}>
          <Text style={[styles.icon, active === tab.key && styles.activeIcon]}>{tab.icon}</Text>
          <Text style={[styles.label, active === tab.key && styles.activeLabel]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: T.card,
    borderTopWidth: 1,
    borderTopColor: T.border,
    paddingBottom: Platform.OS === 'android' ? 8 : 24,
    paddingTop: 10,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  icon: { fontSize: 20, color: T.textMuted },
  activeIcon: { color: T.accent },
  label: { fontSize: 9, fontWeight: '700', letterSpacing: 1, color: T.textMuted },
  activeLabel: { color: T.accent },
});
