import React, { useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform } from 'react-native';
import { Provider as PaperProvider, ActivityIndicator } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import useStore from './src/store/useStore';
import { lightTheme, darkTheme } from './src/theme/theme';

// Custom safe area view that handles insets properly
const SafeAreaWrapper = ({ children, theme }) => {
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
  
  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: currentTheme.colors.background }}
      edges={['top', 'left', 'right']}
    >
      {children}
    </SafeAreaView>
  );
};

export default function App() {
  const { theme, isLoading, initializeApp } = useStore();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <PaperProvider theme={currentTheme}>
        <SafeAreaProvider>
          <View style={[styles.loadingContainer, { backgroundColor: currentTheme.colors.background }]}>
            <ActivityIndicator size="large" color={currentTheme.colors.primary} />
          </View>
          <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        </SafeAreaProvider>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={currentTheme}>
      <SafeAreaProvider>
        <SafeAreaWrapper theme={theme}>
          <AppNavigator />
          <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        </SafeAreaWrapper>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
