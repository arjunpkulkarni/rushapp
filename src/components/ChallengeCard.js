import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Countdown from './Countdown';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyledText } from './StyledText';
import { Colors } from '../constants/Colors';

export default function ChallengeCard({ title, description, onSubmit, timeRemaining, timeLabel = 'Time', disabled, targetIso, isLive, completions }) {
  return (
    <LinearGradient
      colors={[Colors.electricBlue, Colors.lightPurple]}
      style={styles.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        {isLive && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <StyledText style={styles.liveText}>LIVE</StyledText>
          </View>
        )}
        <StyledText medium style={styles.title}>
          {title}
        </StyledText>
        <StyledText regular style={styles.description}>
          {description}
        </StyledText>
      </View>
      <View style={styles.graphicContainer}>
        <Image
          source={{ uri: 'https://placekitten.com/200/200' }} // Replace with your image
          style={styles.graphic}
        />
      </View>
      <View style={styles.footer}>
        <View style={styles.timePill}>
          <Ionicons name="time-outline" size={16} color={Colors.white} style={{ marginRight: 6 }} />
          {targetIso ? (
            <Countdown style={styles.timeText} prefix={`${timeLabel}: `} target={targetIso} />
          ) : (
            <StyledText style={styles.timeText}>{timeLabel}: {timeRemaining}</StyledText>
          )}
        </View>
        {typeof completions === 'number' && (
          <View style={styles.completionsPill}>
            <Ionicons name="people-outline" size={16} color={Colors.white} style={{ marginRight: 6 }} />
            <StyledText style={styles.timeText}>{completions} completed</StyledText>
          </View>
        )}
        <TouchableOpacity disabled={disabled} style={[styles.customizeButton, disabled && { opacity: 0.5 }]} onPress={onSubmit}>
          <Ionicons
            name="create-outline"
            size={20}
            color={Colors.white}
            style={{ marginRight: 8 }}
          />
          <StyledText medium style={styles.buttonText}>
            Submit Proof
          </StyledText>
        </TouchableOpacity>
        
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  liveBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.25)',
    borderColor: '#EF4444',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444', marginRight: 6 },
  liveText: { color: Colors.white, fontSize: 12 },
  title: {
    fontSize: 18,
    color: Colors.white,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.white,
  },
  graphicContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  graphic: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  timeText: {
    color: Colors.white,
    fontSize: 12,
  },
  completionsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  customizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 14,
  },
  playButton: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    padding: 12,
  },
});

