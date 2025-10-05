// BookStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TerapisScreen from '../screens/terapis/TerapisScreen';
import TerapisDetailScreen from '../screens/terapis/TerapisDetailScreen';
import BookAppointmentScreen from '../screens/terapis/BookAppointmentScreen';

const Stack = createNativeStackNavigator();

const TerapisStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TerapisScreen" component={TerapisScreen} />
      <Stack.Screen
        name="TerapisDetailScreen"
        component={TerapisDetailScreen}
      />
      <Stack.Screen
        name="BookAppointmentScreen"
        component={BookAppointmentScreen}
      />
    </Stack.Navigator>
  );
};

export default TerapisStack;
