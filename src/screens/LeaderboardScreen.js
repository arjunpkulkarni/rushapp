import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../constants/Colors';
import { StyledText } from '../components/StyledText';

const leaderboardData = [
  {
    id: '1',
    name: 'lilyonetw...',
    score: 146,
    rank: 1,
    avatar: 'https://i.pravatar.cc/150?u=1',
  },
  {
    id: '2',
    name: 'josheleve...',
    score: 105,
    rank: 2,
    avatar: 'https://i.pravatar.cc/150?u=2',
  },
  {
    id: '3',
    name: 'herotaylo...',
    score: 99,
    rank: 3,
    avatar: 'https://i.pravatar.cc/150?u=3',
  },
  {
    id: '4',
    name: 'whitefish664',
    score: 96,
    rank: 4,
    avatar: 'https://i.pravatar.cc/150?u=4',
  },
  {
    id: '5',
    name: 'sadpanda176',
    score: 88,
    rank: 5,
    avatar: 'https://i.pravatar.cc/150?u=5',
  },
  {
    id: '6',
    name: 'silverduck204',
    score: 87,
    rank: 6,
    avatar: 'https://i.pravatar.cc/150?u=6',
  },
  {
    id: '7',
    name: 'beautifulmouse112',
    score: 85,
    rank: 7,
    avatar: 'https://i.pravatar.cc/150?u=7',
  },
];

const PodiumItem = ({ user, rank }) => {
  const styles = podiumStyles(rank);
  return (
    <View style={styles.podiumItem}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
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
    <Image source={{ uri: user.avatar }} style={styles.listAvatar} />
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
      borderWidth: 3,
      borderColor: Colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      backgroundColor: '#F0F0F0',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    avatar: {
      width: '100%',
      height: '100%',
      borderRadius: size / 2,
    },
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
});
