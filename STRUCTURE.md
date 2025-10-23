# BilliT - Project Structure

```
BilliT/
│
├── 📱 App.js                          # Main app entry point with theme provider
│
├── ⚙️ Configuration Files
│   ├── package.json                   # Dependencies and scripts
│   ├── app.json                       # Expo configuration
│   ├── babel.config.js                # Babel configuration
│   └── .gitignore                     # Git ignore rules
│
├── 📚 Documentation
│   ├── README.md                      # Project overview
│   ├── QUICKSTART.md                  # Quick start guide (3 steps)
│   ├── SETUP.md                       # Detailed setup and usage
│   ├── FEATURES.md                    # Complete feature checklist
│   ├── PROJECT_SUMMARY.md             # Project summary and achievements
│   └── STRUCTURE.md                   # This file
│
├── 🎨 assets/
│   └── .gitkeep                       # Placeholder for app icons
│
└── 📂 src/
    │
    ├── 🧭 navigation/
    │   └── AppNavigator.js            # Navigation setup
    │       ├── Bottom Tabs (Home, History, Settings)
    │       └── Stack Navigation for sub-screens
    │
    ├── 📱 screens/
    │   ├── HomeScreen.js              # Home tab
    │   │   ├── View Current Bill button
    │   │   └── Calculate New Bill button
    │   │
    │   ├── HistoryScreen.js           # History tab
    │   │   ├── Scrollable bill list
    │   │   ├── Tap to view details
    │   │   └── Empty state
    │   │
    │   ├── SettingsScreen.js          # Settings tab
    │   │   ├── Edit per-unit rate
    │   │   ├── Toggle theme
    │   │   └── Clear all history
    │   │
    │   ├── NewBillInputScreen.js      # Create/Edit bill
    │   │   ├── All input fields
    │   │   ├── Validation logic
    │   │   ├── Calculate button
    │   │   ├── Save button
    │   │   └── Edit mode support
    │   │
    │   └── DetailedBillViewScreen.js  # View bill details
    │       ├── Display all information
    │       ├── Edit button
    │       └── Delete button
    │
    ├── 🗄️ store/
    │   └── useStore.js                # Zustand global state
    │       ├── Theme state
    │       ├── Rate state
    │       ├── Bills array
    │       ├── Loading state
    │       └── State management functions
    │
    ├── 🎨 theme/
    │   └── theme.js                   # Theme definitions
    │       ├── Light theme
    │       └── Dark theme
    │
    └── 🛠️ utils/
        ├── storage.js                 # AsyncStorage utilities
        │   ├── Bill CRUD operations
        │   │   ├── getAllBills()
        │   │   ├── getLatestBill()
        │   │   ├── getBillById()
        │   │   ├── saveBill()
        │   │   ├── updateBill()
        │   │   ├── deleteBill()
        │   │   └── clearAllBills()
        │   │
        │   └── Settings operations
        │       ├── getSettings()
        │       ├── saveSettings()
        │       └── updateSettings()
        │
        └── validation.js              # Input validation
            ├── validateBillInput()
            └── calculateBill()
```

## 📊 File Breakdown

### Core Application (1 file)
- `App.js` - Main entry point, theme provider, app initialization

### Configuration (4 files)
- `package.json` - Dependencies and npm scripts
- `app.json` - Expo configuration
- `babel.config.js` - Babel transpiler config
- `.gitignore` - Git ignore patterns

### Documentation (6 files)
- `README.md` - Project overview
- `QUICKSTART.md` - Quick start guide
- `SETUP.md` - Comprehensive setup guide
- `FEATURES.md` - Feature checklist
- `PROJECT_SUMMARY.md` - Project summary
- `STRUCTURE.md` - This file

### Source Code (11 files)

#### Navigation (1 file)
- `AppNavigator.js` - Complete navigation structure

#### Screens (5 files)
- `HomeScreen.js` - Home tab with main actions
- `HistoryScreen.js` - Bill history list
- `SettingsScreen.js` - App settings
- `NewBillInputScreen.js` - Create/edit bill form
- `DetailedBillViewScreen.js` - Bill details view

#### State Management (1 file)
- `useStore.js` - Zustand global state store

#### Theming (1 file)
- `theme.js` - Light and dark theme definitions

#### Utilities (2 files)
- `storage.js` - AsyncStorage operations
- `validation.js` - Input validation logic

#### Assets (1 folder)
- `assets/` - Placeholder for app icons and images

## 🔄 Data Flow

```
User Action
    ↓
Screen Component
    ↓
Validation (if input)
    ↓
Storage Utility
    ↓
AsyncStorage
    ↓
Zustand Store (state update)
    ↓
UI Update (re-render)
```

## 🎯 Navigation Flow

```
App Start
    ↓
Bottom Tabs
    ├── Home Tab
    │   ├── HomeScreen
    │   ├── → NewBillInput
    │   └── → DetailedBillView
    │
    ├── History Tab
    │   ├── HistoryScreen
    │   ├── → DetailedBillView
    │   └── → NewBillInput (edit mode)
    │
    └── Settings Tab
        └── SettingsScreen
```

## 📦 Dependencies

### Production Dependencies
- `expo` - Expo framework
- `react` - React library
- `react-native` - React Native framework
- `react-native-paper` - Material Design components
- `@react-navigation/native` - Navigation core
- `@react-navigation/bottom-tabs` - Bottom tab navigator
- `@react-navigation/native-stack` - Stack navigator
- `react-native-safe-area-context` - Safe area handling
- `react-native-screens` - Native screen optimization
- `@react-native-async-storage/async-storage` - Local storage
- `zustand` - State management
- `date-fns` - Date formatting
- `expo-status-bar` - Status bar component

### Dev Dependencies
- `@babel/core` - Babel compiler

## 🎨 Component Hierarchy

```
<App>
  <PaperProvider theme={currentTheme}>
    <SafeAreaProvider>
      <NavigationContainer>
        <BottomTabs>
          <HomeStack>
            <HomeScreen />
            <NewBillInputScreen />
            <DetailedBillViewScreen />
          </HomeStack>
          
          <HistoryStack>
            <HistoryScreen />
            <DetailedBillViewScreen />
            <NewBillInputScreen />
          </HistoryStack>
          
          <SettingsStack>
            <SettingsScreen />
          </SettingsStack>
        </BottomTabs>
      </NavigationContainer>
    </SafeAreaProvider>
  </PaperProvider>
</App>
```

## 💾 Storage Keys

- `@ebs_bills` - Array of bill objects
- `@ebs_settings` - Settings object (rate, theme)

## 🎨 Theme Structure

```javascript
Theme {
  dark: boolean,
  colors: {
    primary: string,
    secondary: string,
    background: string,
    surface: string,
    text: string,
    error: string,
    // ... more colors
  }
}
```

## 📝 Bill Object Structure

```javascript
Bill {
  id: string,              // ISO timestamp
  date: string,            // YYYY-MM-DD
  totalUnits: number,      // From electricity bill
  totalBillAmount: number, // From electricity bill
  upperPrev: number,       // User input
  upperCurr: number,       // User input
  upperUnits: number,      // Calculated
  groundUnits: number,     // Calculated
  rate: number,            // Per-unit rate
  groundBill: number,      // Calculated
  note: string,            // Optional
  createdAt: string        // ISO timestamp
}
```

## 🔧 Utility Functions

### Storage Utils (11 functions)
- Bill operations: 7 functions
- Settings operations: 4 functions

### Validation Utils (2 functions)
- Input validation
- Bill calculation

## 📱 Screen Count

- **Total Screens**: 5
- **Tab Screens**: 3 (Home, History, Settings)
- **Modal Screens**: 2 (NewBillInput, DetailedBillView)

## 🎯 Total Files

- **Configuration**: 4 files
- **Documentation**: 6 files
- **Source Code**: 11 files
- **Total**: 21 files

---

**Clean, organized, and production-ready! 🚀**
