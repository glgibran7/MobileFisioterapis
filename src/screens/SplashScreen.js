import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomSpinner from '../components/CustomSpinner'; // ✅ Import spinner
import logo from '../img/fisioterapibiru.png'; // ✅ Ganti dengan logo yang sesuai

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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Logo */}
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      {/* Spinner custom */}
      <CustomSpinner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: width * 0.4,
    height: height * 0.2,
    marginBottom: 30,
  },
});

export default SplashScreen;
