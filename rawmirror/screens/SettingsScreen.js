import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { T } from '../utils/theme';
import { AI_PROVIDERS } from '../services/ai';

export default function SettingsScreen({ settings, onSave, entries, onNavigate }) {
  const [s, setS] = useState(settings || { aiProvider: 'groq', apiKeys: {} });
  const [showKey, setShowKey] = useState({});

  const updateKey = (provider, key) => setS(prev => ({ ...prev, apiKeys: { ...prev.apiKeys, [provider]: key } }));

  const exportData = () => {
    const data = JSON.stringify({ entries, settings: s, exportedAt: new Date().toISOString() });
    Alert.alert(
      'Export Data',
      `${entries.length} entries ready to export.\n\nData size: ${(data.length / 1024).toFixed(1)} KB\n\nCopy this JSON and save it to Google Drive or any note app for backup.`,
      [{ text: 'OK' }]
    );
  };

  const save = () => {
    onSave(s);
    Alert.alert('Saved', 'Settings updated successfully.');
  };

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>SETTINGS</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI PROVIDER</Text>
        {Object.entries(AI_PROVIDERS).map(([key, p]) => (
          <TouchableOpacity key={key} style={[styles.providerCard, s.aiProvider === key && styles.providerCardActive]} onPress={() => setS(prev => ({ ...prev, aiProvider: key }))}>
            <Text style={[styles.providerName, s.aiProvider === key && { color: T.accent }]}>{p.name}</Text>
            {s.aiProvider === key && <Text style={styles.providerActive}>ACTIVE</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API KEYS</Text>
        <Text style={styles.hint}>Keys are stored only on your device. Never shared.</Text>
        {Object.entries(AI_PROVIDERS).map(([key, p]) => (
          <View key={key} style={styles.apiKeyRow}>
            <Text style={styles.apiKeyLabel}>{p.name}</Text>
            <View style={styles.apiKeyInputRow}>
              <TextInput
                style={styles.apiKeyInput}
                placeholder={`Enter ${p.name} API key`}
                placeholderTextColor={T.textMuted}
                value={s.apiKeys?.[key] || ''}
                onChangeText={(v) => updateKey(key, v)}
                secureTextEntry={!showKey[key]}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowKey(prev => ({ ...prev, [key]: !prev[key] }))}>
                <Text style={styles.showKeyBtn}>{showKey[key] ? 'HIDE' : 'SHOW'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DATA</Text>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('search')}>
          <Text style={styles.actionBtnText}>🔍 SEARCH ENTRIES</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('trends')}>
          <Text style={styles.actionBtnText}>📊 TRENDS & HEATMAP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dangerBtn} onPress={exportData}>
          <Text style={styles.dangerBtnText}>EXPORT BACKUP</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={save}>
        <Text style={styles.saveBtnText}>SAVE SETTINGS</Text>
      </TouchableOpacity>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg },
  header: { padding: 16, paddingTop: 8, borderBottomWidth: 1, borderBottomColor: T.border },
  title: { color: T.text, fontSize: 20, fontWeight: '900', letterSpacing: 4 },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { color: T.textSub, fontSize: 10, fontWeight: '800', letterSpacing: 3, marginBottom: 12 },
  hint: { color: T.textMuted, fontSize: 11, marginBottom: 12 },

  providerCard: { backgroundColor: T.card, borderRadius: 10, padding: 14, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: T.border },
  providerCardActive: { borderColor: T.accent },
  providerName: { color: T.text, fontSize: 14, fontWeight: '700' },
  providerActive: { color: T.accent, fontSize: 9, fontWeight: '800', letterSpacing: 2 },

  apiKeyRow: { marginBottom: 14 },
  apiKeyLabel: { color: T.textSub, fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 6 },
  apiKeyInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  apiKeyInput: { flex: 1, backgroundColor: T.card, borderRadius: 8, padding: 12, color: T.text, fontSize: 12, borderWidth: 1, borderColor: T.border },
  showKeyBtn: { color: T.accent, fontSize: 10, fontWeight: '700', letterSpacing: 1 },

  actionBtn: { backgroundColor: T.card, borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: T.border, marginBottom: 8 },
  actionBtnText: { color: T.text, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  dangerBtn: { backgroundColor: T.card, borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: T.border },
  dangerBtnText: { color: T.orange, fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  saveBtn: { marginHorizontal: 16, marginTop: 24, backgroundColor: T.accent, borderRadius: 12, padding: 16, alignItems: 'center' },
  saveBtnText: { color: T.text, fontSize: 14, fontWeight: '900', letterSpacing: 3 },
});
