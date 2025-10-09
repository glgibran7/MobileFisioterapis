// components/ModalTambahTerapis.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useColorScheme } from 'react-native';
import { useGlobal } from '../../context/GlobalContext';
import Api from '../../utils/Api';

const ModalTambahTerapis = ({ visible, onClose, onSuccess }) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { showToast, showLoading, hideLoading } = useGlobal();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    bio: '',
    experience_years: '',
    specialization: '',
    status_therapist: 'available',
  });

  const colors = {
    background: isDark ? '#111' : '#fff',
    text: isDark ? '#fff' : '#000',
    border: isDark ? '#333' : '#ddd',
    muted: isDark ? '#888' : '#666',
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      showToast('Gagal', 'Nama, Email, dan Password wajib diisi', 'error');
      return;
    }
    try {
      showLoading();
      await Api.post('/therapists', {
        ...form,
        experience_years: parseInt(form.experience_years) || 0,
      });
      hideLoading();
      showToast('Berhasil', 'Terapis berhasil ditambahkan', 'success');
      onSuccess?.();
      onClose();
      setForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        bio: '',
        experience_years: '',
        specialization: '',
        status_therapist: 'available',
      });
    } catch (error) {
      hideLoading();
      console.error(error);
      showToast('Gagal', 'Tidak dapat menambahkan terapis', 'error');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            Tambah Terapis
          </Text>

          {[
            { key: 'name', placeholder: 'Nama' },
            { key: 'email', placeholder: 'Email' },
            { key: 'password', placeholder: 'Password', secure: true },
            { key: 'phone', placeholder: 'Nomor Telepon' },
            { key: 'bio', placeholder: 'Bio' },
            {
              key: 'experience_years',
              placeholder: 'Tahun Pengalaman',
              keyboardType: 'numeric',
            },
            { key: 'specialization', placeholder: 'Spesialisasi' },
          ].map((f, i) => (
            <TextInput
              key={i}
              placeholder={f.placeholder}
              placeholderTextColor={colors.muted}
              value={form[f.key]}
              onChangeText={text => setForm({ ...form, [f.key]: text })}
              secureTextEntry={f.secure}
              keyboardType={f.keyboardType || 'default'}
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.border },
              ]}
            />
          ))}

          <View style={[styles.input, { borderColor: colors.border }]}>
            <Picker
              selectedValue={form.status_therapist}
              onValueChange={v => setForm({ ...form, status_therapist: v })}
              style={{ color: colors.text }}
              dropdownIconColor={colors.text}
            >
              <Picker.Item label="Available" value="available" />
              <Picker.Item label="Busy" value="busy" />
            </Picker>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={[styles.btn, { backgroundColor: '#4CAF50' }]}
              onPress={handleSubmit}
            >
              <Text style={styles.btnText}>Simpan</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, { backgroundColor: '#E53935' }]}
              onPress={onClose}
            >
              <Text style={styles.btnText}>Batal</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ModalTambahTerapis;
