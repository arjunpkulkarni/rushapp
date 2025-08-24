import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../constants/Colors';
import { StyledText } from '../components/StyledText';
import api from '../api/api';

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
      </View>

      <View style={styles.podiumContainer}>
        {topThree.map((user) => (
          <PodiumItem key={user.id} user={user} rank={user.rank} />
        ))}
      </View>

      <FlatList
        data={rest}
        renderItem={({ item }) => <ListItem user={item} />}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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
      nameMarginTop = 12;
      podiumPosition = { top: 0 };
      break;
    case 2:
      size = 100;
      backgroundColor = Colors.silver;
      rankBadgeSize = 25;
      rankBadgePosition = -5;
      nameMarginTop = 10;
      podiumPosition = { top: 50 };
      break;
    case 3:
      size = 80;
      backgroundColor = Colors.bronze;
      rankBadgeSize = 20;
      rankBadgePosition = -5;
      nameMarginTop = 8;
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
    marginTop: 24,
    marginBottom: 12,
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
