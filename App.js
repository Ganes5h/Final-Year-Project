
import { StyleSheet, Text, View } from 'react-native';
import * as Font from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from "./components/navigation/BottomTabNavigator";
import React, {useEffect, useState} from "react";
import LoginPage from "./components/auth/LoginPage";
import StartPage from "./components/auth/StartPage";
import RegisterPage from "./components/auth/RegisterPage";
import Developers from "./components/developer/Developers";
import Constants from 'expo-constants';
import fetchUserId from "./components/utilities/FetchUserId";

const apiUrl = Constants.expoConfig.extra.API_URL;

const Stack = createNativeStackNavigator();
SplashScreen.preventAutoHideAsync();

const loadFonts = async () => {
  await Font.loadAsync({
    'Spartan-Regular': require('./assets/fonts/Spartan-Regular.ttf'),
    'Spartan-Bold': require('./assets/fonts/Spartan-Bold.ttf'),
    'Spartan-Medium': require('./assets/fonts/Spartan-Medium.ttf'),
    'Spartan-SemiBold': require('./assets/fonts/Spartan-SemiBold.ttf'), // Load SemiBold if you're using it
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Start');

  useEffect(() => {
    const prepareResources = async () => {
      try {
        // Keep the splash screen visible while loading resources
        await SplashScreen.preventAutoHideAsync();

        // Load fonts and other resources
        await loadFonts();

        // Fetch the user ID
        const userId = await fetchUserId();
        console.log('User ID:', userId);

        // Determine the initial route based on user ID
        if (userId) {
          console.log('User is already logged in, navigating to Main');
          setInitialRoute('Main');
        } else {
          console.log('No user ID found, navigating to Login');
          setInitialRoute('Login');
        }
      } catch (err) {
        console.error('Error during app initialization:', err);
        // Default to Login in case of an error
        setInitialRoute('Login');
      } finally {
        setFontLoaded(true);
        // Hide the splash screen after resources are loaded
        SplashScreen.hideAsync();
      }
    };

    prepareResources();
  }, []);

  // Display a blank screen until resources are loaded
  if (!fontLoaded) {
    return null;
  }

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen
              name="Start"
              component={StartPage}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="Login"
              component={LoginPage}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="Register"
              component={RegisterPage}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="Developers"
              component={Developers}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="Main"
              component={BottomTabNavigator}
              options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
