import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminHomeScreen from '../screens/home/AdminHomeScreen';
const Stack = createNativeStackNavigator();

const BookStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminHomeScreen" component={AdminHomeScreen} />
    </Stack.Navigator>
  );
};

export default BookStack;
