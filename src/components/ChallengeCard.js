import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Countdown from './Countdown';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyledText } from './StyledText';
import { Colors } from '../constants/Colors';
import API from '../api/api';

const resolveImageUrl = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  try {
    const origin = new URL(API.defaults.baseURL).origin;
    return `${origin}${url}`;
  } catch {
    // Fallback: strip /api/v1 from base and append
    const base = (API.defaults.baseURL || '').replace(/\/api\/.*/, '');
    return `${base}${url}`;
  }
};

export default function ChallengeCard({ title, description, onSubmit, timeRemaining, timeLabel = 'Time', disabled, targetIso, isLive, completions, imageUrl }) {
  const resolved = resolveImageUrl(imageUrl) || 'https://placekitten.com/200/200';

  return (
    <LinearGradient
      colors={[Colors.electricBlue, Colors.lightPurple]}
      style={styles.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
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
        {typeof completions === 'number' && (
          <View style={styles.completionsPill}>
            <Ionicons name="people-outline" size={16} color={Colors.white} style={{ marginRight: 6 }} />
            <StyledText style={styles.timeText}>{completions} completed</StyledText>
          </View>
        )}
      </View>
      <View style={styles.graphicContainer}>
        <Image
          source={{ uri: resolved }}
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
      </View>

      {/* Submit bottom-right */}
      <TouchableOpacity
        disabled={disabled}
        onPress={onSubmit}
        style={[styles.submitBottomRight, disabled && { opacity: 0.6 }]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="create-outline" size={16} color={Colors.white} style={{ marginRight: 6 }} />
        <StyledText style={[styles.timeText, styles.submitBottomRightText]}>Submit Proof</StyledText>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 32,
    padding: 24,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flexShrink: 1,
    paddingRight: 12,
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
    opacity: 0.9,
  },
  graphicContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  graphic: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 90,
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
  submitBottomRight: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  submitBottomRightText: {
    color: Colors.white,
  },
});

