import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../constants/Colors';
import { StyledText } from '../components/StyledText';
import UserService from '../services/UserService';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Hardcoded user ID for now
        const response = await UserService.getUser('clx9y22gq0000o8t1c3b1a2f3');
        setUser(response.data);
      } catch (error) {
        Alert.alert('Error', 'Could not fetch user data.');
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <SafeAreaView style={styles.screen}>
        <StyledText>Loading...</StyledText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Image
        source={{ uri: 'https://i.pinimg.com/564x/5a/00/c7/5a00c7344079a4dba42294ff41a08620.jpg' }}
        style={styles.profileImage}
      />
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{user.campus.name}</Text>
          </View>
          <StyledText black style={styles.title}>
            {user.name}
          </StyledText>
        </View>
        <StyledText light style={styles.description}>
          I'm a student at {user.campus.name} and I love to code. I'm also a big fan of the Chicago Bulls.
        </StyledText>
        <View style={styles.footer}>
          <View>
            <View style={styles.socialIcons}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/40?u=1' }}
                style={styles.avatar}
              />
              <Image
                source={{ uri: 'https://i.pravatar.cc/40?u=2' }}
                style={[styles.avatar, styles.avatarOverlap]}
              />
              <Image
                source={{ uri: 'https://i.pravatar.cc/40?u=3' }}
                style={[styles.avatar, styles.avatarOverlap]}
              />
            </View>
            <StyledText light style={{textAlign: 'center', marginTop: 4, color: Colors.grey}}>Friends</StyledText>
          </View>
          <View style={styles.actionIcons}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate('History')}
            >
              <Ionicons name="time-outline" size={20} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate('Rewards')}
            >
              <Ionicons name="gift-outline" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  profileImage: {
    width: '100%',
    height: '60%',
    position: 'absolute',
    top: 0,
    opacity: 0.6,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-end',
  },
  titleContainer: {
    marginBottom: 16,
  },
  tag: {
    backgroundColor: Colors.orangeGold,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  tagText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 48,
    color: Colors.deepPurple,
  },
  description: {
    fontSize: 18,
    color: Colors.grey,
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  socialIcons: {
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  avatarOverlap: {
    marginLeft: -15,
  },
  actionIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    backgroundColor: Colors.deepPurple,
    borderRadius: 15,
    padding: 10,
    marginLeft: 12,
  },
});
