import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Linking,
} from 'react-native';
// no image picker; avatar will render initials only
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';
import { Colors } from '../constants/Colors';
import { StyledText } from '../components/StyledText';
import UserService from '../services/UserService';
import API from '../api/api';
import { useAtom } from 'jotai';
import { userAtom } from '../state/atoms';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useAtom(userAtom);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) return navigation.navigate('Onboarding');
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await UserService.getMe();
        setUser(response.data);
      } catch (error) {
        console.error(error);
        navigation.navigate('Onboarding');
      }
    };
    if (!user) fetchUser();
  }, [navigation, user, setUser]);

  if (!user) {
    return (
      <SafeAreaView style={styles.screen}>
        <StyledText>Loading...</StyledText>
      </SafeAreaView>
    );
  }

  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? (parts[parts.length - 1][0] || '') : '';
    return (first + last).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <TouchableOpacity style={styles.settingsFab} onPress={() => setShowSettings(true)}>
        <Ionicons name="settings-outline" size={20} color={Colors.white} />
      </TouchableOpacity>
      <View style={styles.avatarWrapper}>
        <View style={styles.avatarCircle}>
          <StyledText semibold style={styles.avatarInitials}>{getInitials(user.name)}</StyledText>
        </View>
      </View>
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
      {showSettings && (
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <StyledText semibold style={{ fontSize: 18, marginBottom: 8 }}>Settings</StyledText>
            <TouchableOpacity style={styles.row} onPress={async () => {
              await SecureStore.deleteItemAsync('userToken');
              setShowSettings(false);
              navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
            }}>
              <StyledText semibold>Log out</StyledText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.row, styles.rowDanger]} onPress={() => {
              Alert.alert('Delete account', 'This cannot be undone. Continue?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: async () => {
                  try {
                    await API.delete('/users/me');
                    await SecureStore.deleteItemAsync('userToken');
                    navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
                  } catch (e) {
                    Alert.alert('Error', 'Could not delete account');
                  }
                } }
              ]);
            }}>
              <StyledText semibold style={{ color: '#d02c2c' }}>Delete account</StyledText>
            </TouchableOpacity>
            <StyledText medium style={styles.cardTitle}>Legal</StyledText>
            <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('https://example.com/terms').catch(() => {})}>
              <StyledText>Terms and Conditions</StyledText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('https://example.com/privacy').catch(() => {})}>
              <StyledText>Privacy Policy</StyledText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.row, { alignItems: 'center' }]} onPress={() => setShowSettings(false)}>
              <StyledText>Close</StyledText>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  avatarWrapper: {
    width: '100%',
    height: '50%',
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.lightPurple,
    borderWidth: 2,
    borderColor: Colors.electricBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: Colors.electricBlue,
    fontSize: 48,
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
    color: Colors.electricBlue,
  },
  changePhotoBtn: {
    backgroundColor: Colors.electricBlue,
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  description: {
    fontSize: 18,
    color: Colors.grey,
    marginBottom: 24,
  },
  settingsFab: {
    position: 'absolute',
    top: 66,
    right: 16,
    zIndex: 10,
    backgroundColor: Colors.deepPurple,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  row: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  rowDanger: {
    borderTopColor: '#f2d6d6',
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
    backgroundColor: Colors.electricBlue,
    borderRadius: 15,
    padding: 10,
    marginLeft: 12,
  },
});
