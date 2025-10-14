import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  useColorScheme,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Header from '../../components/Header';
import Api from '../../utils/Api';

const TerapisHomeScreen = () => {
  const navigation = useNavigation();
  const [todayBookings, setTodayBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, belum: 0, terlayani: 0 });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [therapist, setTherapist] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const [editField, setEditField] = useState(null); // field yang sedang diedit
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  const [bookingStats, setBookingStats] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
    completed: 0,
  });

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const colors = {
    primary: isDark ? '#fff' : '#000',
    bg: isDark ? '#000' : '#FFF',
    card: isDark ? '#111' : '#F8FAFF',
    text: isDark ? '#FFF' : '#111',
    subText: isDark ? '#AAA' : '#555',
    border: isDark ? '#222' : '#E0E0E0',
    shadow: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.1)',
  };

  useEffect(() => {
    fetchTherapist();
    fetchBookings();
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    Promise.all([fetchTherapist(), fetchBookings(), fetchStats()]).finally(() =>
      setTimeout(() => setRefreshing(false), 1200),
    );
  };

  /** 🔹 Ambil detail terapis dari /auth/me */
  const fetchTherapist = async () => {
    try {
      const res = await Api.get(`/auth/me`);
      if (res.data?.status === 'success') {
        const data = res.data.data;
        const therapistData = {
          id_user: data.id_user,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          id_therapist: data.therapist_id,
          ...data.therapist_profile,
        };
        setTherapist(therapistData);
      }
    } catch (error) {
      console.log('Fetch therapist error:', error);
    }
  };

  /** 🔹 Ambil semua data booking dan hitung jumlah per status */
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await Api.get('/bookings');
      if (res.data?.status === 'success') {
        const data = res.data.data || [];

        // Hitung berdasarkan status
        const counts = { pending: 0, accepted: 0, rejected: 0, completed: 0 };
        data.forEach(item => {
          if (item.status === 'pending') counts.pending += 1;
          else if (item.status === 'accepted') counts.accepted += 1;
          else if (item.status === 'rejected') counts.rejected += 1;
          else if (item.status === 'completed') counts.completed += 1;
        });

        setBookingStats(counts);
      }
    } catch (error) {
      console.log('Fetch bookings error:', error);
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Ambil statistik pasien */
  const fetchStats = async () => {
    try {
      const res = await Api.get(`/auth/me`);
      if (res.data?.status === 'success') {
        const profile = res.data.data.therapist_profile || {};
        setStats({
          total: profile.total_patients || 0,
          belum: profile.unserved_patients || 0,
          terlayani: profile.served_patients || 0,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  /** 🔹 Ubah status dari dropdown */
  const toggleStatusDropdown = async newStatus => {
    if (!therapist) return;
    setUpdatingStatus(true);
    try {
      const res = await Api.put(`/therapists/${therapist.id_user}/status`, {
        status_therapist: newStatus,
      });
      if (res.data?.status === 'success') {
        setTherapist(prev => ({
          ...prev,
          status_therapist: newStatus,
        }));
      } else {
        Alert.alert('Gagal', 'Tidak dapat mengubah status.');
      }
    } catch (error) {
      console.log('Error ubah status:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat mengubah status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const openEditModal = (field, currentValue) => {
    setEditField(field);
    setEditValue(currentValue || '');
  };

  console.log(therapist);

  const handleSaveEdit = async () => {
    if (!therapist?.id_therapist) {
      Alert.alert('Error', 'ID therapist tidak ditemukan');
      return;
    }

    setSaving(true);
    try {
      let payload = {};

      if (editField === 'working_hours') {
        payload = {
          working_hours: {
            start: editValue.start || '',
            end: editValue.end || '',
          },
        };
      } else {
        payload[editField] =
          editField === 'experience_years'
            ? parseInt(editValue) || 0
            : editValue;
      }

      const res = await Api.put(
        `/therapists/${therapist.id_therapist}`,
        payload,
      );

      if (res.data?.status === 'success') {
        setTherapist(prev => ({
          ...prev,
          ...payload,
        }));
        Alert.alert('Berhasil', 'Data berhasil diperbarui!');
      } else {
        Alert.alert('Gagal', 'Tidak dapat memperbarui data.');
      }
    } catch (error) {
      console.log('Error update:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat memperbarui data.');
    } finally {
      setSaving(false);
      setEditField(null);
    }
  };

  return (
    <>
      <Header
        title="Halo, Terapis 👋"
        showLocation={false}
        showBack={false}
        showCart={false}
        showMessage={false}
        onNotificationPress={() => navigation.navigate('NotificationScreen')}
      />

      <ScrollView
        style={[styles.container, { backgroundColor: colors.bg }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            progressBackgroundColor={isDark ? '#1A1A1A' : '#fff'}
            tintColor={colors.primary}
          />
        }
      >
        {/* 🧑‍⚕️ Profil Terapis */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <Image
            source={{
              uri:
                therapist?.photo ||
                'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            }}
            style={styles.avatar}
          />

          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: colors.text }]}>
              {therapist?.name || 'Nama Terapis'}
            </Text>

            {/* 🔹 Status Aktif (Dropdown) */}
            <TouchableOpacity
              onPress={() => setShowStatusDropdown(prev => !prev)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 4,
              }}
            >
              <Ionicons
                name="ellipse"
                size={10}
                color={
                  therapist?.status_therapist === 'available'
                    ? '#4CAF50'
                    : '#F44336'
                }
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      therapist?.status_therapist === 'available'
                        ? '#4CAF50'
                        : '#F44336',
                  },
                ]}
              >
                {therapist?.status_therapist === 'available'
                  ? 'Available'
                  : 'Busy'}
              </Text>
              <Ionicons
                name={showStatusDropdown ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={
                  therapist?.status_therapist === 'available'
                    ? '#4CAF50'
                    : '#F44336'
                }
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>

            {/* 🔽 Dropdown pilihan status */}
            {showStatusDropdown && (
              <View
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                  marginTop: 6,
                  overflow: 'hidden',
                  alignSelf: 'flex-start',
                }}
              >
                {['available', 'busy'].map(status => (
                  <TouchableOpacity
                    key={status}
                    onPress={async () => {
                      setShowStatusDropdown(false);
                      if (therapist?.status_therapist !== status) {
                        await toggleStatusDropdown(status);
                      }
                    }}
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      backgroundColor:
                        therapist?.status_therapist === status
                          ? colors.border
                          : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 13,
                        textTransform: 'capitalize',
                      }}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {updatingStatus && (
              <ActivityIndicator
                color={colors.text}
                size="small"
                style={{ marginTop: 4 }}
              />
            )}

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.specialty, { color: colors.subText }]}>
                {therapist?.specialization || 'Spesialisasi tidak tersedia'}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  openEditModal('specialization', therapist?.specialization)
                }
              >
                <Ionicons
                  name="create-outline"
                  size={16}
                  color={colors.primary}
                  style={{ marginLeft: 6 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* 📊 Statistik */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={22} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              2,000+
            </Text>
            <Text style={[styles.statLabel, { color: colors.subText }]}>
              Pasien
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="briefcase-outline"
              size={22}
              color={colors.primary}
            />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {therapist?.experience_years || 'N/A'}
            </Text>
            <TouchableOpacity
              onPress={() =>
                openEditModal(
                  'experience_years',
                  String(therapist?.experience_years || ''),
                )
              }
            >
              <Ionicons
                name="create-outline"
                size={16}
                color={colors.primary}
              />
            </TouchableOpacity>
            <Text style={[styles.statLabel, { color: colors.subText }]}>
              Experience
            </Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="star-outline" size={22} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {therapist?.average_rating || 'N/A'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.subText }]}>
              Rating
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="chatbubbles-outline"
              size={22}
              color={colors.primary}
            />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {therapist?.total_reviews || 'N/A'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.subText }]}>
              Reviews
            </Text>
          </View>
        </View>
        {/* 🧾 Tentang Saya */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Tentang Saya
          </Text>
          <TouchableOpacity
            onPress={() => openEditModal('bio', therapist?.bio)}
          >
            <Ionicons name="create-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.sectionText, { color: colors.subText }]}>
          {therapist?.bio
            ? therapist.bio
            : 'Belum ada biodata. Terapis ini belum menambahkan biodata.'}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={[styles.sectionTitle, { color: colors.text, marginTop: 14 }]}
          >
            Jam Kerja
          </Text>
          <TouchableOpacity
            onPress={() =>
              openEditModal(
                'working_hours',
                `${therapist?.working_hours?.start || ''}-${
                  therapist?.working_hours?.end || ''
                }`,
              )
            }
          >
            <Ionicons name="create-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.sectionText, { color: colors.subText }]}>
          {therapist?.working_hours
            ? `${therapist?.working_hours?.start || ''} - ${
                therapist?.working_hours?.end || ''
              }`
            : 'Belum ada informasi jam kerja.'}
        </Text>
        {/* 📅 Booking Hari Ini */}
        <View style={{ marginTop: 18, marginBottom: 32 }}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text, marginBottom: 12 },
            ]}
          >
            Booking Saya
          </Text>

          <View style={styles.statsGrid}>
            <TouchableOpacity
              style={[
                styles.statModernBox,
                { backgroundColor: isDark ? '#1a1a1a' : '#F2F8FF' },
              ]}
              onPress={() =>
                navigation.navigate('Book', {
                  screen: 'BookScreen',
                  params: { initialTab: 'Upcoming' },
                })
              }
              activeOpacity={0.8}
            >
              <Ionicons name="time-outline" size={28} color="#E74C3C" />
              <Text style={[styles.statModernValue, { color: colors.text }]}>
                {bookingStats.pending}
              </Text>
              <Text style={[styles.statModernLabel, { color: colors.subText }]}>
                Upcoming
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statModernBox,
                { backgroundColor: isDark ? '#1a1a1a' : '#E8F6EF' },
              ]}
              onPress={() =>
                navigation.navigate('Book', {
                  screen: 'BookScreen',
                  params: { initialTab: 'Accepted' },
                })
              }
              activeOpacity={0.8}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={28}
                color="#27AE60"
              />
              <Text style={[styles.statModernValue, { color: colors.text }]}>
                {bookingStats.accepted}
              </Text>
              <Text style={[styles.statModernLabel, { color: colors.subText }]}>
                Accepted
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statModernBox,
                { backgroundColor: isDark ? '#1a1a1a' : '#FFF7E6' },
              ]}
              onPress={() =>
                navigation.navigate('Book', {
                  screen: 'BookScreen',
                  params: { initialTab: 'Rejected' },
                })
              }
              activeOpacity={0.8}
            >
              <Ionicons name="close-circle-outline" size={28} color="#F39C12" />
              <Text style={[styles.statModernValue, { color: colors.text }]}>
                {bookingStats.rejected}
              </Text>
              <Text style={[styles.statModernLabel, { color: colors.subText }]}>
                Rejected
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statModernBox,
                { backgroundColor: isDark ? '#1a1a1a' : '#EAF2FF' },
              ]}
              onPress={() =>
                navigation.navigate('Book', {
                  screen: 'BookScreen',
                  params: { initialTab: 'Completed' },
                })
              }
              activeOpacity={0.8}
            >
              <Ionicons
                name="checkmark-done-outline"
                size={28}
                color="#2980B9"
              />
              <Text style={[styles.statModernValue, { color: colors.text }]}>
                {bookingStats.completed}
              </Text>
              <Text style={[styles.statModernLabel, { color: colors.subText }]}>
                Completed
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={!!editField}
        transparent
        animationType="fade"
        onRequestClose={() => setEditField(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Edit {editField?.replace('_', ' ')}
            </Text>

            {/* 🕐 Kondisi khusus untuk working_hours */}
            {editField === 'working_hours' ? (
              <>
                <TextInput
                  style={[
                    styles.modalInput,
                    { borderColor: colors.border, color: colors.text },
                  ]}
                  value={editValue.start}
                  onChangeText={text =>
                    setEditValue(prev => ({ ...prev, start: text }))
                  }
                  placeholder="Jam mulai (misal 09:00)"
                  placeholderTextColor={colors.subText}
                />
                <TextInput
                  style={[
                    styles.modalInput,
                    {
                      borderColor: colors.border,
                      color: colors.text,
                      marginTop: 8,
                    },
                  ]}
                  value={editValue.end}
                  onChangeText={text =>
                    setEditValue(prev => ({ ...prev, end: text }))
                  }
                  placeholder="Jam selesai (misal 21:00)"
                  placeholderTextColor={colors.subText}
                />
              </>
            ) : (
              <TextInput
                style={[
                  styles.modalInput,
                  { borderColor: colors.border, color: colors.text },
                ]}
                value={editValue}
                onChangeText={setEditValue}
                placeholder="Masukkan nilai baru..."
                placeholderTextColor={colors.subText}
              />
            )}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => setEditField(null)}
                style={[styles.modalBtn, { borderColor: colors.border }]}
              >
                <Text style={{ color: colors.subText }}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveEdit}
                disabled={saving}
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={{ color: isDark ? '#000' : '#fff' }}>
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  profileCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 12 },
  name: { fontSize: 16, fontWeight: '700', textTransform: 'capitalize' },
  specialty: { fontSize: 13, marginTop: 6 },
  statusText: { fontSize: 12, marginLeft: 4 },
  statValue: { fontSize: 16, fontWeight: '700', marginTop: 4 },
  statLabel: { fontSize: 12 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  statItem: { alignItems: 'center', flex: 1 },
  infoSection: { marginTop: 10, marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
  sectionText: { fontSize: 13, lineHeight: 20 },
  card: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  cardCount: { fontSize: 36, fontWeight: 'bold', marginBottom: 8 },
  cardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  cardBtnText: { fontWeight: '600', marginLeft: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  modalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  statBox: {
    width: '47%%',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  statLabel1: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue1: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
    marginTop: 2,
  },
  statModernBox: {
    flex: 1,
    maxWidth: '23%',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
    backgroundColor: 'rgba(255,255,255,0.07)', // efek kaca untuk dark mode
    backdropFilter: 'blur(10px)', // efek blur
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    transform: [{ scale: 1 }],
  },
  statModernBoxPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.95,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statModernValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  statModernLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888',
  },
});

export default TerapisHomeScreen;
