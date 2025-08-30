import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'jotai';
import AppNavigator from './src/navigation/AppNavigator';
import { useCustomFonts } from './src/hooks/use-fonts';
import { ActivityIndicator, View, LogBox } from 'react-native';

LogBox.ignoreLogs([
  'useInsertionEffect must not schedule updates',
  'RemoteTextInput',
]);

export default function App() {
  const fontsLoaded = useCustomFonts();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
