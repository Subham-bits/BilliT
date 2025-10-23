# BilliT - Electricity Bill Splitter

A fully offline React Native (Expo) mobile app for splitting electricity bills between floors.

## Features

- 📱 **Fully Offline** - No backend required, all data stored locally
- 💾 **Persistent Storage** - Uses AsyncStorage for data persistence
- 🌓 **Dark/Light Theme** - Toggle between themes with persistence
- 📊 **Bill History** - View, edit, and delete past bills
- ✅ **Smart Validation** - Prevents incorrect readings and impossible values
- 💰 **Customizable Rate** - Edit per-unit rate (default ₹7)

## Installation

```bash
# Install dependencies
npm install

# Start the app
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Usage

### Home Tab
- **View Current Bill** - Opens the most recent saved bill
- **Calculate New Bill** - Create a new bill entry

### History Tab
- View all saved bills (most recent first)
- Tap any entry to view details
- Edit or delete bills from detail view

### Settings Tab
- Edit per-unit rate (default ₹7)
- Toggle Dark/Light theme
- Clear all history (with confirmation)

## Data Model

Each bill record contains:
- Date
- Total Units (from electricity bill)
- Total Bill Amount
- Upper Floor Previous/Current Readings
- Calculated Upper/Ground Units
- Per-Unit Rate
- Calculated Ground Floor Bill
- Optional Notes

## Tech Stack

- **Framework**: Expo (React Native)
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **Storage**: AsyncStorage
- **State Management**: Zustand
- **UI Library**: React Native Paper
- **Date Handling**: date-fns

## License

MIT
