import AsyncStorage from '@react-native-async-storage/async-storage';

const BILLS_KEY = '@ebs_bills';
const SETTINGS_KEY = '@ebs_settings';

// Default settings
const DEFAULT_SETTINGS = {
  rate: 7.0,
  theme: 'light', // 'light' or 'dark'
};

// Bill Storage Functions
export const getAllBills = async () => {
  try {
    const billsJson = await AsyncStorage.getItem(BILLS_KEY);
    if (billsJson) {
      const bills = JSON.parse(billsJson);
      // Sort by createdAt descending (most recent first)
      return bills.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return [];
  } catch (error) {
    console.error('Error getting bills:', error);
    return [];
  }
};

export const getLatestBill = async () => {
  try {
    const bills = await getAllBills();
    return bills.length > 0 ? bills[0] : null;
  } catch (error) {
    console.error('Error getting latest bill:', error);
    return null;
  }
};

export const getBillById = async (id) => {
  try {
    const bills = await getAllBills();
    return bills.find(bill => bill.id === id) || null;
  } catch (error) {
    console.error('Error getting bill by id:', error);
    return null;
  }
};

export const saveBill = async (billData) => {
  try {
    const bills = await getAllBills();
    const newBill = {
      ...billData,
      id: billData.id || new Date().toISOString(),
      createdAt: billData.createdAt || new Date().toISOString(),
    };
    bills.push(newBill);
    await AsyncStorage.setItem(BILLS_KEY, JSON.stringify(bills));
    return newBill;
  } catch (error) {
    console.error('Error saving bill:', error);
    throw error;
  }
};

export const updateBill = async (id, updatedData) => {
  try {
    const bills = await getAllBills();
    const index = bills.findIndex(bill => bill.id === id);
    if (index === -1) {
      throw new Error('Bill not found');
    }
    bills[index] = {
      ...bills[index],
      ...updatedData,
      id, // Preserve original id
    };
    await AsyncStorage.setItem(BILLS_KEY, JSON.stringify(bills));
    return bills[index];
  } catch (error) {
    console.error('Error updating bill:', error);
    throw error;
  }
};

export const deleteBill = async (id) => {
  try {
    const bills = await getAllBills();
    const filteredBills = bills.filter(bill => bill.id !== id);
    await AsyncStorage.setItem(BILLS_KEY, JSON.stringify(filteredBills));
    return true;
  } catch (error) {
    console.error('Error deleting bill:', error);
    throw error;
  }
};

export const clearAllBills = async () => {
  try {
    await AsyncStorage.setItem(BILLS_KEY, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Error clearing all bills:', error);
    throw error;
  }
};

// Settings Storage Functions
export const getSettings = async () => {
  try {
    const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
    if (settingsJson) {
      return JSON.parse(settingsJson);
    }
    // Return and save default settings if none exist
    await saveSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return settings;
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

export const updateSettings = async (updates) => {
  try {
    const currentSettings = await getSettings();
    const newSettings = { ...currentSettings, ...updates };
    await saveSettings(newSettings);
    return newSettings;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};
