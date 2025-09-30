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
import CustomSpinner from '../components/CustomSpinner';
import logo from '../img/fisiotrapiputih.png';
import backgroundImage from '../img/spalsh/bg.jpg';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }], // ✅ arahkan ke Login
      });
    }, 3000); // tampil 3 detik

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Logo */}
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      {/* Spinner custom */}
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
