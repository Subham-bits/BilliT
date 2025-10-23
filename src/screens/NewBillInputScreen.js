import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  TextInput,
  Button,
  useTheme,
  HelperText,
  Card,
  Title,
  Paragraph,
  Divider,
  Text,
} from "react-native-paper";
import { format } from "date-fns";
import { DatePickerModal, registerTranslation } from "react-native-paper-dates";
import useStore from "../store/useStore";
import { validateBillInput } from "../utils/validation";
import { getBillById, getLatestBill } from "../utils/storage";

registerTranslation("en", {
  save: "Save",
  selectSingle: "Select date",
  selectMultiple: "Select dates",
  selectRange: "Select period",
  notAccordingToDateFormat: (inputFormat) =>
    `Date format must be ${inputFormat}`,
  mustBeHigherThan: (date) => `Must be later than ${date}`,
  mustBeLowerThan: (date) => `Must be earlier than ${date}`,
  mustBeBetween: (startDate, endDate) =>
    `Must be between ${startDate} and ${endDate}`,
  dateIsDisabled: "Day is not allowed",
  previous: "Previous",
  next: "Next",
  typeInDate: "Type in date",
  pickDateFromCalendar: "Pick date from calendar",
  close: "Close",
});

const NewBillInputScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const {
    rate: defaultRate,
    saveBill: saveBillToStore,
    updateBill: updateBillInStore,
  } = useStore();
  const { mode, billId } = route.params || { mode: "create" };

  const [formData, setFormData] = useState({
    date: new Date(),
    totalUnits: "",
    totalBillAmount: "",
    upperPrev: "",
    upperCurr: "",
    rate: defaultRate.toString(),
    note: "",
  });

  const [errors, setErrors] = useState({});
  const [calculatedValues, setCalculatedValues] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    const initializeForm = async () => {
      if (mode === "edit" && billId) {
        loadBillData();
      } else if (mode === "create") {
        // Auto-fill previous reading from the latest bill
        const latestBill = await getLatestBill();
        if (latestBill) {
          setFormData((prev) => ({
            ...prev,
            upperPrev: latestBill.upperCurr.toString(),
          }));
        }
      }
    };

    initializeForm();
  }, [mode, billId]);

  const loadBillData = async () => {
    try {
      const bill = await getBillById(billId);
      if (bill) {
        // Parse the date string from storage into a Date object
        const billDate = bill.date.includes("-")
          ? new Date(bill.date.split("-").reverse().join("-")) // Convert from dd-MM-yyyy to yyyy-MM-dd for Date parsing
          : new Date(bill.date); // For backward compatibility with yyyy-MM-dd format

        setFormData({
          date: billDate,
          totalUnits: bill.totalUnits.toString(),
          totalBillAmount: bill.totalBillAmount.toString(),
          upperPrev: bill.upperPrev.toString(),
          upperCurr: bill.upperCurr.toString(),
          rate: bill.rate.toString(),
          note: bill.note || "",
        });
      }
    } catch (error) {
      console.error("Error loading bill:", error);
      Alert.alert("Error", "Failed to load bill data.");
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // Clear calculated values when any input changes
    setCalculatedValues(null);
  };

  const onConfirmDatePicker = useCallback((params) => {
    setDatePickerVisible(false);
    const newDate = params.date;
    if (newDate) {
      updateField("date", newDate);
    }
  }, []);

  // Format date for display
  const formattedDate = format(formData.date, "dd-MM-yyyy");

  const handleCalculate = async () => {
    try {
      // Get the latest bill to check the date
      const latestBill = await getLatestBill();
      const latestBillDate = latestBill ? latestBill.date : null;

      // For the first bill, we don't need to check against previous bill date
      const validation = latestBill
        ? validateBillInput(formData, latestBillDate)
        : validateBillInput(formData);

      if (!validation.isValid) {
        setErrors(validation.errors);
        Alert.alert("Validation Error", "Please fix the errors in the form.");
        return;
      }

      setErrors({});
      setCalculatedValues(validation.calculatedValues);
    } catch (error) {
      console.error("Error during validation:", error);
      Alert.alert("Error", "An error occurred while validating the form.");
    }
  };

  const handleSave = async () => {
    if (!calculatedValues) {
      Alert.alert(
        "Calculate First",
        "Please calculate the bill before saving."
      );
      return;
    }

    try {
      // Format the date as 'dd-MM-yyyy' for storage
      const formattedDate = format(formData.date, "dd-MM-yyyy");

      const billData = {
        date: formattedDate,
        totalUnits: parseFloat(formData.totalUnits),
        totalBillAmount: parseFloat(formData.totalBillAmount),
        upperPrev: parseFloat(formData.upperPrev),
        upperCurr: parseFloat(formData.upperCurr),
        upperUnits: calculatedValues.upperUnits,
        groundUnits: calculatedValues.groundUnits,
        rate: parseFloat(formData.rate),
        groundBill: calculatedValues.groundBill,
        note: formData.note,
      };

      let savedBill;
      if (mode === "edit" && billId) {
        savedBill = await updateBillInStore(billId, billData);
      } else {
        savedBill = await saveBillToStore(billData);
      }

      // Navigate to detailed view
      navigation.replace("DetailedBillView", { billId: savedBill.id });
    } catch (error) {
      console.error("Error saving bill:", error);
      Alert.alert("Error", "Failed to save bill. Please try again.");
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title>{mode === "edit" ? "Edit Bill" : "New Bill"}</Title>

          <TouchableOpacity
            onPress={() => setDatePickerVisible(true)}
            style={styles.dateInputContainer}
          >
            <TextInput
              label="Date"
              value={formattedDate}
              editable={false}
              mode="outlined"
              style={styles.input}
              error={!!errors.date}
              left={<TextInput.Icon icon="calendar" />}
            />
          </TouchableOpacity>
          <HelperText type="error" visible={!!errors.date}>
            {errors.date}
          </HelperText>

          <DatePickerModal
            locale="en"
            mode="single"
            visible={isDatePickerVisible}
            onDismiss={() => setDatePickerVisible(false)}
            date={formData.date}
            onConfirm={onConfirmDatePicker}
          />

          <TextInput
            label="Total Units (from bill)"
            value={formData.totalUnits}
            onChangeText={(value) => updateField("totalUnits", value)}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
            error={!!errors.totalUnits}
            left={<TextInput.Icon icon="flash" />}
          />
          <HelperText type="error" visible={!!errors.totalUnits}>
            {errors.totalUnits}
          </HelperText>

          <TextInput
            label="Total Bill Amount (₹)"
            value={formData.totalBillAmount}
            onChangeText={(value) => updateField("totalBillAmount", value)}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
            error={!!errors.totalBillAmount}
            left={<TextInput.Icon icon="currency-inr" />}
          />
          <HelperText type="error" visible={!!errors.totalBillAmount}>
            {errors.totalBillAmount}
          </HelperText>

          <Divider style={styles.divider} />

          <TextInput
            label="Upper Floor Previous Reading"
            value={formData.upperPrev}
            onChangeText={(value) => updateField("upperPrev", value)}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
            error={!!errors.upperPrev}
            left={<TextInput.Icon icon="gauge-empty" />}
          />
          <HelperText type="error" visible={!!errors.upperPrev}>
            {errors.upperPrev}
          </HelperText>

          <TextInput
            label="Upper Floor Current Reading"
            value={formData.upperCurr}
            onChangeText={(value) => updateField("upperCurr", value)}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
            error={!!errors.upperCurr}
            left={<TextInput.Icon icon="gauge" />}
          />
          <HelperText type="error" visible={!!errors.upperCurr}>
            {errors.upperCurr}
          </HelperText>

          <Divider style={styles.divider} />

          <TextInput
            label="Per-Unit Rate (₹)"
            value={formData.rate}
            onChangeText={(value) => updateField("rate", value)}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
            error={!!errors.rate}
            left={<TextInput.Icon icon="currency-inr" />}
          />
          <HelperText type="error" visible={!!errors.rate}>
            {errors.rate}
          </HelperText>

          <TextInput
            label="Note (Optional)"
            value={formData.note}
            onChangeText={(value) => updateField("note", value)}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={2}
            left={<TextInput.Icon icon="note-text" />}
          />
        </Card.Content>
      </Card>

      {calculatedValues && (
        <Card style={[styles.card, styles.resultCard]}>
          <Card.Content>
            <Title style={styles.resultTitle}>Calculation Results</Title>
            <View style={styles.resultRow}>
              <Paragraph style={styles.resultLabel}>
                Upper Floor Units:
              </Paragraph>
              <Paragraph style={styles.resultValue}>
                {calculatedValues.upperUnits}
              </Paragraph>
            </View>
            <View style={styles.resultRow}>
              <Paragraph style={styles.resultLabel}>
                Ground Floor Units:
              </Paragraph>
              <Paragraph style={styles.resultValue}>
                {calculatedValues.groundUnits}
              </Paragraph>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.resultRow}>
              <Paragraph style={[styles.resultLabel, styles.boldText]}>
                Ground Floor Bill:
              </Paragraph>
              <Paragraph
                style={[
                  styles.resultValue,
                  styles.boldText,
                  styles.primaryText,
                ]}
              >
                ₹{calculatedValues.groundBill.toFixed(2)}
              </Paragraph>
            </View>
          </Card.Content>
        </Card>
      )}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleCalculate}
          style={styles.button}
          icon="calculator"
        >
          Calculate Bill
        </Button>

        {calculatedValues && (
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
            icon="content-save"
          >
            {mode === "edit" ? "Update Bill" : "Save Bill"}
          </Button>
        )}
      </View>
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
  card: {
    marginBottom: 16,
  },
  dateInputContainer: {
    marginBottom: 8,
  },
  input: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 16,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  button: {
    paddingVertical: 6,
  },
  resultCard: {
    backgroundColor: "#e8f5e9",
  },
  resultTitle: {
    marginBottom: 12,
    color: "#2e7d32",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  resultLabel: {
    fontSize: 16,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  primaryText: {
    color: "#2e7d32",
  },
});

export default NewBillInputScreen;
