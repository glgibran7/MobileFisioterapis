import React, { useState, useEffect, useRef } from 'react';
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
import CheckBox from '@react-native-community/checkbox';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useGlobal } from '../context/GlobalContext.js';
import { useNavigation } from '@react-navigation/native';

// Import logo terang & gelap
import logoLight from '../img/fisioterapibiru.png';
import logoDark from '../img/fisiotrapiputih.png'; // contoh logo versi dark

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { showLoading, hideLoading, showToast } = useGlobal();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = () => {
    if (email === '' || password === '') {
      showToast('Email atau password kosong!', 'error');
      return;
    }
    showLoading();
    setTimeout(() => {
      hideLoading();
      showToast('Login berhasil!', 'success');
      navigation.replace('MainScreen');
    }, 2000);
  };

  const themeStyles = isDark ? darkStyles : lightStyles;

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#121212' : '#FFFFFF'}
      />
      <ScrollView
        contentContainerStyle={[styles.container, themeStyles.container]}
      >
        <Animated.Image
          source={isDark ? logoDark : logoLight} // Ganti logo sesuai mode
          style={[
            styles.logo,
            { opacity: fadeAnim, width: width * 0.9, height: width * 0.5 },
          ]}
          resizeMode="cover"
        />

        {/* Input Email */}
        <TextInput
          style={[styles.input, themeStyles.input]}
          placeholder="Email"
          placeholderTextColor={isDark ? '#aaa' : '#555'}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Input Password */}
        <View style={[styles.passwordContainer, themeStyles.input]}>
          <TextInput
            style={[styles.passwordInput, { color: isDark ? '#fff' : '#000' }]}
            placeholder="Password"
            placeholderTextColor={isDark ? '#aaa' : '#555'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={22}
              color={isDark ? '#ccc' : '#555'}
            />
          </TouchableOpacity>
        </View>

        {/* Remember Me & Forgot Password */}
        <View style={styles.rememberMeContainer}>
          <CheckBox
            value={rememberMe}
            onValueChange={setRememberMe}
            tintColors={{ true: '#00BFFF', false: isDark ? '#aaa' : '#555' }}
          />
          <Text style={[styles.rememberMeText, themeStyles.text]}>
            Ingat Saya
          </Text>
          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity
              onPress={() => showToast('Fitur lupa password 🚧', 'error')}
            >
              <Text style={styles.forgotPasswordText}>Lupa Password?</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tombol Login */}
        <TouchableOpacity
          style={{ width: '100%' }}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#00BFFF', '#063665ff']}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Register */}
        <View style={styles.registerContainer}>
          <Text style={[styles.registerText, themeStyles.text]}>
            Belum punya akun?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('RegisterScreen')}
          >
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
  },
  eyeIcon: {
    padding: 5,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  rememberMeText: { fontSize: 16, marginLeft: 2 },
  forgotPasswordContainer: { flex: 1, alignItems: 'flex-end' },
  forgotPasswordText: { fontSize: 14, color: '#007BFF' },
  loginButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  loginButtonText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  registerText: { fontSize: 15 },
  registerLink: { fontSize: 15, color: '#007BFF', fontWeight: 'bold' },
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

export default LoginScreen;
