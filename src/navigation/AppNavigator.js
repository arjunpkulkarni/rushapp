import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import HomeScreen from '../screens/HomeScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import FeedScreen from '../screens/FeedScreen';
import HistoryScreen from '../screens/HistoryScreen';
import RewardsScreen from '../screens/RewardsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import { Colors } from '../constants/Colors';
import { StyledText } from '../components/StyledText';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.black,
        tabBarInactiveTintColor: Colors.grey,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.white,
          height: 70,
          paddingBottom: 4,
          paddingTop: 6,
        },
        tabBarItemStyle: { paddingVertical: 0 },
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          let source;
          switch (route.name) {
            case 'Home':
              source = require('../pictures/icons/bet.png');
              break;
            case 'Feed':
              source = require('../pictures/icons/feed.png');
              break;
            case 'Leaderboard':
              source = require('../pictures/icons/leaderboard.png');
              break;
          }
          const tintColor = focused ? Colors.electricBlue : Colors.grey;
          return (
            <Image source={source} style={{ width: 24, height: 24, tintColor }} />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        setInitialRoute(token ? 'Main' : 'Onboarding');
      } catch {
        setInitialRoute('Onboarding');
      }
    })();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Rewards" component={RewardsScreen} />
    </Stack.Navigator>
  );
}
