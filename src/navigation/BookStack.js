// BookStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookScreen from '../screens/BookScreen';
import AppointmentScreen from '../screens/AppointmentScreen';

const Stack = createNativeStackNavigator();

const BookStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BookScreen" component={BookScreen} />
      <Stack.Screen name="AppointmentScreen" component={AppointmentScreen} />
    </Stack.Navigator>
  );
};

export default BookStack;
