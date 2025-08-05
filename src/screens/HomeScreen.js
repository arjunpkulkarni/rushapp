import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { StyledText } from '../components/StyledText';
import ChallengeCard from '../components/ChallengeCard';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <StyledText semibold style={styles.header}>
        Today's Challenge
      </StyledText>
      <View style={styles.cardContainer}>
        <ChallengeCard
          title="Campus Explorer"
          description="Take a selfie with the Alma Mater statue."
          isBonus={true}
          timeLeft="02:13:09"
          onSubmit={() => console.log('Submit Proof')}
        />
      </View>
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
  header: {
    fontSize: 28,
    color: Colors.black,
    marginTop: 24,
    marginBottom: 24,
  },
  cardContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
});
