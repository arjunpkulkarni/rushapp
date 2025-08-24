import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, FlatList, Image, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
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
        setItems(res.data || []);
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: item.user?.profileImage || `https://i.pravatar.cc/150?u=${item.user?.id}` }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <StyledText semibold style={{ color: Colors.black }}>{item.user?.username || 'User'}</StyledText>
          <StyledText style={{ color: Colors.grey }}>{new Date(item.createdAt).toLocaleString()}</StyledText>
        </View>
        <TouchableOpacity onPress={() => Linking.openURL(item.mediaUrl.startsWith('http') ? item.mediaUrl : `${API.defaults.baseURL?.replace('/api/v1','')}${item.mediaUrl}`)} style={styles.watchBtn}>
          <StyledText style={{ color: 'white' }}>Watch</StyledText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGrey,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  watchBtn: {
    backgroundColor: Colors.deepPurple,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
});


