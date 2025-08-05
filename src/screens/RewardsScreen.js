import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { StyledText } from '../components/StyledText';

export default function RewardsScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <StyledText semibold style={styles.title}>
        Rewards
      </StyledText>
      {/* TODO: Display buy-in levels & prize breakdown */}
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
