import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Title, useTheme, Surface } from "react-native-paper";
import useStore from "../store/useStore";

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const { getLatestBill: getLatestBillFromStore, refreshBills } = useStore();

  useEffect(() => {
    // Refresh bills when screen comes into focus
    const unsubscribe = navigation.addListener("focus", () => {
      refreshBills();

      // Reset navigation stack to HomeMain if we're on a DetailedBillView
      const parent = navigation.getParent();
      if (parent) {
        const currentRoute = parent.getState().routes[parent.getState().index];
        const currentStackState = currentRoute.state;

        // If we're not on the main screen (index > 0), reset to main screen
        if (currentStackState && currentStackState.index > 0) {
          navigation.reset({
            index: 0,
            routes: [{ name: "HomeMain" }],
          });
        }
      }
    });

    return unsubscribe;
  }, [navigation]);

  const handleViewCurrentBill = () => {
    try {
      const latestBill = getLatestBillFromStore();
      if (latestBill) {
        navigation.navigate("DetailedBillView", { billId: latestBill.id });
      } else {
        alert("No bills found. Please create a new bill first.");
      }
    } catch (error) {
      console.error("Error viewing current bill:", error);
      alert("Error loading bill. Please try again.");
    }
  };

  const handleCalculateNewBill = () => {
    navigation.navigate("NewBillInput", { mode: "create" });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Surface style={styles.surface} elevation={2}>
        <Title style={styles.title}>BilliT</Title>
        <Title style={styles.subtitle}>Electricity Bill Splitter</Title>
      </Surface>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleViewCurrentBill}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          icon="file-document-outline"
        >
          View Current Bill
        </Button>

        <Button
          mode="contained"
          onPress={handleCalculateNewBill}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          icon="calculator"
        >
          Calculate New Bill
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  surface: {
    padding: 30,
    borderRadius: 12,
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  buttonContainer: {
    gap: 20,
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  buttonLabel: {
    fontSize: 18,
  },
});

export default HomeScreen;
