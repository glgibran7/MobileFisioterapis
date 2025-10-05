import React, { useState } from 'react';
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

const { width } = Dimensions.get('window');

const EditProfileScreen = ({ navigation }) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const { showToast, showLoading, hideLoading } = useGlobal();

  const [name, setName] = useState('Ricardo Kaka');
  const [email, setEmail] = useState('ricardokaka@gmail.com');
  const [phone, setPhone] = useState('081234567890');

  const themeStyles = isDark ? darkStyles : lightStyles;

  const handleSave = () => {
    showLoading(); // tampilkan spinner
    setTimeout(() => {
      hideLoading(); // sembunyikan spinner
      showToast(
        'Profil berhasil diperbarui',
        'success',
        'Data sudah disimpan 👍',
      );
      navigation.goBack();
    }, 2000); // simulasi delay simpan data
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

        {/* Email */}
        <Text style={[styles.label, themeStyles.text]}>Email</Text>
        <TextInput
          style={[styles.input, themeStyles.input]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
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

/* Tema Terang */
const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  input: { borderColor: '#ddd', backgroundColor: '#f9f9f9', color: '#000' },
  text: { color: '#000' },
});

/* Tema Gelap */
const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#000' },
  input: { borderColor: '#444', backgroundColor: '#1e1e1e', color: '#fff' },
  text: { color: '#fff' },
});
