import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../constants/Colors';
import { StyledText } from '../components/StyledText';
import api from '../api/api';
import { getChallenges } from '../services/ChallengeService';

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = String(name).trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? (parts[parts.length - 1][0] || '') : '';
  return (first + last).toUpperCase();
};

const InitialsAvatar = ({ size, name }) => (
  <View style={{
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: Colors.lightPurple,
    borderWidth: 2,
    borderColor: Colors.electricBlue,
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <StyledText semibold style={{ color: Colors.electricBlue, fontSize: size * 0.35 }}>
      {getInitials(name)}
    </StyledText>
  </View>
);

const PodiumItem = ({ user, rank }) => {
  const styles = podiumStyles(rank);
  return (
    <View style={styles.podiumItem}>
      <View style={styles.avatarContainer}>
        <InitialsAvatar size={styles._avatarSize} name={user.name} />
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>{user.rank}</Text>
        </View>
      </View>
      <StyledText medium style={styles.name}>
        {user.name}
      </StyledText>
      <View style={styles.scoreContainer}>
        <StyledText bold style={styles.scoreText}>
          + {user.score}
        </StyledText>
      </View>
    </View>
  );
};

const ListItem = ({ user }) => (
  <View style={styles.listItem}>
    <StyledText medium style={styles.listRank}>
      {user.rank}
    </StyledText>
    <InitialsAvatar size={40} name={user.name} />
    <StyledText regular style={styles.listName}>
      {user.name}
    </StyledText>
    <View style={styles.listScoreContainer}>
      <StyledText bold style={styles.listScoreText}>
        + {user.score}
      </StyledText>
    </View>
  </View>
);

export default function LeaderboardScreen({ navigation }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pastChallenges, setPastChallenges] = useState([]);
  const [showPastModal, setShowPastModal] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // TODO: Replace with dynamic campus ID
        const campusId = 'clysjrz2u000008l5d2l983s0';
        const response = await api.get(`/leaderboard?campusId=${campusId}`);
        setLeaderboardData(response.data);
      } catch (err) {
        setError('Failed to fetch leaderboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Fetch challenges to build Past Challenges list
  useEffect(() => {
    (async () => {
      try {
        const challenges = await getChallenges();
        const past = challenges.filter((c) => new Date(c.expiresAt).getTime() <= Date.now());
        setPastChallenges(past);
      } catch (e) {
        console.log('Failed to fetch challenges for past modal', e?.message);
      }
    })();
  }, []);

  // Timer tick (useful if we later show countdowns here)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const formatDateTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return String(iso);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.deepPurple} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <StyledText>{error}</StyledText>
      </SafeAreaView>
    );
  }
  
  if (leaderboardData.length === 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <StyledText medium style={styles.emptyText}>
          The leaderboard is empty.
        </StyledText>
        <StyledText regular style={styles.emptySubtext}>
          Be the first to complete a challenge!
        </StyledText>
      </SafeAreaView>
    );
  }

  const topThree = leaderboardData.slice(0, 3).sort((a, b) => {
    if (a.rank === 1) return -1;
    if (b.rank === 1) return 1;
    if (a.rank === 2 && b.rank === 3) return -1;
    if (a.rank === 3 && b.rank === 2) return 1;
    return 0;
  });
  const rest = leaderboardData.slice(3);


  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <StyledText black style={styles.headerTitle}>
          Leaderboard
        </StyledText>
        <StyledText regular style={styles.headerSubtitle}>
          Top Ranks in Champaign
        </StyledText>
        <TouchableOpacity
          style={styles.pastBtn}
          onPress={() => setShowPastModal(true)}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Ionicons name="time-outline" size={28} color={Colors.black} />
        </TouchableOpacity>
      </View>

      <View style={styles.podiumContainer}>
        {topThree.map((user) => (
          <PodiumItem key={user.id} user={user} rank={user.rank} />
        ))}
      </View>

      <FlatList
        data={leaderboardData}
        renderItem={({ item }) => <ListItem user={item} />}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Past Challenges Modal */}
      <Modal
        transparent
        visible={showPastModal}
        animationType="slide"
        onRequestClose={() => setShowPastModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeader}>
              <StyledText semibold style={styles.modalTitle}>Past Challenges</StyledText>
              <TouchableOpacity onPress={() => setShowPastModal(false)} style={styles.closeButton}>
                <Ionicons name="close" size={20} color={Colors.black} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
              {pastChallenges.length === 0 && (
                <StyledText style={{ color: Colors.grey }}>No past challenges yet.</StyledText>
              )}
              {pastChallenges.map((c) => (
                <View key={c.id} style={styles.pastItem}>
                  <View style={{ flex: 1 }}>
                    <StyledText semibold style={{ marginBottom: 2 }}>{c.title}</StyledText>
                    <StyledText style={{ color: Colors.grey, fontSize: 12 }}>{c.description}</StyledText>
                  </View>
                  <View style={styles.pastMeta}>
                    <Ionicons name="calendar-outline" size={16} color={Colors.grey} />
                    <StyledText style={styles.pastMetaText}>{formatDateTime(c.expiresAt)}</StyledText>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const podiumStyles = (rank) => {
  let size,
    backgroundColor,
    rankBadgeSize,
    rankBadgePosition,
    nameMarginTop,
    podiumPosition;
  switch (rank) {
    case 1:
      size = 120;
      backgroundColor = Colors.gold;
      rankBadgeSize = 30;
      rankBadgePosition = -5;
      nameMarginTop = 8;
      podiumPosition = { top: 0 };
      break;
    case 2:
      size = 100;
      backgroundColor = Colors.silver;
      rankBadgeSize = 25;
      rankBadgePosition = -5;
      nameMarginTop = 6;
      podiumPosition = { top: 50 };
      break;
    case 3:
      size = 80;
      backgroundColor = Colors.bronze;
      rankBadgeSize = 20;
      rankBadgePosition = -5;
      nameMarginTop = 4;
      podiumPosition = { top: 80 };
      break;
  }

  return StyleSheet.create({
    podiumItem: {
      alignItems: 'center',
      width: '33%',
      ...podiumPosition,
    },
    avatarContainer: {
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 0,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    _avatarSize: size,
    rankBadge: {
      position: 'absolute',
      top: rankBadgePosition,
      right: rankBadgePosition,
      backgroundColor: backgroundColor,
      borderRadius: rankBadgeSize / 2,
      width: rankBadgeSize,
      height: rankBadgeSize,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 6,
    },
    rankText: {
      color: Colors.white,
      fontWeight: 'bold',
      fontSize: rankBadgeSize * 0.6,
    },
    name: {
      color: Colors.black,
      fontSize: 14,
      marginTop: nameMarginTop,
    },
    scoreContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.lightPurple,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 12,
      marginTop: 5,
    },
    scoreText: {
      color: Colors.deepPurple,
    },
  });
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 12,
  },
  pastBtn: {
    position: 'absolute',
    right: 16,
    top: 26,
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 6,
  },
  headerTitle: {
    fontSize: 32,
    color: Colors.black,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.grey,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    height: 300,
    marginTop: 10,
  },
  list: {
    marginTop: 30,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  listRank: {
    color: Colors.black,
    fontSize: 16,
    marginRight: 15,
    width: 24,
    textAlign: 'center',
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  listName: {
    color: Colors.grey,
    fontSize: 16,
    flex: 1,
    marginLeft: 8,
  },
  listScoreContainer: {
    backgroundColor: Colors.lightPurple,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  listScoreText: {
    color: Colors.deepPurple,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.white,
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
  },
  closeButton: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
  },
  pastItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pastMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 12,
  },
  pastMetaText: {
    color: Colors.grey,
    fontSize: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGrey,
  },
  emptyText: {
    fontSize: 20,
    color: Colors.black,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: Colors.grey,
  },
});
