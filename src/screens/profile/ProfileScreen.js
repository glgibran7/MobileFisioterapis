import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  useColorScheme,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { useGlobal } from '../../context/GlobalContext';
import Header from '../../components/Header';
import Api from '../../utils/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const { showToast, showLoading, hideLoading } = useGlobal();

  const [profile, setProfile] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        showLoading();
        const response = await Api.get('/auth/profile');
        console.log('Profile:', response.data);

        if (response.data?.status === 'success') {
          setProfile({
            name: response.data.data.name,
            email: response.data.data.email,
          });
        } else {
          showToast('Gagal memuat profil', 'error');
        }
      } catch (error) {
        console.log('Profile error:', error.response?.data || error.message);
        showToast('Tidak bisa memuat profil', 'error');
      } finally {
        hideLoading();
      }
    };

    // 🔹 Jalankan setiap kali halaman di-focus kembali
    const unsubscribe = navigation.addListener('focus', fetchProfile);

    // 🔹 Hapus listener saat unmount
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    showLoading();
    try {
      // 🔹 Hapus token & user info
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');

      hideLoading();
      showToast('Berhasil Logout', 'Sampai jumpa lagi 👋', 'success');

      // 🔹 Reset navigasi ke LoginScreen
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    } catch (error) {
      hideLoading();
      console.log('Logout error:', error);
      showToast('Logout gagal', 'error', 'Terjadi kesalahan saat logout');
    }
  };

  const themeStyles = isDark ? darkStyles : lightStyles;

  return (
    <>
      <Header
        title="Profile"
        showLocation={false}
        showBack={false}
        onBack={() => navigation.goBack()}
        showMessage={false}
        onNotificationPress={() => navigation.navigate('NotificationScreen')}
      />
      <ScrollView
        style={[styles.container, themeStyles.container]}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* Profile User */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=12' }} // contoh avatar
            style={styles.avatar}
          />
          <Text style={[styles.name, themeStyles.text]}>{profile.name}</Text>
          <Text style={[styles.email, themeStyles.subText]}>
            {profile.email}
          </Text>
        </View>

        {/* Menu Profile */}
        <View style={styles.menuContainer}>
          <MenuItem
            icon="person-circle-outline"
            label="Edit Profile"
            onPress={() => navigation.navigate('EditProfile')}
            isDark={isDark}
          />
          <MenuItem
            icon="lock-closed-outline"
            label="Ubah Password"
            onPress={() => navigation.navigate('ChangePassword')}
            isDark={isDark}
          />
          <MenuItem
            icon="log-out-outline"
            label="Logout"
            onPress={handleLogout}
            isDark={isDark}
            danger
          />
        </View>
      </ScrollView>
    </>
  );
};

const MenuItem = ({ icon, label, onPress, isDark, danger }) => (
  <TouchableOpacity
    style={[styles.menuItem, { borderBottomColor: isDark ? '#444' : '#ddd' }]}
    onPress={onPress}
  >
    <Ionicons
      name={icon}
      size={22}
      color={danger ? 'red' : isDark ? '#ccc' : '#333'}
      style={{ width: 30 }}
    />
    <Text
      style={[
        styles.menuText,
        { color: danger ? 'red' : isDark ? '#fff' : '#000' },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
  },
  menuContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

/* Tema Terang */
const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  text: { color: '#000' },
  subText: { color: '#555' },
});

/* Tema Gelap */
const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#000' },
  text: { color: '#fff' },
  subText: { color: '#aaa' },
});

export default ProfileScreen;
