import React from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../constants/Colors';
import { StyledText } from '../components/StyledText';
import ChallengeCard from '../components/ChallengeCard';
import FeaturedChallengeCard from '../components/FeaturedChallengeCard';

export default function HomeScreen() {
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
          <FeaturedChallengeCard
            title="Campus Explorer"
            description="Visit 5 key locations on campus"
            progress={0.6}
            timeRemaining="2 hours left"
            image="https://www.insidehighered.com/sites/default/files/media/iStock-1436447934.jpg"
          />
          <ChallengeCard
            title="20$ Prize"
            description="Do 30 push-ups in front of the Engineering Hall"
            onSubmit={() => console.log('Submit Proof')}
          />
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
