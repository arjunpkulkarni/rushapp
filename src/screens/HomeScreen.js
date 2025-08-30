import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, ScrollView, Modal, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../constants/Colors';
import { StyledText } from '../components/StyledText';
import ChallengeCard from '../components/ChallengeCard';
import FeaturedChallengeCard from '../components/FeaturedChallengeCard';
import { getChallenges, submitProof, getChallengeStats } from '../services/ChallengeService';
import { createBuyIn, getBuyInStatus } from '../services/BuyInService';
import * as ImagePicker from 'expo-image-picker';
import { getFeaturedChallenge } from '../services/FeaturedChallenge';
import { useChallenge } from '../store/useChallenge';
import LiveBanner from '../components/LiveBanner';
import Countdown from '../components/Countdown';
import API from '../api/api';
import * as SecureStore from 'expo-secure-store';
import { disconnectSocket } from '../lib/socket';
import { stopFallbackPoller } from '../lib/poller';
import { useAtom } from 'jotai';
import { userAtom } from '../state/atoms';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [challenges, setChallenges] = useState([]);
  const [featuredChallenge, setFeaturedChallenge] = useState(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [videoUri, setVideoUri] = useState('');
  const [pickedAt, setPickedAt] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [pastChallenges, setPastChallenges] = useState([]);
  const { phase, current } = useChallenge();
  const [hasBuyIn, setHasBuyIn] = useState(false);
  const [buyInLoading, setBuyInLoading] = useState(false);
  const [completions, setCompletions] = useState(0);
  const [potIndex, setPotIndex] = useState(0);
  const potOpacity = React.useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const [, setUser] = useAtom(userAtom);

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

  // Tick every second for countdown timers
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Poll live completions for the current challenge
  useEffect(() => {
    let id;
    if (phase === 'live' && current) {
      const tick = async () => {
        try {
          const stats = await getChallengeStats(current.id);
          setCompletions(stats?.verifiedCount || 0);
        } catch {}
      };
      tick();
      id = setInterval(tick, 5000);
    }
    return () => id && clearInterval(id);
  }, [phase, current?.id]);

  // Check buy-in status for tomorrow (UTC)
  useEffect(() => {
    (async () => {
      try {
        const nowDate = new Date();
        const tomorrow = new Date(nowDate.getTime() + 24 * 60 * 60 * 1000);
        const yyyy = tomorrow.getUTCFullYear();
        const mm = String(tomorrow.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getUTCDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;
        const campusId = (current?.campusId) || 'clysjrz2u000008l5d2l983s0';
        const status = await getBuyInStatus({ campusId, date: dateStr });
        setHasBuyIn(!!status?.hasBuyIn);
      } catch {}
    })();
  }, [current?.campusId, now]);

  const midnightIso = React.useMemo(() => {
    const d = new Date();
    d.setHours(24, 0, 0, 0);
    return d.toISOString();
  }, [now]);

  // Partition into upcoming, active, and past based on scheduledAt/expiresAt
  const partitioned = React.useMemo(() => {
    const upcoming = [];
    const active = [];
    const past = [];
    for (const c of challenges) {
      const start = new Date(c.scheduledAt).getTime();
      const end = new Date(c.expiresAt).getTime();
      if (now < start) upcoming.push(c);
      else if (now >= start && now < end) active.push(c);
      else past.push(c);
    }
    return { upcoming, active, past };
  }, [challenges, now]);

  const potentialList = React.useMemo(() => {
    const titles = [
      ...partitioned.upcoming.filter((c) => !c.isBonus).slice(0, 3).map((c) => c.title),
    ];
    if (titles.length >= 3) return titles;
    const filler = ['Campus Dash', 'Quad Sprint', 'Library Ladder'];
    while (titles.length < 3) titles.push(filler[titles.length % filler.length]);
    return titles;
  }, [partitioned.upcoming]);

  useEffect(() => {
    if (!potentialList.length) return;
    const id = setInterval(() => {
      Animated.timing(potOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setPotIndex((i) => (i + 1) % potentialList.length);
        Animated.timing(potOpacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
      });
    }, 2500);
    return () => clearInterval(id);
  }, [potentialList.length]);

  useEffect(() => {
    setPastChallenges(partitioned.past);
  }, [partitioned.past]);

  const formatRemaining = (targetIso) => {
    const ms = new Date(targetIso).getTime() - now;
    if (ms <= 0) return 'Expired';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const hh = hours.toString().padStart(2, '0');
    const mm = minutes.toString().padStart(2, '0');
    const ss = seconds.toString().padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };

  const handleLogout = async () => {
    try { await SecureStore.deleteItemAsync('userToken'); } catch {}
    try { delete API.defaults.headers.common['Authorization']; } catch {}
    try { stopFallbackPoller(); disconnectSocket(); } catch {}
    setUser(null);
    setIsSettingsOpen(false);
    navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
  };

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
          <TouchableOpacity style={styles.headerButton} onPress={() => setIsSettingsOpen(true)}>
            <Ionicons name="settings-sharp" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
          {phase === 'live' && current ? (
            <View style={{ marginBottom: 16 }}>              
              <View style={{ height: 8 }} />
              <ChallengeCard
                title={current.title}
                description={current.description}
                timeRemaining={''}
                timeLabel={'Ends in'}
                targetIso={current.expiresAt}
                disabled={false}
                isLive
                completions={completions}
                imageUrl={current.mediaUrl}
                onSubmit={() => {
                  setActiveChallenge(current);
                  setVideoUri('');
                  setPickedAt(null);
                  setIsSubmitOpen(true);
                }}
              />
            </View>
          ) : (
            <View style={styles.placeholderCard}>
              <Ionicons name="alarm-outline" size={18} color={Colors.grey} style={{ marginRight: 8 }} />
              <StyledText style={{ color: Colors.grey }}>Today's challenge will drop soon. Stay ready.</StyledText>
            </View>
          )}

          {/* Last Challenge Box - placed directly under live/placeholder */}
          <View style={styles.lastCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Ionicons name="trophy-outline" size={18} color={Colors.black} style={{ marginRight: 6 }} />
              <StyledText semibold>Last Challenge</StyledText>
            </View>
            {partitioned.past.length > 0 ? (
              <View>
                <StyledText style={{ color: Colors.black }}>{partitioned.past[partitioned.past.length - 1].title}</StyledText>
                <StyledText style={{ color: Colors.grey, marginTop: 2 }} numberOfLines={2}>
                  {partitioned.past[partitioned.past.length - 1].description}
                </StyledText>
              </View>
            ) : (
              <StyledText style={{ color: Colors.grey }}>No past challenges yet.</StyledText>
            )}
          </View>
          {featuredChallenge && (
            <FeaturedChallengeCard
              title={featuredChallenge.title}
              description={featuredChallenge.description}
              progress={0}
              timeRemaining={formatRemaining(featuredChallenge.expiresAt || new Date())}
              image="https://www.insidehighered.com/sites/default/files/media/iStock-1436447934.jpg"
            />
          )}
          {[ 
            ...partitioned.active.filter((c) => !c.isBonus && (!current || c.id !== current.id)),
            ...partitioned.upcoming.filter((c) => !c.isBonus),
          ].map((challenge) => {
            const isActive = new Date(challenge.scheduledAt).getTime() <= now && new Date(challenge.expiresAt).getTime() > now;
            const timeLabel = isActive ? 'Ends in' : 'Starts in';
            const timeTarget = isActive ? challenge.expiresAt : challenge.scheduledAt;
            return (
              <ChallengeCard
                key={challenge.id}
                title={challenge.title}
                description={challenge.description}
                timeRemaining={formatRemaining(timeTarget)}
                timeLabel={timeLabel}
                targetIso={timeTarget}
                disabled={!isActive}
                isLive={isActive && current && current.id === challenge.id}
                imageUrl={challenge.mediaUrl}
                onSubmit={() => {
                  if (!isActive) return;
                  setActiveChallenge(challenge);
                  setVideoUri('');
                  setPickedAt(null);
                  setIsSubmitOpen(true);
                }}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* Buy-in CTA */}
      <LinearGradient
        colors={[Colors.electricBlue, Colors.lightPurple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.buyInCard}
      >
        <View style={styles.buyInLeft}>
          <View style={styles.buyInTitleRow}>
            <Ionicons name={hasBuyIn ? 'checkmark-circle' : 'flash-outline'} size={18} color={Colors.white} style={{ marginRight: 6 }} />
            <StyledText semibold style={styles.buyInTitle}>
              {hasBuyIn ? "You're in for tomorrow" : 'Buy in by midnight'}
            </StyledText>
          </View>
          <StyledText style={styles.buyInSubtitle}>
            {hasBuyIn ? 'See you on the starting line.' : "Lock your spot for tomorrow's challenge."}
          </StyledText>
          {!hasBuyIn && (
            <View style={styles.buyInCountdownPill}>
              <Ionicons name="time-outline" size={14} color={Colors.white} style={{ marginRight: 6 }} />
              <Countdown style={styles.buyInCountdownText} prefix={'Time left: '} target={midnightIso} />
            </View>
          )}

          {/* Potential challenges carousel */}
          <View style={styles.potentialContainer}>
            <StyledText style={styles.potentialHeader}>Potential challenges</StyledText>
            <Animated.View style={{ opacity: potOpacity }}>
              <StyledText style={styles.potentialItem}>• {potentialList[potIndex]}</StyledText>
            </Animated.View>
          </View>
        </View>
        <TouchableOpacity
          disabled={hasBuyIn || buyInLoading}
          style={[styles.buyInCTA, hasBuyIn && styles.buyInCTAReady, (hasBuyIn || buyInLoading) && { opacity: 0.85 }]}
          onPress={async () => {
            try {
              setBuyInLoading(true);
              const nowDate = new Date();
              const tomorrow = new Date(nowDate.getTime() + 24 * 60 * 60 * 1000);
              const yyyy = tomorrow.getUTCFullYear();
              const mm = String(tomorrow.getUTCMonth() + 1).padStart(2, '0');
              const dd = String(tomorrow.getUTCDate()).padStart(2, '0');
              const dateStr = `${yyyy}-${mm}-${dd}`;
              const campusId = (current?.campusId) || 'clysjrz2u000008l5d2l983s0';
              await createBuyIn({ campusId, date: dateStr, amount: 1 });
              setHasBuyIn(true);
            } catch (e) {
              alert('Failed to buy in');
            } finally {
              setBuyInLoading(false);
            }
          }}
          activeOpacity={0.9}
        >
          <Ionicons name={hasBuyIn ? 'checkmark' : 'rocket-outline'} size={18} color={hasBuyIn ? Colors.white : Colors.deepPurple} style={{ marginRight: 8 }} />
          <StyledText semibold style={[styles.buyInCTAText, hasBuyIn && { color: Colors.white }]}>
            {hasBuyIn ? 'Ready' : 'Buy In $1'}
          </StyledText>
        </TouchableOpacity>
      </LinearGradient>

      {/* Settings Modal */}
      <Modal visible={isSettingsOpen} transparent animationType="slide" onRequestClose={() => setIsSettingsOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.sheetHandle} />
            <View style={styles.settingsHeader}>
              <StyledText semibold style={styles.modalTitle}>Settings</StyledText>
              <TouchableOpacity onPress={() => setIsSettingsOpen(false)} style={styles.closeButton}>
                <Ionicons name="close" size={20} color={Colors.black} />
              </TouchableOpacity>
            </View>
            <View style={styles.settingsList}>
              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsLeft}>
                  <Ionicons name="notifications-outline" size={20} color={Colors.black} />
                  <StyledText style={styles.settingsLabel}>Notifications</StyledText>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.grey} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsLeft}>
                  <Ionicons name="person-outline" size={20} color={Colors.black} />
                  <StyledText style={styles.settingsLabel}>Profile</StyledText>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.grey} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsItem} onPress={handleLogout}>
                <View style={styles.settingsLeft}>
                  <Ionicons name="exit-outline" size={20} color={Colors.black} />
                  <StyledText style={styles.settingsLabel}>Log out</StyledText>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.grey} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
                  console.error('Submit error', e?.response?.status, e?.response?.data || e?.message);
                  alert(`Failed to submit: ${e?.response?.data?.error || e?.message}`);
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
  placeholderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  lastCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  buyInCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 12,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buyInLeft: {
    flex: 1,
    paddingRight: 12,
  },
  buyInTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  buyInTitle: {
    color: Colors.white,
  },
  buyInSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  buyInCountdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  buyInCountdownText: {
    color: Colors.white,
    fontSize: 12,
  },
  buyInCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  buyInCTAReady: {
    backgroundColor: '#22c55e',
  },
  buyInCTAText: {
    color: Colors.deepPurple,
  },
  potentialContainer: {
    marginTop: 10,
  },
  potentialHeader: {
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 6,
    fontSize: 12,
  },
  potentialItem: {
    color: Colors.white,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 16,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    marginBottom: 12,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  closeButton: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
  },
  settingsList: {
    marginTop: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingsItem: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsLabel: {
    fontSize: 16,
    color: Colors.black,
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
  settingRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
