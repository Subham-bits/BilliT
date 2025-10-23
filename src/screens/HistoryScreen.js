import React, { useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { List, useTheme, Divider, Text, Surface } from "react-native-paper";
import useStore from "../store/useStore";

const HistoryScreen = ({ navigation }) => {
  const theme = useTheme();
  const { bills, refreshBills } = useStore();

  useEffect(() => {
    // Refresh bills when screen comes into focus
    const unsubscribe = navigation.addListener("focus", () => {
      refreshBills();

      // Reset navigation stack to HistoryMain if we're on a DetailedBillView
      const parent = navigation.getParent();
      if (parent) {
        const currentRoute = parent.getState().routes[parent.getState().index];
        const currentStackState = currentRoute.state;

        // If we're not on the main screen (index > 0), reset to main screen
        if (currentStackState && currentStackState.index > 0) {
          navigation.reset({
            index: 0,
            routes: [{ name: "HistoryMain" }],
          });
        }
      }
    });

    return unsubscribe;
  }, [navigation]);

  const handleBillPress = (billId) => {
    navigation.navigate("DetailedBillView", { billId });
  };

  const renderBillItem = ({ item }) => (
    <Surface style={styles.itemSurface} elevation={1}>
      <List.Item
        title={`Bill - ${item.date}`}
        description={`Ground Bill: ₹${item.groundBill.toFixed(2)} | Total: ${
          item.totalUnits
        } units`}
        left={(props) => <List.Icon {...props} icon="file-document" />}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        onPress={() => handleBillPress(item.id)}
        titleStyle={styles.itemTitle}
        descriptionStyle={styles.itemDescription}
      />
    </Surface>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <List.Icon icon="inbox" size={64} color={theme.colors.outline} />
      <Text
        style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}
      >
        No bills yet
      </Text>
      <Text
        style={[styles.emptySubtext, { color: theme.colors.onSurfaceVariant }]}
      >
        Create your first bill from the Home tab
      </Text>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {bills.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={bills}
          renderItem={renderBillItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  itemSurface: {
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemDescription: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});

export default HistoryScreen;
