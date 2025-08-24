import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, ScrollView, Modal, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../constants/Colors';
import { StyledText } from '../components/StyledText';
import ChallengeCard from '../components/ChallengeCard';
import FeaturedChallengeCard from '../components/FeaturedChallengeCard';
import { getChallenges } from '../services/ChallengeService';
import { submitProof } from '../services/ChallengeService';
import * as ImagePicker from 'expo-image-picker';
import { getFeaturedChallenge } from '../services/FeaturedChallenge';

export default function HomeScreen() {
  const [challenges, setChallenges] = useState([]);
  const [featuredChallenge, setFeaturedChallenge] = useState(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [videoUri, setVideoUri] = useState('');
  const [pickedAt, setPickedAt] = useState(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const challengesData = await getChallenges();
        console.log('Challenges:', challengesData);
        const featuredChallengeData = await getFeaturedChallenge();
        console.log('Featured Challenge:', featuredChallengeData);
        setChallenges(challengesData);
        setFeaturedChallenge(featuredChallengeData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchChallenges();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <StyledText medium style={styles.title}>
              Today's
            </StyledText>
            <StyledText medium style={styles.subtitle}>
              Challenge
            </StyledText>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="filter" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
          {featuredChallenge && (
            <FeaturedChallengeCard
              title={featuredChallenge.title}
              description={featuredChallenge.description}
              progress={0} // TODO: Calculate progress
              timeRemaining="TODO" // TODO: Calculate time remaining
              image="https://www.insidehighered.com/sites/default/files/media/iStock-1436447934.jpg" // TODO: Use challenge image
            />
          )}
          {challenges
            .filter((challenge) => !challenge.isBonus)
            .map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                title={challenge.title}
                description={challenge.description}
                onSubmit={() => {
                  setActiveChallenge(challenge);
                  setVideoUri('');
                  setPickedAt(null);
                  setIsSubmitOpen(true);
                }}
              />
            ))}
        </View>
      </ScrollView>

      <Modal visible={isSubmitOpen} transparent animationType="slide" onRequestClose={() => setIsSubmitOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <StyledText semibold style={styles.modalTitle}>Submit proof</StyledText>
            <StyledText style={styles.modalSubtitle}>{activeChallenge?.title || ''}</StyledText>
            {videoUri ? (
              <StyledText style={styles.timestamp}>Selected at {pickedAt?.toLocaleString()}</StyledText>
            ) : (
              <StyledText style={styles.timestamp}>No video selected yet</StyledText>
            )}
            <View style={styles.rowButtons}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={async () => {
                  try {
                    await ImagePicker.requestCameraPermissionsAsync();
                    const media = await ImagePicker.launchCameraAsync({ mediaTypes: 'videos', allowsEditing: false, videoMaxDuration: 60 });
                    if (!media.canceled) {
                      setVideoUri(media.assets[0].uri);
                      setPickedAt(new Date());
                    }
                  } catch (e) { console.error(e); }
                }}
              >
                <StyledText style={styles.modalBtnText}>Record</StyledText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={async () => {
                  try {
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                    const media = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'videos' });
                    if (!media.canceled) {
                      setVideoUri(media.assets[0].uri);
                      setPickedAt(new Date());
                    }
                  } catch (e) { console.error(e); }
                }}
              >
                <StyledText style={styles.modalBtnText}>Pick</StyledText>
              </TouchableOpacity>
            </View>

            <View style={{ height: 16 }} />
            <TouchableOpacity
              disabled={!videoUri}
              style={[styles.submitBtn, { opacity: videoUri ? 1 : 0.5 }]}
              onPress={async () => {
                try {
                  const campusId = activeChallenge.campusId;
                  await submitProof({ challengeId: activeChallenge.id, campusId, videoUri });
                  setIsSubmitOpen(false);
                  alert('Submitted!');
                } catch (e) {
                  console.error(e);
                  alert('Failed to submit');
                }
              }}
            >
              <StyledText semibold style={{ color: 'white' }}>Upload</StyledText>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsSubmitOpen(false)} style={styles.cancelLink}>
              <StyledText>Cancel</StyledText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    color: Colors.black,
  },
  subtitle: {
    fontSize: 28,
    color: Colors.grey,
  },
  headerButton: {
    backgroundColor: Colors.electricBlue,
    borderRadius: 25,
    padding: 12,
  },
  cardContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: 'white',
    padding: 22,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 28,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 6,
  },
  modalSubtitle: {
    color: Colors.grey,
    marginBottom: 16,
  },
  timestamp: {
    color: Colors.grey,
    marginBottom: 12,
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    backgroundColor: Colors.deepPurple,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalBtnText: {
    color: 'white',
  },
  submitBtn: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelLink: {
    marginTop: 16,
    alignItems: 'center',
  },
});
