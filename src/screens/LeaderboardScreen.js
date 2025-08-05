import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { StyledText } from '../components/StyledText';

export default function LeaderboardScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <StyledText bold style={styles.title}>Leaderboard</StyledText>
      {/* TODO: Show daily & overall rankings */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    color: Colors.black,
    marginBottom: 16,
  },
});
