// UsersScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
  Modal,
  Pressable,
  Alert,
  useColorScheme,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Header from '../../components/Header';
import { useGlobal } from '../../context/GlobalContext';
import Api from '../../utils/Api';
import AddUserModal from './modal/AddUserModal';
import EditUserModal from './modal/EditUserModal';

const { width } = Dimensions.get('window');

const sortOptions = [
  { key: 'name', label: 'Nama (A-Z)' },
  { key: 'role', label: 'Role' },
  { key: 'newest', label: 'Terbaru' },
  { key: 'oldest', label: 'Terlama' },
];

const UsersScreen = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { showToast, showLoading, hideLoading } = useGlobal();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [showSortModal, setShowSortModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // 🚀 Ambil semua user
  const fetchUsers = async () => {
    showLoading('Memuat daftar pengguna...');
    try {
      const res = await Api.get('/users');
      if (res.data?.status === 'success') {
        setUsers(res.data.data);
      } else {
        showToast('Gagal memuat pengguna', '', 'error');
      }
    } catch (err) {
      console.error('Fetch users error:', err);
      showToast('Terjadi kesalahan saat memuat data pengguna', '', 'error');
    } finally {
      hideLoading();
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  // 🗑️ Fungsi hapus user
  const deleteUser = async id_user => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus pengguna ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            showLoading('Menghapus pengguna...');
            try {
              const res = await Api.delete(`/users/${id_user}`);
              if (res.data?.status === 'success') {
                showToast('Pengguna berhasil dihapus', '', 'success');
                fetchUsers();
              } else {
                showToast('Gagal menghapus pengguna', '', 'error');
              }
            } catch (err) {
              console.error('Delete user error:', err);
              showToast(
                'Terjadi kesalahan saat menghapus pengguna',
                '',
                'error',
              );
            } finally {
              hideLoading();
            }
          },
        },
      ],
    );
  };

  // 🔍 Filter dan urutkan
  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()),
  );
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'role') return a.role.localeCompare(b.role);
    if (sortBy === 'newest') return b.id_user - a.id_user;
    if (sortBy === 'oldest') return a.id_user - b.id_user;
    return 0;
  });

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#1a1a1a' : '#fff',
          shadowColor: isDark ? '#000' : '#555',
        },
      ]}
    >
      <Image
        source={{
          uri:
            item.photo ||
            'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        }}
        style={styles.avatar}
      />
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: isDark ? '#fff' : '#000' }]}>
          {item.name}
        </Text>
        <Text style={[styles.email, { color: isDark ? '#aaa' : '#555' }]}>
          {item.email}
        </Text>

        <View
          style={[
            styles.roleBadge,
            {
              backgroundColor:
                item.role === 'admin'
                  ? '#4da6ff'
                  : item.role === 'therapist'
                  ? '#28a745'
                  : '#6c757d',
            },
          ]}
        >
          <Ionicons
            name={
              item.role === 'admin'
                ? 'shield-checkmark-outline'
                : item.role === 'therapist'
                ? 'medkit-outline'
                : 'person-outline'
            }
            size={14}
            color={'#fff'}
            style={{ marginRight: 4 }}
          />
          <Text style={styles.roleText}>{item.role}</Text>
        </View>
      </View>

      {/* ✏️ Edit & 🗑️ Delete Button */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => {
            setSelectedUser(item);
            setShowEditModal(true);
          }}
          style={{ padding: 6 }}
        >
          <Ionicons
            name="create-outline"
            size={22}
            color={isDark ? '#4da6ff' : '#007bff'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deleteUser(item.id_user)}
          style={{ padding: 6 }}
        >
          <Ionicons
            name="trash-outline"
            size={22}
            color={isDark ? '#ff4d4d' : '#dc3545'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
    >
      <Header
        title="Daftar Pengguna"
        showLocation={false}
        showBack={false}
        showMessage={false}
        showNotification={true}
      />

      {/* 🔍 Search bar */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: isDark ? '#111' : '#f9f9f9',
            borderColor: isDark ? '#444' : '#ddd',
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={isDark ? '#ccc' : '#555'}
          style={{ marginRight: 6 }}
        />
        <TextInput
          style={[styles.searchInput, { color: isDark ? '#fff' : '#000' }]}
          placeholder="Cari pengguna"
          placeholderTextColor={isDark ? '#777' : '#999'}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity onPress={() => setShowSortModal(true)}>
          <Ionicons
            name="swap-vertical-outline"
            size={22}
            color={isDark ? '#4da6ff' : '#007bff'}
          />
        </TouchableOpacity>
      </View>

      {/* 📋 List User */}
      <FlatList
        data={sorted}
        renderItem={renderItem}
        keyExtractor={item => item.id_user.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[isDark ? '#4da6ff' : '#007bff']}
            tintColor={isDark ? '#4da6ff' : '#007bff'}
          />
        }
      />

      {/* ⚙️ Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSortModal(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
            ]}
          >
            <Text
              style={[styles.modalTitle, { color: isDark ? '#fff' : '#000' }]}
            >
              Urutkan Berdasarkan
            </Text>
            {sortOptions.map(option => (
              <TouchableOpacity
                key={option.key}
                style={styles.modalItem}
                onPress={() => {
                  setSortBy(option.key);
                  setShowSortModal(false);
                }}
              >
                <Text
                  style={{
                    color:
                      sortBy === option.key
                        ? isDark
                          ? '#4da6ff'
                          : '#007bff'
                        : isDark
                        ? '#fff'
                        : '#000',
                    fontWeight: sortBy === option.key ? '600' : '400',
                  }}
                >
                  {option.label}
                </Text>
                {sortBy === option.key && (
                  <Ionicons
                    name="checkmark-outline"
                    size={18}
                    color={isDark ? '#4da6ff' : '#007bff'}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* ➕ FAB Tambah User */}
      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: isDark ? '#4da6ff' : '#007bff' },
        ]}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add-outline" size={28} color="#fff" />
      </TouchableOpacity>

      {/* 🧍 Modal Tambah User */}
      <AddUserModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchUsers}
      />

      {selectedUser && (
        <EditUserModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={selectedUser}
          onSuccess={fetchUsers}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    margin: 16,
    height: 42,
    justifyContent: 'space-between',
  },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 0 },
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  avatar: { width: width * 0.18, height: width * 0.18, borderRadius: 10 },
  infoContainer: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '700', textTransform: 'capitalize' },
  email: { fontSize: 14, marginTop: 2 },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '75%',
    borderRadius: 10,
    paddingVertical: 14,
    elevation: 8,
  },
  modalTitle: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    width: 56,
    height: 56,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});

export default UsersScreen;
