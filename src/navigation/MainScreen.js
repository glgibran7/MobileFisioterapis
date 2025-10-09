import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Dimensions,
  useColorScheme,
  ActivityIndicator,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeStack from './HomeStack';
import TerapisHomeStack from './TerapisHomeStack';
import AdminHomeStack from './AdminHomeStack';
import BookStack from './BookStack';
import ProfileStack from './ProfileStack';
import TerapisStack from './TerapisStack';
import UsersScreen from '../screens/users/UsersScreen';

const Tab = createBottomTabNavigator();
const { height, width } = Dimensions.get('window');

const MainScreen = () => {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsed = JSON.parse(userData);
          setUserRole(parsed.role);
        }
      } catch (err) {
        console.log('Error reading role:', err);
      } finally {
        setLoading(false);
      }
    };
    getUserRole();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  // 💡 Tentukan komponen Home berdasarkan role
  const getHomeComponent = () => {
    switch (userRole) {
      case 'admin':
        return AdminHomeStack;
      case 'therapist':
        return TerapisHomeStack;
      default:
        return HomeStack;
    }
  };

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
            case 'Terapis':
              iconName = 'fitness-outline';
              break;
            case 'Book':
              iconName = 'calendar-outline';
              break;
            case 'Pengguna':
              iconName = 'people-outline';
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
      {/* Home — tetap satu nama tab, tapi isi berbeda */}
      <Tab.Screen name="Home" component={getHomeComponent()} />
      {/* Hanya untuk admin */}
      {userRole === 'admin' && (
        <Tab.Screen name="Pengguna" component={UsersScreen} />
      )}
      {/* Tab umum */}
      <Tab.Screen name="Terapis" component={TerapisStack} />
      <Tab.Screen name="Book" component={BookStack} />

      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default MainScreen;
