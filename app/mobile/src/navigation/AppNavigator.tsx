import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { HealthScreen } from '../screens/HealthScreen';
import { AidOverviewScreen } from '../screens/AidOverviewScreen';
import { AidDetailsScreen } from '../screens/AidDetailsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerShown: false,
          // Settings gear accessible from Home via header right
          // (HomeScreen has headerShown: false, so we add a floating button there instead)
        })}
      />
      <Stack.Screen
        name="Health"
        component={HealthScreen}
        options={{ title: 'System Health' }}
      />
      <Stack.Screen
        name="AidOverview"
        component={AidOverviewScreen}
        options={{ title: 'Aid Overview' }}
      />
      <Stack.Screen
        name="AidDetails"
        component={AidDetailsScreen}
        options={{ title: 'Aid Details' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};
