import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { T } from '../utils/theme';
import { Storage, KEYS } from '../services/storage';

export default function PINScreen({ onSuccess, isSetup }) {
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [step, setStep] = useState(isSetup ? 'set' : 'enter');
  const [error, setError] = useState('');

  const handleKey = async (k) => {
    if (k === 'del') {
      if (step === 'confirm') setConfirm(c => c.slice(0,-1));
      else setPin(p => p.slice(0,-1));
      setError('');
      return;
    }
    if (step === 'enter') {
      const np = pin + k;
      setPin(np);
      if (np.length === 4) {
        const saved = await Storage.get(KEYS.PIN);
        if (np === saved) { onSuccess(); }
        else { setError('Wrong PIN. Try again.'); setPin(''); }
      }
    } else if (step === 'set') {
      const np = pin + k;
      setPin(np);
      if (np.length === 4) setStep('confirm');
    } else if (step === 'confirm') {
      const nc = confirm + k;
      setConfirm(nc);
      if (nc.length === 4) {
        if (nc === pin) { await Storage.set(KEYS.PIN, pin); onSuccess(); }
        else { setError('PINs do not match. Start again.'); setPin(''); setConfirm(''); setStep('set'); }
      }
    }
  };

  const display = step === 'confirm' ? confirm : pin;

  return (
    <View style={styles.screen}>
      <Text style={styles.appName}>HUSSLE</Text>
      <Text style={styles.title}>{isSetup ? (step === 'set' ? 'SET YOUR PIN' : 'CONFIRM PIN') : 'ENTER PIN'}</Text>
      <Text style={styles.sub}>{isSetup ? 'Choose a 4-digit PIN to protect your journal' : 'Your journal is locked'}</Text>
      <View style={styles.dots}>
        {[0,1,2,3].map(i => (
          <View key={i} style={[styles.dot, display.length > i && styles.dotFilled]} />
        ))}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : <Text style={styles.error}> </Text>}
      <View style={styles.grid}>
        {['1','2','3','4','5','6','7','8','9','','0','del'].map((k, i) => (
          <TouchableOpacity key={i} style={[styles.key, k === '' && { opacity: 0 }]} onPress={() => k && handleKey(k)} disabled={k === ''}>
            <Text style={styles.keyText}>{k === 'del' ? '⌫' : k}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center', padding: 24 },
  appName: { color: T.accent, fontSize: 32, fontWeight: '900', letterSpacing: 8, marginBottom: 24 },
  title: { color: T.text, fontSize: 22, fontWeight: '900', letterSpacing: 4, marginBottom: 8 },
  sub: { color: T.textSub, fontSize: 13, marginBottom: 40, textAlign: 'center' },
  dots: { flexDirection: 'row', gap: 20, marginBottom: 12 },
  dot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: T.textSub },
  dotFilled: { backgroundColor: T.accent, borderColor: T.accent },
  error: { color: T.red, fontSize: 13, marginBottom: 16, height: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', width: 240, gap: 12, marginTop: 16 },
  key: { width: 68, height: 68, borderRadius: 34, backgroundColor: T.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: T.border },
  keyText: { color: T.text, fontSize: 24, fontWeight: '700' },
});
