import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Header from '../../components/Header';
import { useGlobal } from '../../context/GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../../utils/Api';

const UbahPasswordScreen = ({ navigation }) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { showToast, showLoading, hideLoading } = useGlobal();

  const [idUser, setIdUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // toggle mata password
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const themeStyles = isDark ? darkStyles : lightStyles;

  // 🔹 Ambil id_user dari AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await AsyncStorage.getItem('user');
        if (data) {
          const user = JSON.parse(data);
          setIdUser(user.id_user);
        }
      } catch (error) {
        console.log('Gagal ambil user id:', error);
      }
    };
    loadUser();
  }, []);

  // 🔹 Fungsi ubah password pakai API
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      showToast('Gagal', 'Semua field wajib diisi', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Gagal', 'Password baru tidak cocok', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Gagal', 'Password minimal 6 karakter', 'error');
      return;
    }

    showLoading();
    try {
      const payload = { password: newPassword };
      const response = await Api.put(`/users/${idUser}`, payload);

      if (response.data?.status === 'success') {
        showToast('Berhasil', 'Password berhasil diubah', 'success');
        navigation.goBack();
      } else {
        showToast(
          'Gagal',
          response.data?.message || 'Gagal mengubah password',
          'error',
        );
      }
    } catch (error) {
      console.log(
        'Change password error:',
        error.response?.data || error.message,
      );
      const msg =
        error.response?.data?.message || 'Terjadi kesalahan saat ubah password';
      showToast('Gagal', msg, 'error');
    } finally {
      hideLoading();
    }
  };

  const renderInput = (label, value, setValue, show, setShow, placeholder) => (
    <>
      <Text style={[styles.label, themeStyles.text]}>{label}</Text>
      <View style={[styles.inputWrapper, themeStyles.inputWrapper]}>
        <TextInput
          style={[styles.input, themeStyles.input]}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#aaa' : '#555'}
          secureTextEntry={!show}
          value={value}
          onChangeText={setValue}
        />
        <TouchableOpacity onPress={() => setShow(!show)} style={styles.eyeIcon}>
          <Ionicons
            name={show ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={isDark ? '#ccc' : '#555'}
          />
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Header
        title="Ubah Password"
        showLocation={false}
        showNotification={false}
        showMessage={false}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.form}>
        {renderInput(
          'Password Baru',
          newPassword,
          setNewPassword,
          showNew,
          setShowNew,
          'Masukkan password baru',
        )}
        {renderInput(
          'Konfirmasi Password',
          confirmPassword,
          setConfirmPassword,
          showConfirm,
          setShowConfirm,
          'Ulangi password baru',
        )}

        {/* Tombol Simpan */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleChangePassword}
        >
          <Text style={styles.saveButtonText}>Simpan</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default UbahPasswordScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 20 },
  label: { fontSize: 16, marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  saveButton: {
    backgroundColor: '#00BFFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  inputWrapper: { borderColor: '#ddd', backgroundColor: '#f9f9f9' },
  input: { color: '#000' },
  text: { color: '#000' },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#000' },
  inputWrapper: { borderColor: '#444', backgroundColor: '#1e1e1e' },
  input: { color: '#fff' },
  text: { color: '#fff' },
});
