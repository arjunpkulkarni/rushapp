import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StyledText } from './StyledText';
import { Colors } from '../constants/Colors';

export default function ChallengeCard({
  title,
  description,
  isBonus,
  timeLeft,
  onSubmit,
}) {
  return (
    <View style={styles.card}>
      {isBonus && (
        <LinearGradient
          colors={['#EEC271', '#F9A824']}
          style={styles.bonusRing}
        />
      )}
      <StyledText semibold style={styles.title}>
        {title}
      </StyledText>
      <StyledText regular style={styles.description}>
        {description}
      </StyledText>
      <View style={styles.timerContainer}>
        <StyledText medium style={styles.timerText}>
          {timeLeft} left
        </StyledText>
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
        <StyledText medium style={styles.submitButtonText}>
          Submit Proof
        </StyledText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 32,
    backgroundColor: Colors.white,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  bonusRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 32,
    zIndex: -1,
  },
  title: {
    fontSize: 24,
    color: Colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.black,
    marginBottom: 16,
    textAlign: 'center',
  },
  timerContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 24,
  },
  timerText: {
    position: 'absolute',
    top: -20,
    right: 0,
    fontSize: 14,
    color: Colors.black,
  },
  submitButton: {
    width: '100%',
    backgroundColor: Colors.electricBlue,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
});
