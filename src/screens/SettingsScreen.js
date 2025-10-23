import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  List,
  Switch,
  TextInput,
  Button,
  Dialog,
  Portal,
  Paragraph,
  useTheme,
  Divider,
} from "react-native-paper";
import useStore from "../store/useStore";

const SettingsScreen = ({ navigation }) => {
  const theme = useTheme();
  const {
    rate,
    setRate,
    toggleTheme,
    clearAllBills: clearAllBillsFromStore,
  } = useStore();
  const currentTheme = useStore((state) => state.theme);

  const [rateInput, setRateInput] = useState(rate.toString());
  const [showClearDialog, setShowClearDialog] = useState(false);

  useEffect(() => {
    // Reset navigation stack to SettingsMain if needed
    const unsubscribe = navigation.addListener("focus", () => {
      const parent = navigation.getParent();
      if (parent) {
        const currentRoute = parent.getState().routes[parent.getState().index];
        const currentStackState = currentRoute.state;

        // If we're not on the main screen (index > 0), reset to main screen
        if (currentStackState && currentStackState.index > 0) {
          navigation.reset({
            index: 0,
            routes: [{ name: "SettingsMain" }],
          });
        }
      }
    });

    return unsubscribe;
  }, [navigation]);

  const handleSaveRate = async () => {
    const newRate = parseFloat(rateInput);
    if (isNaN(newRate) || newRate <= 0) {
      Alert.alert(
        "Invalid Rate",
        "Please enter a valid positive number for the rate."
      );
      setRateInput(rate.toString());
      return;
    }
    await setRate(newRate);
    Alert.alert("Success", "Per-unit rate updated successfully!");
  };

  const handleClearHistory = async () => {
    try {
      await clearAllBillsFromStore();
      setShowClearDialog(false);
      Alert.alert("Success", "All bill history has been cleared.");
    } catch (error) {
      console.error("Error clearing history:", error);
      Alert.alert("Error", "Failed to clear history. Please try again.");
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <List.Section>
        <List.Subheader>Appearance</List.Subheader>
        <List.Item
          title="Dark Theme"
          description="Toggle between light and dark mode"
          left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => (
            <Switch
              value={currentTheme === "dark"}
              onValueChange={toggleTheme}
            />
          )}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Billing Settings</List.Subheader>
        <View style={styles.rateContainer}>
          <TextInput
            label="Per-Unit Rate (₹)"
            value={rateInput}
            onChangeText={setRateInput}
            keyboardType="decimal-pad"
            mode="outlined"
            left={<TextInput.Icon icon="currency-inr" />}
            style={styles.rateInput}
          />
          <Button
            mode="contained"
            onPress={handleSaveRate}
            style={styles.saveButton}
            disabled={rateInput === rate.toString()}
          >
            Save Rate
          </Button>
        </View>
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Data Management</List.Subheader>
        <List.Item
          title="Clear All History"
          description="Delete all saved bills permanently"
          left={(props) => (
            <List.Icon
              {...props}
              icon="delete-forever"
              color={theme.colors.error}
            />
          )}
          onPress={() => setShowClearDialog(true)}
          titleStyle={{ color: theme.colors.error }}
        />
      </List.Section>

      <Portal>
        <Dialog
          visible={showClearDialog}
          onDismiss={() => setShowClearDialog(false)}
        >
          <Dialog.Title>Clear All History?</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              This will permanently delete all saved bills. This action cannot
              be undone.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowClearDialog(false)}>Cancel</Button>
            <Button onPress={handleClearHistory} textColor={theme.colors.error}>
              Clear All
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  rateContainer: {
    padding: 16,
  },
  rateInput: {
    marginBottom: 12,
  },
  saveButton: {
    marginTop: 8,
  },
});

export default SettingsScreen;
