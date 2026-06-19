# HUSSLE v2 — Proper Structure Update

## What changed
Your app is now split into proper files instead of one giant App.js. This makes it stable and easy to add more features later.

```
hussle/
├── App.js                      (main file, connects everything)
├── app.json
├── package.json
├── babel.config.js
├── screens/
│   ├── PINScreen.js
│   ├── HomeScreen.js
│   ├── JournalScreen.js        (write + auto-save draft)
│   ├── TimelineScreen.js       (NEW)
│   ├── MomentsScreen.js        (NEW)
│   ├── SearchScreen.js         (NEW)
│   ├── TrendsScreen.js         (NEW - graphs + heatmap)
│   ├── SettingsScreen.js
│   └── EntryResultScreen.js
├── components/
│   └── BottomNav.js            (NEW - 5 tab bottom bar)
├── services/
│   ├── ai.js                   (Claude/ChatGPT/Groq/Gemini)
│   └── storage.js
└── utils/
    ├── theme.js
    └── algo.js
```

## How to install — IMPORTANT

**Do NOT just paste files into your old folder.** This is a full replacement.

### Step 1 — Backup your data first
Open old Hussle app → Settings → Export Backup → copy that JSON somewhere safe (Notepad, save it).

### Step 2 — Replace project folder
1. Delete everything inside `C:\Users\hudda\Downloads\hussle-app\rawmirror` EXCEPT `node_modules` folder
2. Copy all new files/folders from this zip into that same location
3. Folder structure should look like the tree above (with node_modules still there)

### Step 3 — Install any new dependencies
```
cd C:\Users\hudda\Downloads\hussle-app\rawmirror
npm install
```

### Step 4 — Start fresh
```
npx expo start --clear
```

### Step 5 — Scan QR with Expo Go

## New Features Added
- ✅ Bottom navigation: Home, Journal, Timeline, Moments, Settings
- ✅ Timeline screen — grouped by month, tap to open
- ✅ Streak card on Home — fire icon, current + best streak
- ✅ Trends screen — Score/Mood/Honesty graphs with 7D/30D/90D/1Y toggle
- ✅ Heatmap — 6 month GitHub-style contribution grid (inside Trends tab)
- ✅ Search screen — keyword search with highlighting
- ✅ Moments — star/bookmark entries with category (Career/Education/Personal/Other)
- ✅ Draft auto-save — writes save every 10 seconds, editable anytime, "SAVE DRAFT" button + "SUBMIT & EVALUATE" button
- ✅ Groq (Free) AI provider added

## Where to find new screens
- **Search & Trends** are accessed from Settings tab → tap "🔍 SEARCH ENTRIES" or "📊 TRENDS & HEATMAP"
- **Timeline & Moments** have their own bottom tab

## Note on data migration
Your old entries are stored under the same AsyncStorage key (`rm_entries`), so they will carry over automatically — no manual import needed, as long as you don't clear app data.

## If something breaks
Press `r` in Expo terminal to reload. If still broken, stop with Ctrl+C and run:
```
npx expo start --clear
```
