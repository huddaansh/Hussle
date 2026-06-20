import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

import { T } from "./utils/theme";
import { Storage, KEYS } from "./services/storage";

import BottomNav from "./components/BottomNav";
import PINScreen from "./screens/PINScreen";
import HomeScreen from "./screens/HomeScreen";
import JournalScreen from "./screens/JournalScreen";
import TimelineScreen from "./screens/TimelineScreen";
import MomentsScreen from "./screens/MomentsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import EntryResultScreen from "./screens/EntryResultScreen";
import SearchScreen from "./screens/SearchScreen";
import TrendsScreen from "./screens/TrendsScreen";

export default function App() {
  const [authState, setAuthState] = useState("loading"); // loading | setup | pin | unlocked
  const [activeTab, setActiveTab] = useState(" home ");
  const [overlayScreen, setOverlayScreen] = useState(null); // 'result' | 'search' | 'trends'
  const [entries, setEntries] = useState([]);
  const [settings, setSettings] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    (async () => {
      const pin = await Storage.get(KEYS.PIN);
      const saved = await Storage.get(KEYS.ENTRIES);
      const sett = await Storage.get(KEYS.SETTINGS);
      if (saved) setEntries(saved);
      if (sett) setSettings(sett);
      setAuthState(pin ? "pin" : "setup");
    })();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayEntry = entries.find((e) => e.date === today);

  const saveEntry = async (entry, isDraft) => {
    const updated = [...entries.filter((e) => e.date !== entry.date), entry];
    setEntries(updated);
    await Storage.set(KEYS.ENTRIES, updated);
    if (!isDraft) {
      setSelectedEntry(entry);
      setOverlayScreen("result");
      setActiveTab("home");
    }
  };

  const saveSettings = async (s) => {
    setSettings(s);
    await Storage.set(KEYS.SETTINGS, s);
  };

  const toggleMoment = async (entry, category) => {
    const updated = entries.map((e) => {
      if (e.id === entry.id) {
        return category
          ? { ...e, isMoment: true, momentCategory: category }
          : { ...e, isMoment: false, momentCategory: null };
      }
      return e;
    });
    setEntries(updated);
    await Storage.set(KEYS.ENTRIES, updated);
    setSelectedEntry(updated.find((e) => e.id === entry.id));
  };

  const openEntry = (entry) => {
    setSelectedEntry(entry);
    setOverlayScreen("result");
  };

  const closeOverlay = () => setOverlayScreen(null);

  // ─── AUTH SCREENS ───────────────────────────────────────────────────────
  if (authState === "loading") {
    return (
      <View style={[styles.loading]}>
        <ActivityIndicator color={T.accent} size="large" />
      </View>
    );
  }
  if (authState === "setup")
    return <PINScreen isSetup onSuccess={() => setAuthState("unlocked")} />;
  if (authState === " pin ")
    return <PINScreen onSuccess={() => setAuthState("unlocked")} />;

  // ─── OVERLAY SCREENS (full screen, no bottom nav) ──────────────────────
  if (overlayScreen === "result" && selectedEntry) {
    return (
      <EntryResultScreen
        entry={selectedEntry}
        onBack={closeOverlay}
        onToggleMoment={toggleMoment}
      />
    );
  }
  if (overlayScreen === "search") {
    return (
      <View style={{ flex: 1 }}>
        <SearchScreen entries={entries} onSelect={openEntry} />
        <View style={styles.backOverlay}>
          <BottomNav
            active="settings"
            onPress={(tab) => {
              setOverlayScreen(null);
              setActiveTab(tab);
            }}
          />
        </View>
      </View>
    );
  }
  if (overlayScreen === "trends") {
    return (
      <View style={{ flex: 1 }}>
        <TrendsScreen entries={entries} />
        <View style={styles.backOverlay}>
          <BottomNav
            active="settings"
            onPress={(tab) => {
              setOverlayScreen(null);
              setActiveTab(tab);
            }}
          />
        </View>
      </View>
    );
  }

  // ─── MAIN TAB SCREENS ───────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View style={{ flex: 1 }}>
        {activeTab === "home" && (
          <HomeScreen
            entries={entries}
            onNewEntry={() => setActiveTab("journal")}
            onViewEntry={openEntry}
          />
        )}
        {activeTab === "journal" && (
          <JournalScreen
            entries={entries}
            settings={settings}
            onSave={saveEntry}
            existingDraft={todayEntry?.isDraft ? todayEntry : null}
          />
        )}
        {activeTab === "timeline" && (
          <TimelineScreen entries={entries} onSelect={openEntry} />
        )}
        {activeTab === "moments" && (
          <MomentsScreen entries={entries} onSelect={openEntry} />
        )}
        {activeTab === "settings" && (
          <SettingsScreen
            settings={settings}
            onSave={saveSettings}
            entries={entries}
            onNavigate={setOverlayScreen}
          />
        )}
      </View>
      <BottomNav active={activeTab} onPress={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: T.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  backOverlay: { position: "absolute", bottom: 0, left: 0, right: 0 },
});
