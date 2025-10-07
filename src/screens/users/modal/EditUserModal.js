import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  useColorScheme,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useGlobal } from '../../../context/GlobalContext';
import Api from '../../../utils/Api';

const EditUserModal = ({ visible, onClose, user, onSuccess }) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { showToast, showLoading, hideLoading } = useGlobal();

  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [password, setPassword] = useState('');

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      showToast('Nama dan Telepon wajib diisi', '', 'warning');
      return;
    }

    // Tutup modal dulu
    onClose();

    // Tunggu animasi modal tertutup (200ms), baru tampilkan spinner
    setTimeout(async () => {
      showLoading('Menyimpan perubahan...');
      try {
        const res = await Api.put(`/users/${user.id_user}`, {
          name,
          phone,
          password: password.trim() || undefined,
        });

        if (res.data?.status === 'success') {
          showToast('Data pengguna berhasil diperbarui', '', 'success');
          onSuccess?.();
        } else {
          showToast('Gagal memperbarui pengguna', '', 'error');
        }
      } catch (err) {
        console.error('Update user error:', err);
        showToast('Terjadi kesalahan saat memperbarui', '', 'error');
      } finally {
        hideLoading();
      }
    }, 200);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.container,
            { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
          ]}
        >
          <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
            Edit Pengguna
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#111' : '#f2f2f2',
                color: isDark ? '#fff' : '#000',
              },
            ]}
            placeholder="Nama"
            placeholderTextColor={isDark ? '#777' : '#999'}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#111' : '#f2f2f2',
                color: isDark ? '#fff' : '#000',
              },
            ]}
            placeholder="Nomor Telepon"
            placeholderTextColor={isDark ? '#777' : '#999'}
            value={phone}
            onChangeText={setPhone}
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#111' : '#f2f2f2',
                color: isDark ? '#fff' : '#000',
              },
            ]}
            placeholder="Password baru (opsional)"
            placeholderTextColor={isDark ? '#777' : '#999'}
            value={password}
            secureTextEntry
            onChangeText={setPassword}
          />

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.btn, { backgroundColor: '#6c757d' }]}
            >
              <Text style={styles.btnText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[
                styles.btn,
                { backgroundColor: isDark ? '#4da6ff' : '#007bff' },
              ]}
            >
              <Text style={styles.btnText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
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
    width: '85%',
    borderRadius: 12,
    padding: 20,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
    textAlign: 'center',
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 15,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  btn: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '600' },
});

export default EditUserModal;
