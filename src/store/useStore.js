import { create } from "zustand";
import {
  getSettings,
  saveSettings,
  getAllBills,
  deleteBill as deleteBillFromStorage,
  clearAllBills as clearAllBillsFromStorage,
  saveBill as saveBillToStorage,
  updateBill as updateBillInStorage,
} from "../utils/storage";

const useStore = create((set, get) => ({
  // Settings state
  rate: 7.0,
  theme: "light",
  isLoading: true,

  // Bills state
  bills: [],

  // Initialize app - load settings and bills
  initializeApp: async () => {
    try {
      set({ isLoading: true });
      const [settings, bills] = await Promise.all([
        getSettings(),
        getAllBills(),
      ]);
      set({
        rate: settings.rate,
        theme: settings.theme,
        bills,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error initializing app:", error);
      set({ isLoading: false });
    }
  },

  // Update rate
  setRate: async (rate) => {
    try {
      await saveSettings({ ...(await getSettings()), rate });
      set({ rate });
    } catch (error) {
      console.error("Error setting rate:", error);
    }
  },

  // Toggle theme
  toggleTheme: async () => {
    try {
      const currentTheme = get().theme;
      const newTheme = currentTheme === "light" ? "dark" : "light";
      await saveSettings({ ...(await getSettings()), theme: newTheme });
      set({ theme: newTheme });
    } catch (error) {
      console.error("Error toggling theme:", error);
    }
  },

  // Refresh bills from storage
  refreshBills: async () => {
    try {
      const bills = await getAllBills();
      set({ bills });
    } catch (error) {
      console.error("Error refreshing bills:", error);
    }
  },

  // Delete a specific bill
  deleteBill: async (billId) => {
    try {
      await deleteBillFromStorage(billId);
      const bills = await getAllBills();
      set({ bills });
      return true;
    } catch (error) {
      console.error("Error deleting bill:", error);
      throw error;
    }
  },

  // Clear all bills
  clearAllBills: async () => {
    try {
      await clearAllBillsFromStorage();
      set({ bills: [] });
      return true;
    } catch (error) {
      console.error("Error clearing all bills:", error);
      throw error;
    }
  },

  // Check if a bill exists by ID
  getBillById: (billId) => {
    const bills = get().bills;
    return bills.find((bill) => bill.id === billId) || null;
  },

  // Get the latest bill
  getLatestBill: () => {
    const bills = get().bills;
    return bills.length > 0 ? bills[0] : null;
  },

  // Save a new bill
  saveBill: async (billData) => {
    try {
      const savedBill = await saveBillToStorage(billData);
      const bills = await getAllBills();
      set({ bills });
      return savedBill;
    } catch (error) {
      console.error("Error saving bill:", error);
      throw error;
    }
  },

  // Update an existing bill
  updateBill: async (billId, updatedData) => {
    try {
      const updatedBill = await updateBillInStorage(billId, updatedData);
      const bills = await getAllBills();
      set({ bills });
      return updatedBill;
    } catch (error) {
      console.error("Error updating bill:", error);
      throw error;
    }
  },
}));

export default useStore;
