# BilliT Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (will be installed with dependencies)
- For Android: Android Studio or Expo Go app
- For iOS: Xcode (macOS only) or Expo Go app

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Add App Icons (Optional for Development)

Create or add the following image files in the `assets` folder:
- `icon.png` (1024x1024) - App icon
- `splash.png` (1284x2778) - Splash screen
- `adaptive-icon.png` (1024x1024) - Android adaptive icon
- `favicon.png` (48x48) - Web favicon

For quick testing, you can use placeholder images or skip this step.

### 3. Start the Development Server

```bash
npm start
```

This will open the Expo Developer Tools in your browser.

### 4. Run on Device/Emulator

#### Option A: Using Expo Go App (Easiest)
1. Install Expo Go from App Store (iOS) or Play Store (Android)
2. Scan the QR code shown in the terminal or browser
3. The app will load on your device

#### Option B: Using Emulator/Simulator
- **Android**: Press `a` in the terminal (requires Android Studio)
- **iOS**: Press `i` in the terminal (requires Xcode, macOS only)
- **Web**: Press `w` in the terminal

## Project Structure

```
BilliT/
├── App.js                      # Main app entry point
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── assets/                     # App icons and images
└── src/
    ├── navigation/
    │   └── AppNavigator.js     # Navigation setup
    ├── screens/
    │   ├── HomeScreen.js       # Home tab
    │   ├── HistoryScreen.js    # History tab
    │   ├── SettingsScreen.js   # Settings tab
    │   ├── NewBillInputScreen.js      # Create/Edit bill
    │   └── DetailedBillViewScreen.js  # View bill details
    ├── store/
    │   └── useStore.js         # Global state (Zustand)
    ├── theme/
    │   └── theme.js            # Light/Dark themes
    └── utils/
        ├── storage.js          # AsyncStorage utilities
        └── validation.js       # Input validation
```

## Features Implemented

### ✅ Core Features
- [x] Fully offline operation
- [x] AsyncStorage for data persistence
- [x] Bottom tab navigation (Home, History, Settings)
- [x] Default per-unit rate (₹7)
- [x] Dark/Light theme toggle
- [x] Input validation

### ✅ Home Tab
- [x] View Current Bill button
- [x] Calculate New Bill button

### ✅ History Tab
- [x] Scrollable list of bills (most recent first)
- [x] Tap to view detailed bill
- [x] Edit and Delete actions

### ✅ Settings Tab
- [x] Edit per-unit rate
- [x] Toggle Dark/Light theme
- [x] Clear all history (with confirmation)

### ✅ New Bill Input Screen
- [x] All required fields with validation
- [x] Date input (editable)
- [x] Total Units and Total Bill Amount
- [x] Upper Floor Previous/Current readings
- [x] Per-unit rate (prefilled from settings)
- [x] Optional note field
- [x] Calculate Bill button
- [x] Save Bill button
- [x] Edit mode support

### ✅ Detailed Bill View
- [x] Display all bill information
- [x] Edit button
- [x] Delete button (with confirmation)
- [x] Proper navigation flow

### ✅ Validation Rules
- [x] Upper Current > Upper Previous
- [x] Upper Units ≤ Total Units
- [x] All numeric fields validated
- [x] Non-negative values enforced
- [x] User-friendly error messages

### ✅ Data Model
- [x] Complete bill record structure
- [x] Unique ID (ISO timestamp)
- [x] All required fields
- [x] Calculated values stored

## Usage Guide

### Creating a New Bill

1. Go to **Home** tab
2. Tap **Calculate New Bill**
3. Fill in all required fields:
   - Date (defaults to today)
   - Total Units (from your electricity bill)
   - Total Bill Amount (from your electricity bill)
   - Upper Floor Previous Reading
   - Upper Floor Current Reading
   - Per-Unit Rate (prefilled from settings)
   - Optional note
4. Tap **Calculate Bill** to validate and see results
5. Tap **Save Bill** to store the bill

### Viewing Bills

1. Go to **Home** tab and tap **View Current Bill** for the latest bill
2. Or go to **History** tab to see all bills
3. Tap any bill to view full details

### Editing a Bill

1. Open the bill in Detailed Bill View
2. Tap **Edit Bill**
3. Modify the fields
4. Tap **Calculate Bill** then **Update Bill**

### Deleting a Bill

1. Open the bill in Detailed Bill View
2. Tap **Delete Bill**
3. Confirm deletion

### Changing Settings

1. Go to **Settings** tab
2. Toggle **Dark Theme** switch for theme change
3. Edit **Per-Unit Rate** and tap **Save Rate**
4. Tap **Clear All History** to delete all bills (with confirmation)

## Troubleshooting

### App won't start
- Make sure all dependencies are installed: `npm install`
- Clear cache: `expo start -c`

### Data not persisting
- Check AsyncStorage permissions
- Try clearing app data and restarting

### Theme not changing
- Make sure you've saved the theme toggle
- Restart the app if needed

### Validation errors
- Ensure Upper Current > Upper Previous
- Ensure Upper Units ≤ Total Units
- All numeric fields must be valid numbers

## Development Commands

```bash
# Start development server
npm start

# Start with cache cleared
expo start -c

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

## Building for Production

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

### Using EAS Build (Recommended)
```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments
3. Check Expo documentation: https://docs.expo.dev/

## License

MIT
