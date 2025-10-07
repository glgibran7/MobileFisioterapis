import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import Header from '../../components/Header';
import Ionicons from '@react-native-vector-icons/ionicons';
import Api from '../../utils/Api';
import { useGlobal } from '../../context/GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const BookScreen = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { showToast, showLoading, hideLoading } = useGlobal();

  const [activeTab, setActiveTab] = useState('Upcoming');
  const [bookings, setBookings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [showSortModal, setShowSortModal] = useState(false);

  // Search & Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    };
    loadUser();
  }, []);

  const fetchBookings = useCallback(async (showLoader = true) => {
    let isMounted = true;
    try {
      if (showLoader) showLoading();
      const res = await Api.get('/bookings');
      if (isMounted && res?.data?.status === 'success') {
        setBookings(res.data.data);
      }
    } catch (err) {
      showToast('Terjadi kesalahan', 'Gagal memuat booking', 'error');
    } finally {
      if (isMounted) {
        if (showLoader) hideLoading();
        setRefreshing(false);
      }
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBookings(false);
  }, [fetchBookings]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleDeleteBooking = async id_booking => {
    Alert.alert(
      'Konfirmasi Pembatalan',
      'Yakin ingin menghapus permintaan booking?',
      [
        { text: 'Tidak', style: 'cancel' },
        {
          text: 'Ya, Batalkan',
          style: 'destructive',
          onPress: async () => {
            try {
              showLoading();
              let res;
              try {
                res = await Api.delete(`/bookings/${id_booking}`);
              } catch (err) {
                if (err.response?.status === 404) {
                  res = await Api.delete('/bookings', { data: { id_booking } });
                } else throw err;
              }
              hideLoading();

              if (res?.data?.status === 'success') {
                showToast('Sukses', 'Booking dibatalkan', 'success');
                fetchBookings(false);
              } else {
                showToast('Gagal', 'Tidak dapat membatalkan', 'error');
              }
            } catch (err) {
              hideLoading();
              showToast('Error', 'Gagal membatalkan booking', 'error');
            }
          },
        },
      ],
    );
  };

  // 🔹 Fungsi dinamis: confirm / reject / dll
  const handleUpdateStatus = async (id_booking, status) => {
    const actionLabel =
      status === 'accepted'
        ? 'konfirmasi'
        : status === 'rejected'
        ? 'tolak'
        : 'ubah status';

    Alert.alert('Konfirmasi Aksi', `Yakin ingin ${actionLabel} booking ini?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Ya, Lanjutkan',
        onPress: async () => {
          try {
            showLoading();
            const res = await Api.put(
              `/bookings/${id_booking}/status?status_booking=${status}`,
            );
            hideLoading();

            if (res?.data?.status === 'success') {
              showToast(
                'Sukses',
                `Booking berhasil di${actionLabel}`,
                'success',
              );
              fetchBookings(false);
            } else {
              showToast('Gagal', `Tidak dapat ${actionLabel}`, 'error');
            }
          } catch (err) {
            hideLoading();
            console.log('Update Status Error:', err.response || err);
            showToast('Error', `Gagal ${actionLabel} booking`, 'error');
          }
        },
      },
    ]);
  };

  // Filter, Search, Sort
  const filteredBookings = bookings
    .filter(b => {
      if (activeTab === 'Upcoming') return b.status_booking === 'pending';
      if (activeTab === 'Accepted') return b.status_booking === 'accepted';
      if (activeTab === 'Completed') return b.status_booking === 'completed';
      if (activeTab === 'Rejected') return b.status_booking === 'rejected';
      return true;
    })
    .filter(b => {
      const q = searchQuery.toLowerCase();
      return (
        b.therapist_name?.toLowerCase().includes(q) ||
        b.user_name?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.booking_time);
      const dateB = new Date(b.booking_time);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  const renderBookingCard = ({ item }) => {
    const dateObj = new Date(item.booking_time);
    const formattedDate = dateObj.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const formattedTime = dateObj.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
            shadowColor: isDark ? '#000' : '#777',
          },
        ]}
      >
        {/* 🔹 Tombol hapus di pojok kanan atas (hanya di Upcoming) */}
        {activeTab === 'Upcoming' && (
          <TouchableOpacity
            style={styles.deleteIconBtn}
            onPress={() => handleDeleteBooking(item.id_booking)}
          >
            <Ionicons
              name="trash-outline"
              size={18}
              color={isDark ? '#fff' : '#b00000'}
            />
          </TouchableOpacity>
        )}

        <Text style={[styles.dateText, { color: '#0A84FF' }]}>
          {formattedDate} - {formattedTime} WITA
        </Text>

        <View style={styles.row}>
          <Image
            source={{
              uri:
                item.therapist_photo ||
                'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            }}
            style={styles.avatar}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text
              style={[styles.name, { color: isDark ? '#fff' : '#000' }]}
              numberOfLines={1}
            >
              {item.therapist_name}
            </Text>
            <Text
              style={[styles.role, { color: isDark ? '#bbb' : '#555' }]}
              numberOfLines={1}
            >
              Pasien: {item.user_name}
            </Text>

            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={14}
                color={isDark ? '#999' : '#777'}
              />
              <Text
                style={[styles.location, { color: isDark ? '#ccc' : '#555' }]}
                numberOfLines={1}
              >
                {item.location || 'Tidak ada lokasi'}
              </Text>
            </View>
          </View>
        </View>

        {item.notes ? (
          <Text
            style={[styles.notes, { color: isDark ? '#aaa' : '#555' }]}
            numberOfLines={2}
          >
            Note: “{item.notes}”
          </Text>
        ) : null}

        {/* 🔹 Tombol aksi */}
        {activeTab === 'Upcoming' && user?.role !== 'user' && (
          <View style={styles.buttonRow}>
            {/* 🔴 Reject */}
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: '#FFD6D6', flexDirection: 'row' },
              ]}
              onPress={() => handleUpdateStatus(item.id_booking, 'rejected')}
            >
              <Ionicons
                name="close-circle-outline"
                size={18}
                color="#b00000"
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.btnText, { color: '#b00000' }]}>Reject</Text>
            </TouchableOpacity>

            {/* 🔵 Confirm */}
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: '#0A84FF', flexDirection: 'row' },
              ]}
              onPress={() => handleUpdateStatus(item.id_booking, 'accepted')}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.btnText, { color: '#fff' }]}>Konfirm</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 🟢 Tab Accepted */}
        {activeTab === 'Accepted' && (
          <View style={styles.buttonRow}>
            {/* 🗑️ Cancel/Delete */}
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: isDark ? '#2C2C2E' : '#E5E5EA' },
              ]}
              onPress={() => handleDeleteBooking(item.id_booking)}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color={isDark ? '#fff' : '#000'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[styles.btnText, { color: isDark ? '#fff' : '#000' }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            {/* ✅ Completed */}
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: '#28a745', flexDirection: 'row' },
              ]}
              onPress={() => handleUpdateStatus(item.id_booking, 'completed')}
            >
              <Ionicons
                name="checkmark-done-outline"
                size={18}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.btnText, { color: '#fff' }]}>Completed</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
    >
      <Header title="My Bookings" showBack={false} />

      {/* 🔍 Search bar + Sort icon */}
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
          placeholder="Cari booking..."
          placeholderTextColor={isDark ? '#777' : '#999'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <TouchableOpacity onPress={() => setShowSortModal(true)}>
          <Ionicons
            name="swap-vertical-outline"
            size={22}
            color={isDark ? '#4da6ff' : '#007bff'}
          />
        </TouchableOpacity>
      </View>

      {/* Modal Sort */}
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

            {[
              { key: 'desc', label: 'Terbaru' },
              { key: 'asc', label: 'Terlama' },
            ].map(option => (
              <TouchableOpacity
                key={option.key}
                style={styles.modalItem}
                onPress={() => {
                  setSortOrder(option.key);
                  setShowSortModal(false);
                }}
              >
                <Text
                  style={{
                    color:
                      sortOrder === option.key
                        ? isDark
                          ? '#4da6ff'
                          : '#007bff'
                        : isDark
                        ? '#fff'
                        : '#000',
                    fontWeight: sortOrder === option.key ? '600' : '400',
                  }}
                >
                  {option.label}
                </Text>
                {sortOrder === option.key && (
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

      {/* Tabs */}
      <View
        style={[
          styles.tabContainer,
          {
            backgroundColor: isDark ? '#000' : '#fff',
            borderBottomColor: isDark ? '#000' : '#fff',
          },
        ]}
      >
        {['Upcoming', 'Accepted', 'Completed', 'Rejected'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={styles.tabItem}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === tab ? '#0A84FF' : isDark ? '#888' : '#555',
                },
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeLine} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredBookings}
        renderItem={renderBookingCard}
        keyExtractor={item => item.id_booking.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? '#fff' : '#000'}
            colors={['#0A84FF']}
          />
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: 'center',
              marginTop: 40,
              color: isDark ? '#999' : '#666',
            }}
          >
            Tidak ada booking {activeTab.toLowerCase()}.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  dateText: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: width * 0.18, height: width * 0.18, borderRadius: 10 },
  name: { fontSize: 16, fontWeight: '700', textTransform: 'capitalize' },
  role: { fontSize: 13, marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  location: { fontSize: 13, marginLeft: 4 },
  notes: { fontSize: 13, fontStyle: 'italic', marginTop: 8 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  btnText: { fontSize: 14, fontWeight: '600' },
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
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  tabItem: { alignItems: 'center', paddingVertical: 6 },
  tabText: { fontSize: 15, fontWeight: '600' },
  activeLine: {
    height: 3,
    backgroundColor: '#0A84FF',
    width: 30,
    borderRadius: 10,
    marginTop: 4,
  },
  deleteIconBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,0,0,0.1)',
    zIndex: 5,
  },
});

export default BookScreen;
