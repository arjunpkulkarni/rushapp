import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, FlatList, Image, ActivityIndicator } from 'react-native';
import { VideoView } from 'expo-video';
import { StyledText } from '../components/StyledText';
import { Colors } from '../constants/Colors';
import API from '../api/api';

export default function FeedScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // fetch current user to get campusId
        const me = await API.get('/users/me');
        const campusId = me?.data?.campus?.id;
        if (!campusId) {
          setItems([]);
          return;
        }
        const res = await API.get(`/submissions/feed/${campusId}`);
        setItems(res.data?.items || []);
      } catch (e) {
        setError('Failed to load feed');
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
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

  if (!items.length) {
    return (
      <SafeAreaView style={styles.centered}>
        <StyledText medium style={{ fontSize: 18, color: Colors.black }}>Nothing here right now</StyledText>
        <StyledText style={{ color: Colors.grey }}>Check back later</StyledText>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => {
    const mediaUrl = item.mediaUrl.startsWith('http') ? item.mediaUrl : `${API.defaults.baseURL?.replace('/api/v1','')}${item.mediaUrl}`;
    return (
      <View style={styles.post}>
        {/* Post header */}
        <View style={styles.postHeader}>
          <Image source={{ uri: item.user?.profileImage || `https://i.pravatar.cc/150?u=${item.user?.id}` }} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <StyledText semibold style={styles.username}>{item.user?.username || item.user?.name || 'User'}</StyledText>
            <StyledText style={styles.subText}>{item.challenge?.title || 'Challenge'}</StyledText>
          </View>
          <StyledText style={styles.timestamp}>{new Date(item.createdAt).toLocaleDateString()}</StyledText>
        </View>
        {/* Media */}
        <View style={styles.mediaWrapper}>
          <VideoView
            style={styles.media}
            source={{ uri: mediaUrl }}
            nativeControls
            allowsFullscreen
            allowsPictureInPicture
            contentFit="cover"
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <StyledText black style={styles.headerTitle}>Feed</StyledText>
      </View>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.black,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGrey,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  post: {
    backgroundColor: Colors.white,
    marginBottom: 16,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  username: {
    color: Colors.black,
  },
  subText: {
    color: Colors.grey,
    fontSize: 12,
  },
  timestamp: {
    color: Colors.grey,
    fontSize: 12,
  },
  mediaWrapper: {
    width: '100%',
    backgroundColor: Colors.black,
  },
  media: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.black,
  },
});


