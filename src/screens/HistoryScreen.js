import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { StyledText } from '../components/StyledText';

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <StyledText semibold style={styles.title}>
        Challenge History
      </StyledText>
      {/* TODO: Feed of submissions */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    color: Colors.black,
    marginTop: 24,
    marginBottom: 24,
  },
});
