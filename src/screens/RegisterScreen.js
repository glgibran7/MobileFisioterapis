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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useGlobal } from '../context/GlobalContext.js';
import Header from '../components/Header.js';
import Api from '../utils/Api.js';

import logoLight from '../img/fisioterapihitam.png';
import logoDark from '../img/fisiotrapiputih.png';

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isTherapist, setIsTherapist] = useState(false); // ✅ state untuk pilih daftar sebagai terapis

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

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      showToast('Semua field wajib diisi!', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Password dan konfirmasi tidak sama!', 'error');
      return;
    }

    showLoading();
    try {
      // Payload sama untuk semua
      const payload = { name, email, password, phone };

      // Tentukan endpoint sesuai pilihan
      const endpoint = isTherapist
        ? '/auth/register/therapist'
        : '/auth/register';

      const response = await Api.post(endpoint, payload);
      console.log('Register response:', response.data);

      if (response.data?.status === 'success') {
        hideLoading();
        showToast('Registrasi berhasil', 'Silahkan login', 'success');
        navigation.replace('LoginScreen');
      } else {
        hideLoading();
        showToast(
          response.data?.message || 'Registrasi gagal, coba lagi!',
          'error',
        );
      }
    } catch (error) {
      hideLoading();
      console.log('Register error:', error.response?.data || error.message);
      showToast('Terjadi kesalahan saat registrasi!', 'error');
    }
  };

  return (
    <>
      <Header
        title="Register"
        showBack={true}
        onBack={() => navigation.goBack()}
        showLocation={false}
        showNotification={false}
        showMessage={false}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.container, themeStyles.container]}
        >
          <Animated.Image
            source={isDark ? logoDark : logoLight}
            style={[
              styles.logo,
              {
                opacity: fadeAnim,
                width: width * 0.8,
                height: height * 0.2,
              },
            ]}
            resizeMode="cover"
          />

          {/* Input Name */}
          <TextInput
            style={[styles.input, themeStyles.input]}
            placeholder="Nama Lengkap"
            placeholderTextColor={isDark ? '#aaa' : '#555'}
            value={name}
            onChangeText={setName}
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

          {/* Input Phone */}
          <TextInput
            style={[styles.input, themeStyles.input]}
            placeholder="Nomor HP"
            placeholderTextColor={isDark ? '#aaa' : '#555'}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
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

          {/* ✅ Pilihan daftar sebagai terapis (kiri atas, dengan label kecil) */}
          <View style={styles.accountTypeWrapper}>
            <Text style={styles.accountLabel}>Daftar sebagai</Text>

            <View style={styles.toggleRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsTherapist(!isTherapist)}
                style={[
                  styles.toggleSwitch,
                  {
                    backgroundColor: isTherapist ? '#007BFF' : '#ccc',
                    justifyContent: isTherapist ? 'flex-end' : 'flex-start',
                  },
                ]}
              >
                <View style={styles.toggleCircle}>
                  <Ionicons
                    name={isTherapist ? 'medkit-outline' : 'person-outline'}
                    size={20}
                    color={isTherapist ? '#007BFF' : '#555'}
                  />
                </View>
              </TouchableOpacity>

              <Text style={[styles.toggleLabel, themeStyles.text]}>
                {isTherapist ? 'Terapis' : 'Pengguna'}
              </Text>
            </View>
          </View>

          {/* Button Register */}
          <LinearGradient
            colors={['#00BFFF', '#063665ff']}
            style={styles.registerButton}
          >
            <TouchableOpacity
              onPress={handleRegister}
              style={{ width: '100%' }}
            >
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
      </KeyboardAvoidingView>
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
    marginBottom: height * 0.01,
  },
  input: {
    width: '100%',
    padding: 12,
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

  accountTypeWrapper: {
    width: '100%',
    alignItems: 'flex-start', // kiri
    marginTop: 10,
    marginBottom: 10,
  },
  accountLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 6,
    marginLeft: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleSwitch: {
    width: 80,
    height: 38,
    borderRadius: 25,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  toggleCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
  },

  registerButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
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

const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  input: { borderColor: '#ddd', backgroundColor: '#f9f9f9', color: '#000' },
  text: { color: '#333' },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#000' },
  input: { borderColor: '#444', backgroundColor: '#1e1e1e', color: '#fff' },
  text: { color: '#fff' },
});

export default RegisterScreen;
