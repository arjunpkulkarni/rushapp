import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyledText } from './StyledText';
import { Colors } from '../constants/Colors';
import * as Progress from 'react-native-progress';

export default function FeaturedChallengeCard({
  title,
  description,
  progress,
  timeRemaining,
  image,
}) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.overlay}
      >
        <View style={styles.header}>
          <StyledText bold style={styles.title}>
            {title}
          </StyledText>
          <StyledText regular style={styles.description}>
            {description}
          </StyledText>
        </View>
        <View style={styles.footer}>
          <View style={styles.progressContainer}>
            <Progress.Bar
              progress={progress}
              width={null}
              color={Colors.lightYellow}
              unfilledColor="rgba(255, 255, 255, 0.3)"
              borderWidth={0}
              style={styles.progressBar}
            />
            <StyledText regular style={styles.timeText}>
              {timeRemaining}
            </StyledText>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="arrow-forward" size={24} color={Colors.black} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 400,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  header: {
    // Moves header to the top
  },
  title: {
    fontSize: 28,
    color: Colors.white,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.white,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressContainer: {
    flex: 1,
    marginRight: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: Colors.white,
  },
  actionButton: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    padding: 12,
  },
});
