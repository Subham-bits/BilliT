# BilliT - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the App
```bash
npm start
```

### 3. Run on Your Device
- **Easiest**: Install "Expo Go" app on your phone and scan the QR code
- **Android Emulator**: Press `a` in terminal
- **iOS Simulator**: Press `i` in terminal (macOS only)
- **Web Browser**: Press `w` in terminal

## 📱 First Time Usage

1. **Home Tab** - Start here
   - Tap "Calculate New Bill" to create your first bill

2. **Fill the Form**
   - Enter the date
   - Enter total units from your electricity bill
   - Enter total bill amount
   - Enter upper floor meter readings (previous and current)
   - The per-unit rate is pre-filled (default ₹7)

3. **Calculate & Save**
   - Tap "Calculate Bill" to see the breakdown
   - Tap "Save Bill" to store it

4. **View Your Bills**
   - Go to "History" tab to see all saved bills
   - Tap any bill to view details, edit, or delete

5. **Customize Settings**
   - Go to "Settings" tab
   - Change the per-unit rate if needed
   - Toggle between Light and Dark theme

## ✨ Key Features

- **Fully Offline** - No internet required
- **Smart Validation** - Prevents incorrect entries
- **Auto-Calculate** - Automatically splits the bill
- **Dark Mode** - Easy on the eyes
- **Edit & Delete** - Full control over your data

## 🎯 What Gets Calculated

The app calculates:
- **Upper Floor Units** = Current Reading - Previous Reading
- **Ground Floor Units** = Total Units - Upper Floor Units
- **Ground Floor Bill** = Ground Floor Units × Per-Unit Rate

## 💡 Tips

- The "View Current Bill" button shows your most recent bill
- You can edit any bill by opening it and tapping "Edit"
- Change the default rate in Settings to avoid editing it every time
- Use the note field to add context (e.g., "October 2025")

## 🆘 Need Help?

Check `SETUP.md` for detailed documentation and troubleshooting.

---

**Happy Billing! 💰⚡**
