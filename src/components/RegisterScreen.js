import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
  useColorScheme,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useGlobal } from '../context/GlobalContext.js';
import Header from './Header.js';

// Import logo terang & gelap
import logoLight from '../img/fisioterapibiru.png';
import logoDark from '../img/fisiotrapiputih.png';

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const { showLoading, hideLoading, showToast } = useGlobal();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeStyles = isDark ? darkStyles : lightStyles;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      showToast('Semua field wajib diisi!', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Password dan konfirmasi tidak sama!', 'error');
      return;
    }

    showLoading();
    setTimeout(() => {
      hideLoading();
      showToast('Registrasi berhasil!', 'success');
      navigation.replace('LoginScreen');
    }, 2000);
  };

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#121212' : '#FFFFFF'}
      />
      <Header
        title="Register"
        showBack={true}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[styles.container, themeStyles.container]}
      >
        <Animated.Image
          source={isDark ? logoDark : logoLight}
          style={[
            styles.logo,
            { opacity: fadeAnim, width: width * 0.9, height: width * 0.5 },
          ]}
          resizeMode="cover"
        />

        <TextInput
          style={[styles.input, themeStyles.input]}
          placeholder="Nama Lengkap"
          placeholderTextColor={isDark ? '#aaa' : '#555'}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, themeStyles.input]}
          placeholder="Email"
          placeholderTextColor={isDark ? '#aaa' : '#555'}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              themeStyles.input,
              { flex: 1, marginVertical: 0 },
            ]}
            placeholder="Password"
            placeholderTextColor={isDark ? '#aaa' : '#555'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPass(!showPass)}
          >
            <Ionicons
              name={showPass ? 'eye-off' : 'eye'}
              size={width * 0.06}
              color={isDark ? '#ccc' : '#333'}
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              themeStyles.input,
              { flex: 1, marginVertical: 0 },
            ]}
            placeholder="Konfirmasi Password"
            placeholderTextColor={isDark ? '#aaa' : '#555'}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPass}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowConfirmPass(!showConfirmPass)}
          >
            <Ionicons
              name={showConfirmPass ? 'eye-off' : 'eye'}
              size={width * 0.06}
              color={isDark ? '#ccc' : '#333'}
            />
          </TouchableOpacity>
        </View>

        {/* Button Register */}
        <LinearGradient
          colors={['#00BFFF', '#063665ff']}
          style={styles.registerButton}
        >
          <TouchableOpacity onPress={handleRegister} style={{ width: '100%' }}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Link ke login */}
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={[styles.switchText, themeStyles.text]}>
            Sudah punya akun? <Text style={styles.link}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05,
  },
  logo: {
    width: width * 0.35,
    height: height * 0.18,
    marginBottom: height * 0.04,
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
  },
  registerButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  registerButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  switchText: {
    fontSize: 14,
  },
  link: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

/* Tema Terang */
const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  input: { borderColor: '#ddd', backgroundColor: '#f9f9f9', color: '#000' },
  text: { color: '#333' },
});

/* Tema Gelap */
const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#121212' },
  input: { borderColor: '#444', backgroundColor: '#1e1e1e', color: '#fff' },
  text: { color: '#fff' },
});

export default RegisterScreen;
