import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  ScrollView,
} from 'react-native';
import Header from '../../components/Header';
import { useGlobal } from '../../context/GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../../utils/Api';

const { width } = Dimensions.get('window');

const EditProfileScreen = ({ navigation }) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const { showToast, showLoading, hideLoading } = useGlobal();

  const [idUser, setIdUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const themeStyles = isDark ? darkStyles : lightStyles;

  // 🔹 Ambil data user dari API /auth/profile
  useEffect(() => {
    const fetchProfile = async () => {
      showLoading();
      try {
        const response = await Api.get('/auth/profile');
        if (response.data?.status === 'success') {
          const data = response.data.data;
          setIdUser(data.id_user);
          setName(data.name);
          setEmail(data.email);
          setPhone(data.phone || '');
        } else {
          showToast('Gagal', 'Tidak dapat memuat profil', 'error');
        }
      } catch (error) {
        console.log('Profile error:', error.response?.data || error.message);
        showToast('Gagal', 'Terjadi kesalahan saat memuat profil', 'error');
      } finally {
        hideLoading();
      }
    };

    fetchProfile();
  }, []);

  // 🔹 Simpan perubahan ke /users/{id_user}
  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      showToast('Gagal', 'Nama dan No HP wajib diisi', 'error');
      return;
    }

    showLoading();
    try {
      const payload = { name, phone };
      const response = await Api.put(`/users/${idUser}`, payload);

      if (response.data?.status === 'success') {
        showToast('Berhasil', 'Profil berhasil diperbarui', 'success');

        // Simpan ke AsyncStorage agar sinkron
        const updatedUser = { id_user: idUser, name, email, phone };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

        navigation.goBack();
      } else {
        showToast('Gagal', 'Tidak dapat memperbarui profil', 'error');
      }
    } catch (error) {
      console.log('Edit profile error:', error.response?.data || error.message);
      const msg =
        error.response?.data?.message ||
        'Terjadi kesalahan saat menyimpan data';
      showToast('Gagal', msg, 'error');
    } finally {
      hideLoading();
    }
  };

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Header
        showLocation={false}
        title="Edit Profile"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Nama */}
        <Text style={[styles.label, themeStyles.text]}>Nama</Text>
        <TextInput
          style={[styles.input, themeStyles.input]}
          value={name}
          onChangeText={setName}
        />

        {/* Email (tidak bisa diubah) */}
        <Text style={[styles.label, themeStyles.text]}>Email</Text>
        <TextInput
          style={[styles.input, themeStyles.input, { opacity: 0.6 }]}
          value={email}
          editable={false}
        />

        {/* No HP */}
        <Text style={[styles.label, themeStyles.text]}>No HP</Text>
        <TextInput
          style={[styles.input, themeStyles.input]}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {/* Tombol Simpan */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Simpan</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  label: { fontSize: 14, marginTop: 15, marginBottom: 5 },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#00BFFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  input: { borderColor: '#ddd', backgroundColor: '#f9f9f9', color: '#000' },
  text: { color: '#000' },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#000' },
  input: { borderColor: '#444', backgroundColor: '#1e1e1e', color: '#fff' },
  text: { color: '#fff' },
});
