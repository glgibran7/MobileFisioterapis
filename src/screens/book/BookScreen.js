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
  const [user, setUser] = useState(null); // ✅ Tambah state user

  // 🔹 Ambil data user dari AsyncStorage saat screen dibuka
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
      'Apakah kamu yakin ingin membatalkan booking ini?',
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
                  res = await Api.delete('/bookings', {
                    data: { id_booking },
                  });
                } else {
                  throw err;
                }
              }

              hideLoading();

              if (res?.data?.status === 'success') {
                showToast('Sukses', 'Booking berhasil dibatalkan', 'success');
                fetchBookings(false);
              } else {
                showToast('Gagal', 'Tidak dapat membatalkan booking', 'error');
              }
            } catch (err) {
              hideLoading();
              console.error('Delete error:', err);
              showToast(
                'Terjadi Kesalahan',
                'Gagal membatalkan booking',
                'error',
              );
            }
          },
        },
      ],
    );
  };

  const handleConfirmBooking = async id_booking => {
    Alert.alert(
      'Konfirmasi Booking',
      'Apakah kamu yakin ingin mengonfirmasi booking ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Konfirmasi',
          onPress: async () => {
            try {
              showLoading();
              const res = await Api.put(`/bookings/${id_booking}/status`, {
                status_booking: 'accepted',
              });
              hideLoading();

              if (res?.data?.status === 'success') {
                showToast('Sukses', 'Booking telah dikonfirmasi', 'success');
                fetchBookings(false);
              } else {
                showToast(
                  'Gagal',
                  'Tidak dapat mengonfirmasi booking',
                  'error',
                );
              }
            } catch (err) {
              hideLoading();
              console.error('Confirm error:', err);
              showToast(
                'Terjadi Kesalahan',
                'Gagal mengonfirmasi booking',
                'error',
              );
            }
          },
        },
      ],
    );
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'Upcoming') return b.status_booking === 'pending';
    if (activeTab === 'Accepted') return b.status_booking === 'accepted';
    if (activeTab === 'Completed') return b.status_booking === 'completed';
    if (activeTab === 'Canceled') return b.status_booking === 'canceled';
    return true;
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

        {/* Tombol hanya untuk Upcoming & Accepted */}
        {['Upcoming', 'Accepted'].includes(activeTab) && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.cancelBtn,
                { backgroundColor: isDark ? '#2C2C2E' : '#E5E5EA' },
              ]}
              onPress={() => handleDeleteBooking(item.id_booking)}
            >
              <Text
                style={[styles.btnText, { color: isDark ? '#fff' : '#000' }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            {/* ✅ Tampilkan tombol Konfirm hanya jika bukan role 'user' */}
            {user?.role !== 'user' && (
              <TouchableOpacity
                style={[styles.rescheduleBtn, { backgroundColor: '#0A84FF' }]}
                onPress={() => handleConfirmBooking(item.id_booking)}
              >
                <Text style={[styles.btnText, { color: '#fff' }]}>Konfirm</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
    >
      <Header
        title="My Bookings"
        showBack={false}
        showLocation={false}
        showCart={false}
        showMessage={false}
      />

      <View
        style={[
          styles.tabContainer,
          {
            backgroundColor: isDark ? '#000' : '#fff',
            borderBottomColor: isDark ? '#000' : '#fff',
          },
        ]}
      >
        {['Upcoming', 'Accepted', 'Completed', 'Canceled'].map(tab => (
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
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 8,
  },
  rescheduleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 8,
  },
  btnText: { fontSize: 14, fontWeight: '600' },
});

export default BookScreen;
