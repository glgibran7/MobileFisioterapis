import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native';
import Header from '../../components/Header';
import { useGlobal } from '../../context/GlobalContext';

const PengaturanScreen = ({ navigation }) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const { showToast } = useGlobal();

  const [notifEnabled, setNotifEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(isDark);
  const [language, setLanguage] = useState('id');

  const themeStyles = isDark ? darkStyles : lightStyles;

  const handleSave = () => {
    showToast(
      'Pengaturan disimpan',
      'success',
      'Preferensi berhasil diperbarui 👍',
    );
    navigation.goBack();
  };

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Header title="Pengaturan" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Notifikasi */}
        <View style={styles.settingRow}>
          <Text style={[styles.settingText, themeStyles.text]}>Notifikasi</Text>
          <Switch
            value={notifEnabled}
            onValueChange={setNotifEnabled}
            trackColor={{ false: '#777', true: '#00BFFF' }}
            thumbColor={notifEnabled ? '#fff' : '#ccc'}
          />
        </View>

        {/* Dark Mode (dummy toggle) */}
        <View style={styles.settingRow}>
          <Text style={[styles.settingText, themeStyles.text]}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={val => {
              setDarkMode(val);
              showToast('Dark Mode diubah', 'info');
            }}
            trackColor={{ false: '#777', true: '#00BFFF' }}
            thumbColor={darkMode ? '#fff' : '#ccc'}
          />
        </View>

        {/* Bahasa */}
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => {
            const newLang = language === 'id' ? 'en' : 'id';
            setLanguage(newLang);
            showToast(
              'Bahasa diubah',
              'info',
              `Sekarang: ${newLang.toUpperCase()}`,
            );
          }}
        >
          <Text style={[styles.settingText, themeStyles.text]}>Bahasa</Text>
          <Text style={[styles.valueText, themeStyles.subText]}>
            {language === 'id' ? 'Indonesia' : 'English'}
          </Text>
        </TouchableOpacity>

        {/* Tombol Simpan */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Simpan</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PengaturanScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingText: { fontSize: 16 },
  valueText: { fontSize: 15 },
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
  text: { color: '#000' },
  subText: { color: '#555' },
});

/* Tema Gelap */
const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#000' },
  text: { color: '#fff' },
  subText: { color: '#aaa' },
});
