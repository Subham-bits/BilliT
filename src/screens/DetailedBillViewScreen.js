import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { format, parseISO, isDate } from "date-fns";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  useTheme,
  Dialog,
  Portal,
  ActivityIndicator,
} from "react-native-paper";
import useStore from "../store/useStore";

// Helper function to format date for display
const formatDateForDisplay = (dateValue) => {
  try {
    if (!dateValue) return "No date";

    if (dateValue instanceof Date) {
      return format(dateValue, "dd-MM-yyyy");
    }

    if (typeof dateValue === "string") {
      if (dateValue.includes("-")) {
        const parts = dateValue.split("-");
        if (parts[0].length === 4) {
          // yyyy-MM-dd format
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        // Already in dd-MM-yyyy format
        return dateValue;
      }

      // Try parsing as ISO string
      const parsedDate = new Date(dateValue);
      if (!isNaN(parsedDate.getTime())) {
        return format(parsedDate, "dd-MM-yyyy");
      }
    }

    return "Invalid date";
  } catch (error) {
    console.error("Error formatting date:", error, dateValue);
    return "Invalid date";
  }
};

const DetailedBillViewScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const { billId } = route.params;
  const { deleteBill: deleteBillFromStore, getBillById: getBillByIdFromStore } =
    useStore();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadBill();
  }, [billId]);

  useEffect(() => {
    // Refresh bill data when screen comes into focus
    const unsubscribe = navigation.addListener("focus", () => {
      loadBill();
    });

    return unsubscribe;
  }, [navigation, billId]);

  const loadBill = () => {
    try {
      setLoading(true);
      const billData = getBillByIdFromStore(billId);
      if (billData) {
        setBill(billData);
      } else {
        Alert.alert("Error", "Bill not found.");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error loading bill:", error);
      Alert.alert("Error", "Failed to load bill.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate("NewBillInput", { mode: "edit", billId: bill.id });
  };

  const handleDelete = async () => {
    try {
      await deleteBillFromStore(bill.id);
      setShowDeleteDialog(false);
      Alert.alert("Success", "Bill deleted successfully.");

      // Navigate back to the appropriate screen
      // Check if we can go back, otherwise navigate to History
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate("History");
      }
    } catch (error) {
      console.error("Error deleting bill:", error);
      Alert.alert("Error", "Failed to delete bill.");
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!bill) {
    return null;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.mainTitle}>Bill Details</Title>
          <Paragraph style={styles.date}>
            {formatDateForDisplay(bill.date)}
          </Paragraph>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Bill Information</Title>
            <View style={styles.row}>
              <Paragraph style={styles.label}>Total Units:</Paragraph>
              <Paragraph style={styles.value}>{bill.totalUnits}</Paragraph>
            </View>
            <View style={styles.row}>
              <Paragraph style={styles.label}>Total Bill Amount:</Paragraph>
              <Paragraph style={styles.value}>
                ₹{bill.totalBillAmount.toFixed(2)}
              </Paragraph>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Upper Floor</Title>
            <View style={styles.row}>
              <Paragraph style={styles.label}>Previous Reading:</Paragraph>
              <Paragraph style={styles.value}>{bill.upperPrev}</Paragraph>
            </View>
            <View style={styles.row}>
              <Paragraph style={styles.label}>Current Reading:</Paragraph>
              <Paragraph style={styles.value}>{bill.upperCurr}</Paragraph>
            </View>
            <View style={styles.row}>
              <Paragraph style={styles.label}>Upper Units:</Paragraph>
              <Paragraph style={[styles.value, styles.highlight]}>
                {bill.upperUnits}
              </Paragraph>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Ground Floor</Title>
            <View style={styles.row}>
              <Paragraph style={styles.label}>Ground Units:</Paragraph>
              <Paragraph style={[styles.value, styles.highlight]}>
                {bill.groundUnits}
              </Paragraph>
            </View>
            <View style={styles.row}>
              <Paragraph style={styles.label}>Per-Unit Rate:</Paragraph>
              <Paragraph style={styles.value}>
                ₹{bill.rate.toFixed(2)}
              </Paragraph>
            </View>
            <View style={[styles.row, styles.totalRow]}>
              <Paragraph style={styles.totalLabel}>
                Ground Floor Bill:
              </Paragraph>
              <Paragraph style={styles.totalValue}>
                ₹{bill.groundBill.toFixed(2)}
              </Paragraph>
            </View>
          </View>

          {bill.note && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.section}>
                <Title style={styles.sectionTitle}>Note</Title>
                <Paragraph style={styles.noteText}>{bill.note}</Paragraph>
              </View>
            </>
          )}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleEdit}
          style={styles.button}
          icon="pencil"
        >
          Edit Bill
        </Button>

        <Button
          mode="outlined"
          onPress={() => setShowDeleteDialog(true)}
          style={styles.button}
          textColor={theme.colors.error}
          icon="delete"
        >
          Delete Bill
        </Button>
      </View>

      <Portal>
        <Dialog
          visible={showDeleteDialog}
          onDismiss={() => setShowDeleteDialog(false)}
        >
          <Dialog.Title>Delete Bill?</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to delete this bill? This action cannot be
              undone.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onPress={handleDelete} textColor={theme.colors.error}>
              Delete
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
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    opacity: 0.7,
  },
  divider: {
    marginVertical: 16,
  },
  section: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    fontSize: 16,
    opacity: 0.8,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  highlight: {
    color: "#2e7d32",
    fontWeight: "bold",
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: "#e0e0e0",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  noteText: {
    fontSize: 15,
    fontStyle: "italic",
    opacity: 0.8,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 6,
  },
});

export default DetailedBillViewScreen;
