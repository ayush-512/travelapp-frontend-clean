// frontend/App.js
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from './src/api/api';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import TripsScreen from './screens/TripsScreen';
import ProfileScreen from './screens/ProfileScreen';
import RecommendationsScreen from './screens/RecommendationsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          await setAuthToken(token);
          setInitialRoute('Trips');
        } else {
          setInitialRoute('Welcome');
        }
      } catch (e) {
        setInitialRoute('Welcome');
      }
    })();
  }, []);

  if (!initialRoute) return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><ActivityIndicator/></View>;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Trips" component={TripsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
