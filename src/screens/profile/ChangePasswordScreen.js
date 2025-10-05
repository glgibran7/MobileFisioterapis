import React, { useState } from 'react';
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

const UbahPasswordScreen = ({ navigation }) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { showToast, showLoading, hideLoading } = useGlobal();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // state untuk toggle mata
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const themeStyles = isDark ? darkStyles : lightStyles;

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast('Semua field wajib diisi', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Password tidak cocok', 'error');
      return;
    }

    showLoading();
    setTimeout(() => {
      hideLoading();
      showToast(
        'Password berhasil diubah',
        'success',
        'Silakan login ulang jika diminta 🔑',
      );
      navigation.goBack();
    }, 2000);
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
      <Header title="Ubah Password" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.form}>
        {renderInput(
          'Password Lama',
          oldPassword,
          setOldPassword,
          showOld,
          setShowOld,
          'Masukkan password lama',
        )}
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

/* Tema Terang */
const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  inputWrapper: { borderColor: '#ddd', backgroundColor: '#f9f9f9' },
  input: { color: '#000' },
  text: { color: '#000' },
});

/* Tema Gelap */
const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#000' },
  inputWrapper: { borderColor: '#444', backgroundColor: '#1e1e1e' },
  input: { color: '#fff' },
  text: { color: '#fff' },
});
