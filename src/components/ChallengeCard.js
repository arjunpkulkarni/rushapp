import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyledText } from './StyledText';
import { Colors } from '../constants/Colors';

export default function ChallengeCard({ title, description, onSubmit }) {
  return (
    <LinearGradient
      colors={['#4A90E2', '#D8A44E']}
      style={styles.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
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
        <TouchableOpacity style={styles.customizeButton}>
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
        <TouchableOpacity style={styles.playButton}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.black} />
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
  customizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
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

