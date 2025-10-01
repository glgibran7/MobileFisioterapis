// MainScreen.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dimensions, useColorScheme } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import BookStack from './BookStack';
// Sementara pakai HomeScreen sebagai placeholder,
// nanti bisa ganti dengan screen sesuai kebutuhan
const DummyScreen = ({ route }) => {
  return null; // atau bisa return <Text>{route.name}</Text>
};

const Tab = createBottomTabNavigator();
const { height, width } = Dimensions.get('window');

const MainScreen = () => {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'Book':
              iconName = 'calendar-outline';
              break;
            case 'Riwayat':
              iconName = 'time-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: isDark ? '#4da6ff' : '#007BFF',
        tabBarInactiveTintColor: isDark ? '#aaa' : '#888',
        tabBarStyle: {
          height: height * 0.09 + insets.bottom,
          backgroundColor: isDark ? '#000' : '#fff',
          elevation: 5,
          borderTopWidth: 1,
          borderTopColor: isDark ? '#333' : '#ddd',
          paddingBottom: insets.bottom > 0 ? insets.bottom - 4 : 4,
          paddingTop: height * 0.01,
        },
        tabBarLabelStyle: {
          fontSize: width * 0.035,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Book" component={BookStack} />
      <Tab.Screen name="Riwayat" component={DummyScreen} />
      <Tab.Screen name="Profile" component={DummyScreen} />
    </Tab.Navigator>
  );
};

export default MainScreen;
