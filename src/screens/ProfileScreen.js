import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';
import { Colors } from '../constants/Colors';
import { StyledText } from '../components/StyledText';
import UserService from '../services/UserService';
import API from '../api/api';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

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
      <TouchableOpacity style={styles.settingsFab} onPress={() => setShowSettings(true)}>
        <Ionicons name="settings-outline" size={20} color={Colors.white} />
      </TouchableOpacity>
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
          <TouchableOpacity onPress={async () => {
            Alert.alert('Change photo', 'Enter a direct image URL to use as your profile background.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Paste URL', onPress: async () => {
                // simple prompt alternative: replace with a proper input UI as needed
                const url = prompt('Image URL');
                if (url) {
                  try {
                    await UserService.updateProfileImage(url);
                    setUser({ ...user, profileImage: url });
                  } catch (e) {
                    Alert.alert('Error', 'Could not update image');
                  }
                }
              }}
            ]);
          }}>
          <StyledText black style={styles.title}>
            {user.name}
          </StyledText>
          </TouchableOpacity>
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
    color: Colors.electricBlue,
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
