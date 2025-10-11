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
} from 'react-native';
import Header from '../../components/Header';
import Ionicons from '@react-native-vector-icons/ionicons';
import Api from '../../utils/Api';
import { useGlobal } from '../../context/GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReviewModal from './modals/ReviewModal';
import SortModal from './modals/SortModal';
import ReviewDetailModal from './modals/ReviewDetailModal';

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
  // ⭐️ Review Modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState({});
  const [showReviewDetailModal, setShowReviewDetailModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

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
        const bookingsData = res.data.data;
        setBookings(bookingsData);

        // 🔹 Ambil semua review berdasarkan id_review yang ada
        bookingsData.forEach(b => {
          if (b.id_review) fetchReviewDetail(b.id_review, b.id_booking);
        });
      }

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

  const countByStatus = {
    Upcoming: bookings.filter(b => b.status_booking === 'pending').length,
    Accepted: bookings.filter(b => b.status_booking === 'accepted').length,
    Completed: bookings.filter(b => b.status_booking === 'completed').length,
    Rejected: bookings.filter(b => b.status_booking === 'rejected').length,
  };

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

  //  Submit Review
  const handleSubmitReview = () => {
    if (!rating || !comment.trim()) {
      showToast(
        'Perhatian',
        'Isi rating dan komentar terlebih dahulu',
        'error',
      );
      return;
    }

    setShowReviewModal(false);

    setTimeout(async () => {
      showLoading();
      try {
        const res = await Api.post('/reviews', {
          booking_id: selectedBooking?.id_booking,
          rating,
          comment,
        });

        setRating(0);
        setComment('');

        if (res?.data?.status === 'success') {
          const newReview = res.data.data; // berisi id_review, rating, comment, dll

          // Simpan ke state `reviews` agar bisa langsung tampil
          setReviews(prev => ({
            ...prev,
            [selectedBooking.id_booking]: newReview,
          }));

          // Update juga list booking agar tanda has_review = true
          setBookings(prev =>
            prev.map(b =>
              b.id_booking === selectedBooking.id_booking
                ? { ...b, has_review: true, id_review: newReview.id_review }
                : b,
            ),
          );

          showToast('Terima kasih', 'Ulasan berhasil dikirim', 'success');
        } else {
          showToast('Gagal', 'Tidak dapat mengirim ulasan', 'error');
        }
      } catch (err) {
        console.log(err);
        showToast('Error', 'Terjadi kesalahan saat mengirim ulasan', 'error');
      } finally {
        hideLoading();
      }
    }, 300);
  };

  const fetchReviewDetail = async (id_review, bookingId) => {
    try {
      const res = await Api.get(`/reviews/${id_review}`);
      if (res?.data?.status === 'success') {
        setReviews(prev => ({
          ...prev,
          [bookingId]: res.data.data,
        }));
      }
    } catch (err) {
      console.log('Gagal ambil detail review:', err);
    }
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
        {/*  Tombol hapus di pojok kanan atas (hanya di Upcoming) */}
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
        {/*  Tombol aksi */}
        {activeTab === 'Upcoming' && user?.role !== 'user' && (
          <View style={styles.buttonRow}>
            {/* Reject */}
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

            {/* Confirm */}
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
        {/* Tab Accepted */}
        {activeTab === 'Accepted' && (
          <>
            {user?.role === 'user' ? (
              <Text
                style={{
                  marginTop: 12,
                  fontStyle: 'italic',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: isDark ? 'green' : 'green',
                }}
              >
                Booking telah diterima, terapis akan datang ke alamat Anda.
              </Text>
            ) : (
              <View style={styles.buttonRow}>
                {/* Cancel/Delete */}
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
                    style={[
                      styles.btnText,
                      { color: isDark ? '#fff' : '#000' },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                {/* Completed */}
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    { backgroundColor: '#28a745', flexDirection: 'row' },
                  ]}
                  onPress={() =>
                    handleUpdateStatus(item.id_booking, 'completed')
                  }
                >
                  <Ionicons
                    name="checkmark-done-outline"
                    size={18}
                    color="#fff"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.btnText, { color: '#fff' }]}>
                    Completed
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* Completed Tab: tombol beri ulasan */}
        {activeTab === 'Completed' && (
          <>
            {item.id_review || reviews[item.id_booking] ? (
              // Sudah ada review (dari API atau dari state)
              <View
                style={[
                  styles.reviewCard,
                  {
                    backgroundColor: isDark ? '#1c1c1e' : '#f5f5f5',
                    borderColor: isDark ? '#333' : '#ddd',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.reviewTitle,
                    { color: isDark ? '#fff' : '#000' },
                  ]}
                >
                  {user?.role === 'user'
                    ? 'Ulasan Anda'
                    : `Ulasan dari ${item.user_name}`}
                </Text>

                <View style={{ flexDirection: 'row', marginVertical: 6 }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <Ionicons
                      key={i}
                      name={
                        i <= (reviews[item.id_booking]?.rating || 0)
                          ? 'star'
                          : 'star-outline'
                      }
                      size={18}
                      color="#FFD700"
                      style={{ marginRight: 2 }}
                    />
                  ))}
                </View>

                <Text
                  style={[
                    styles.reviewComment,
                    { color: isDark ? '#ccc' : '#333' },
                  ]}
                >
                  “{reviews[item.id_booking]?.comment || 'Tidak ada komentar'}”
                </Text>

                <TouchableOpacity
                  style={{
                    marginTop: 8,
                    paddingVertical: 6,
                    alignSelf: 'flex-end',
                  }}
                  onPress={() => {
                    setSelectedReview(reviews[item.id_booking]);
                    setShowReviewDetailModal(true);
                  }}
                >
                  <Text style={{ color: '#0A84FF', fontWeight: '600' }}>
                    Lihat Review
                  </Text>
                </TouchableOpacity>
              </View>
            ) : user?.role === 'user' ? (
              // 🔹 Jika belum ada review, tampilkan tombol beri ulasan
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  { backgroundColor: '#0A84FF', marginTop: 10 },
                ]}
                onPress={() => {
                  setSelectedBooking(item);
                  setShowReviewModal(true);
                }}
              >
                <Text style={[styles.btnText, { color: '#fff' }]}>
                  Beri Ulasan
                </Text>
              </TouchableOpacity>
            ) : (
              //  Terapis tapi belum ada ulasan
              <Text
                style={{
                  color: isDark ? '#888' : '#555',
                  fontStyle: 'italic',
                  marginTop: 10,
                }}
              >
                Belum ada ulasan dari pasien
              </Text>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
    >
      <Header title="My Bookings" showLocation={false} showBack={false} />

      {/* Search bar + Sort icon */}
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

      {/* Modal */}
      <SortModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        isDark={isDark}
        styles={styles}
      />

      <ReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
        handleSubmitReview={handleSubmitReview}
        isDark={isDark}
        styles={styles}
      />

      <ReviewDetailModal
        visible={showReviewDetailModal}
        onClose={() => setShowReviewDetailModal(false)}
        selectedReview={selectedReview}
        isDark={isDark}
        styles={styles}
      />

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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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

              {countByStatus[tab] > 0 && (
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: activeTab === tab ? '#0A84FF' : '#ccc' },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: activeTab === tab ? '#fff' : '#000' },
                    ]}
                  >
                    {countByStatus[tab]}
                  </Text>
                </View>
              )}
            </View>
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
  reviewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  reviewModalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    elevation: 10,
    alignItems: 'center',
  },
  reviewModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 18,
  },
  reviewStarsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
  },
  reviewInput: {
    width: '100%',
    minHeight: 70,
    borderRadius: 10,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 18,
    textAlignVertical: 'top',
  },
  reviewButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4,
  },
  reviewActionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewCard: {
    marginTop: 10,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
  },
  reviewTitle: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  reviewComment: {
    fontSize: 13,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '85%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeBtn: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default BookScreen;
