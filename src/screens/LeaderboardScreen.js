import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { StyledText } from '../components/StyledText';

export default function LeaderboardScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <StyledText semibold style={styles.title}>
        Leaderboard
      </StyledText>
      {/* TODO: Show daily & overall rankings */}
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
