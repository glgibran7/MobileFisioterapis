import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TerapisHomeScreen from '../screens/home/TerapisHomeScreen';
const Stack = createNativeStackNavigator();
import NotificationScreen from '../components/NotificationScreen';

const TeerapisHomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TerapisHomeScreen" component={TerapisHomeScreen} />
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default TeerapisHomeStack;
