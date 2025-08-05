import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../constants/Colors';

const leaderboardData = [
  { id: '1', name: 'lilyonetw...', score: 146, rank: 1, avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'josheleve...', score: 105, rank: 2, avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'herotaylo...', score: 99, rank: 3, avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'whitefish664', score: 96, rank: 4, avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'sadpanda176', score: 88, rank: 5, avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: '6', name: 'silverduck204', score: 87, rank: 6, avatar: 'https://i.pravatar.cc/150?u=6' },
  { id: '7', name: 'beautifulmouse112', score: 85, rank: 7, avatar: 'https://i.pravatar.cc/150?u=7' },
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
      <Text style={styles.name}>{user.name}</Text>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>+ {user.score}</Text>
      </View>
      <View style={styles.podiumBase} />
    </View>
  );
};

const ListItem = ({ user }) => (
  <View style={styles.listItem}>
    <Text style={styles.listRank}>{user.rank}</Text>
    <Image source={{ uri: user.avatar }} style={styles.listAvatar} />
    <Text style={styles.listName}>{user.name}</Text>
    <View style={styles.listScoreContainer}>
      <Text style={styles.listScoreText}>+ {user.score}</Text>
    </View>
  </View>
);

export default function LeaderboardScreen({ navigation }) {
    const topThree = leaderboardData.slice(0, 3).sort((a,b) => {
        if(a.rank === 1) return -1;
        if(b.rank === 1) return 1;
        if(a.rank === 2 && b.rank === 3) return -1;
        if(a.rank === 3 && b.rank === 2) return 1;
        return 0;
    });
    const rest = leaderboardData.slice(3);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <View style={{width: 24}}/>
      </View>
      
      <View style={styles.filters}>
        <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
          <Text style={[styles.filterText, styles.activeFilterText]}>Worldwide</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>United States</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Florida</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Zip:</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.podiumContainer}>
        {topThree.map(user => <PodiumItem key={user.id} user={user} rank={user.rank} />)}
      </View>
      
      <FlatList
        data={rest}
        renderItem={({ item }) => <ListItem user={item} />}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </SafeAreaView>
  );
}

const podiumStyles = (rank) => {
    let height, top, backgroundColor, shadowColor;
    switch(rank){
        case 1: height = 150; top = 0; backgroundColor = '#FFD700'; shadowColor = '#E5C100'; break;
        case 2: height = 120; top = 30; backgroundColor = '#C0C0C0'; shadowColor = '#A8A8A8'; break;
        case 3: height = 90;  top = 60; backgroundColor = '#CD7F32'; shadowColor = '#B46F2D'; break;
    }

    return StyleSheet.create({
        podiumItem: {
            alignItems: 'center',
            width: '33%',
            position: 'relative',
        },
        avatarContainer: {
            width: 80,
            height: 80,
            borderRadius: 40,
            borderWidth: 3,
            borderColor: Colors.white,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
            position: 'relative',
            backgroundColor: '#F0F0F0',
        },
        avatar: {
            width: '100%',
            height: '100%',
            borderRadius: 40,
        },
        rankBadge: {
            position: 'absolute',
            top: -5,
            right: -5,
            backgroundColor: backgroundColor,
            borderRadius: 12,
            width: 24,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
        },
        rankText: {
            color: Colors.white,
            fontWeight: 'bold',
        },
        name: {
            color: Colors.black,
            fontWeight: 'bold',
        },
        scoreContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#E0E0E0',
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 12,
            marginTop: 5,
        },
        scoreText: {
            color: '#A957E4',
            fontWeight: 'bold',
        },
        podiumBase: {
            backgroundColor: backgroundColor,
            height: height,
            width: '100%',
            position: 'absolute',
            bottom: -height,
            zIndex: -1,
            borderTopWidth: 5,
            borderTopColor: shadowColor,
            borderLeftWidth: 5,
            borderLeftColor: shadowColor,
            borderRightWidth: 5,
            borderRightColor: shadowColor,
        }
    });
}


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    color: Colors.black,
    fontSize: 20,
    fontWeight: 'bold',
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  activeFilter: {
    backgroundColor: Colors.black,
  },
  filterText: {
    color: Colors.black,
  },
  activeFilterText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    height: 300,
    marginTop: 20,
    position: 'relative',
  },
  list: {
    marginTop: 20,
    backgroundColor: '#F0F0F0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  listRank: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 15,
  },

  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  listName: {
    color: Colors.black,
    fontSize: 16,
    flex: 1,
  },
  listScoreContainer: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  listScoreText: {
    color: '#A957E4',
    fontWeight: 'bold',
  },
});