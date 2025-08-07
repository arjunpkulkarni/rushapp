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
import * as SecureStore from 'expo-secure-store';
import { Colors } from '../constants/Colors';
import { StyledText } from '../components/StyledText';
import UserService from '../services/UserService';
import API from '../api/api';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await UserService.getMe();
          setUser(response.data);
        } else {
          navigation.navigate('Onboarding');
        }
      } catch (error) {
        Alert.alert('Error', 'Could not fetch user data.');
        console.error(error);
        navigation.navigate('Onboarding');
      }
    };

    fetchUser();
  }, [navigation]);

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
        source={{ uri: user.profileImage || 'https://i.pinimg.com/564x/5a/00/c7/5a00c7344079a4dba42294ff41a08620.jpg' }}
        style={styles.profileImage}
      />
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          {user.campus && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{user.campus.name}</Text>
            </View>
          )}
          <StyledText black style={styles.title}>
            {user.name}
          </StyledText>
        </View>
        <StyledText light style={styles.description}>
          {user.bio || `I'm a student at ${user.campus?.name}`}
        </StyledText>
        <View style={styles.footer}>
            <View/>
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
