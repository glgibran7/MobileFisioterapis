import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomSpinner from '../components/CustomSpinner';
import logo from '../img/fisiotrapiputih.png';
import backgroundImage from '../img/spalsh/bg.jpg';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        setTimeout(() => {
          if (token) {
            // ✅ Kalau token ada → langsung ke MainScreen
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainScreen' }],
            });
          } else {
            // ❌ Kalau tidak ada token → ke LoginScreen
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            });
          }
        }, 2000); // spinner jalan 2 detik
      } catch (error) {
        console.log('Error checking token:', error);
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        });
      }
    };

    checkLogin();
  }, [navigation]);

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar hidden={true} />
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <CustomSpinner />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.6,
    height: height * 0.4,
    marginBottom: 30,
  },
});

export default SplashScreen;
