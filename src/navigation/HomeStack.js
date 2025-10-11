import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import AllCategoryScreen from '../screens/home/AllCategoryScreen';
import AllHealthInfoScreen from '../screens/home/AllHealthInfoScreen';
import DetailInformasiScreen from '../screens/home/DetailInformasiScreen';

const Stack = createNativeStackNavigator();

const BookStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AllCategoryScreen" component={AllCategoryScreen} />
      <Stack.Screen
        name="AllHealthInfoScreen"
        component={AllHealthInfoScreen}
      />
      <Stack.Screen
        name="DetailInformasiScreen"
        component={DetailInformasiScreen}
      />
    </Stack.Navigator>
  );
};

export default BookStack;
