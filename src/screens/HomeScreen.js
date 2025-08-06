import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../constants/Colors';
import { StyledText } from '../components/StyledText';
import ChallengeCard from '../components/ChallengeCard';
import FeaturedChallengeCard from '../components/FeaturedChallengeCard';
import { getChallenges } from '../services/ChallengeService';
import { getFeaturedChallenge } from '../services/FeaturedChallenge';

export default function HomeScreen() {
  const [challenges, setChallenges] = useState([]);
  const [featuredChallenge, setFeaturedChallenge] = useState(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        // TODO: Replace with dynamic campus ID
        const campusId = 'clw8l427300001234567890ab';
        const challengesData = await getChallenges(campusId);
        console.log('Challenges:', challengesData);
        const featuredChallengeData = await getFeaturedChallenge(campusId);
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
                onSubmit={() => console.log('Submit Proof')}
              />
            ))}
        </View>
      </ScrollView>
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
    backgroundColor: Colors.deepPurple,
    borderRadius: 25,
    padding: 12,
  },
  cardContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
});
