import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { useGlobal } from '../../../context/GlobalContext';
import Api from '../../../utils/Api';

const DEFAULT_ROLE = 'user';

const AddUserModal = ({ visible, onClose, onSuccess }) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { showToast, showLoading, hideLoading } = useGlobal();

  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const handleAddUser = async () => {
    if (!form.name || !form.email || !form.phone) {
      showToast('Semua field wajib diisi', '', 'warning');
      return;
    }

    const body = {
      ...form,
      password: 'user12345',
      role: DEFAULT_ROLE,
    };

    // Tutup modal dulu
    onClose();

    // Tunggu animasi modal tertutup, baru tampilkan spinner
    setTimeout(async () => {
      showLoading('Menambahkan pengguna...');
      try {
        const res = await Api.post('/users', body);
        if (res.data?.status === 'success') {
          showToast('User berhasil ditambahkan', '', 'success');
          setForm({ name: '', email: '', phone: '' });
          onSuccess?.();
        } else {
          showToast('Gagal menambahkan user', '', 'error');
        }
      } catch (err) {
        console.error('Add user error:', err);
        showToast('Terjadi kesalahan saat menambahkan user', '', 'error');
      } finally {
        hideLoading();
      }
    }, 200); // ⏱️ delay 200ms biar modal sempat tertutup
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.container,
            { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
          ]}
        >
          <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
            Tambah Pengguna Baru
          </Text>

          <ScrollView>
            <TextInput
              placeholder="Nama Lengkap"
              placeholderTextColor={isDark ? '#777' : '#999'}
              style={[
                styles.input,
                {
                  color: isDark ? '#fff' : '#000',
                  borderColor: isDark ? '#555' : '#ccc',
                },
              ]}
              value={form.name}
              onChangeText={t => setForm({ ...form, name: t })}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor={isDark ? '#777' : '#999'}
              style={[
                styles.input,
                {
                  color: isDark ? '#fff' : '#000',
                  borderColor: isDark ? '#555' : '#ccc',
                },
              ]}
              value={form.email}
              onChangeText={t => setForm({ ...form, email: t })}
            />
            <TextInput
              placeholder="No HP"
              placeholderTextColor={isDark ? '#777' : '#999'}
              style={[
                styles.input,
                {
                  color: isDark ? '#fff' : '#000',
                  borderColor: isDark ? '#555' : '#ccc',
                },
              ]}
              value={form.phone}
              onChangeText={t => setForm({ ...form, phone: t })}
            />

            <Text style={{ color: isDark ? '#aaa' : '#555', marginBottom: 12 }}>
              Role otomatis: <Text style={{ fontWeight: 'bold' }}>user</Text>
              {'\n'}
              Password default:{' '}
              <Text style={{ fontWeight: 'bold' }}>user12345</Text>
            </Text>

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[
                  styles.cancelBtn,
                  { borderColor: isDark ? '#777' : '#ccc' },
                ]}
                onPress={onClose}
              >
                <Text style={{ color: isDark ? '#fff' : '#000' }}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  { backgroundColor: isDark ? '#4da6ff' : '#007bff' },
                ]}
                onPress={handleAddUser}
              >
                <Text style={{ color: '#fff' }}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    borderRadius: 10,
    padding: 16,
    elevation: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    marginBottom: 12,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 6,
  },
  saveBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 6,
  },
});

export default AddUserModal;
