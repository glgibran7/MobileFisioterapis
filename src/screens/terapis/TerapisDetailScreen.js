import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Header from '../../components/Header';
import Api from '../../utils/Api';
import { useGlobal } from '../../context/GlobalContext';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

const TerapisDetailScreen = ({ route, navigation }) => {
  const { therapist } = route.params;
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { user, showLoading, hideLoading, showToast } = useGlobal();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editVisible, setEditVisible] = useState(false);
  const [editData, setEditData] = useState({
    bio: therapist.bio || '',
    experience_years: parseInt(therapist.experience_years) || '',
    specialization: therapist.specialization || '',
    status_therapist: therapist.status_therapist || 'available',
    working_hours: therapist.working_hours || { start: '', end: '' },
  });
  console.log(therapist);

  const handleEdit = async () => {
    try {
      showLoading();
      await Api.put(`/therapists/${therapist.id_therapist}`, editData);
      hideLoading();
      showToast('Berhasil', 'Data terapis berhasil diperbarui', 'success');
      setEditVisible(false);
      navigation.goBack();
    } catch (error) {
      hideLoading();
      console.error(error);
      showToast('Gagal', 'Tidak dapat memperbarui data terapis', 'error');
    }
  };

  const colors = {
    background: isDark ? '#000' : '#fff',
    card: isDark ? '#111' : '#fff',
    subCard: isDark ? '#1a1a1a' : '#f9f9f9',
    textPrimary: isDark ? '#fff' : '#000',
    textSecondary: isDark ? '#ccc' : '#555',
    textMuted: isDark ? '#999' : '#777',
    accent: isDark ? '#4da6ff' : '#007bff',
    border: isDark ? '#333' : '#ddd',
  };

  const status =
    therapist.status_therapist === 'available'
      ? { label: 'Available', color: '#4CAF50', icon: 'ellipse' }
      : { label: 'Busy', color: '#E53935', icon: 'ellipse' };

  // 🔹 Ambil data review
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await Api.get(
        `/reviews/therapist/${therapist.id_therapist}`,
      );
      setReviews(response.data?.data || []);
    } catch (error) {
      console.error('Gagal memuat review:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // 🔹 Hapus terapis (khusus admin)
  const handleDelete = () => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus terapis ${therapist.name}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              showLoading();
              await Api.delete(`/therapists/${therapist.id_therapist}`);
              hideLoading();
              showToast(
                'Terapis dihapus',
                `${therapist.name} telah dihapus`,
                'success',
              );
              navigation.goBack();
            } catch (error) {
              hideLoading();
              console.error(error);
              showToast('Gagal', 'Tidak dapat menghapus terapis', 'error');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Detail Terapis"
        showBack
        showLocation={false}
        onBack={() => navigation.goBack()}
        showCart={false}
        showMessage
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Profil utama */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colors.card,
              shadowColor: isDark ? '#000' : '#555',
            },
          ]}
        >
          <Image
            source={{
              uri:
                therapist.photo ||
                'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: colors.textPrimary }]}>
              {therapist.name}
            </Text>

            <View style={styles.statusRow}>
              <Ionicons
                name={status.icon}
                size={10}
                color={status.color}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.statusText, { color: status.color }]}>
                {status.label}
              </Text>
            </View>

            <Text
              style={[styles.specialization, { color: colors.textSecondary }]}
            >
              {therapist.specialization || 'Spesialisasi tidak tersedia'}
            </Text>

            <View style={styles.locationRow}>
              <Ionicons
                name="call-outline"
                size={14}
                color={colors.textMuted}
              />
              <Text style={[styles.location, { color: colors.textMuted }]}>
                {therapist.phone || '-'}
              </Text>
            </View>

            <View style={styles.locationRow}>
              <Ionicons
                name="mail-outline"
                size={14}
                color={colors.textMuted}
              />
              <Text style={[styles.location, { color: colors.textMuted }]}>
                {therapist.email || '-'}
              </Text>
            </View>
          </View>
        </View>

        {/* Tombol Hapus (Khusus Admin) */}
        {/* Tombol Aksi Admin */}
        {user?.role === 'admin' && (
          <>
            <TouchableOpacity
              style={[
                styles.deleteBtn,
                { backgroundColor: '#2196F3', marginBottom: 10 },
              ]}
              onPress={() => setEditVisible(true)}
            >
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.deleteBtnText}>Edit Terapis</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.deleteBtn, { backgroundColor: '#E53935' }]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={18} color="#fff" />
              <Text style={styles.deleteBtnText}>Hapus Terapis</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Statistik */}
        <View style={styles.statsRow}>
          {[
            { icon: 'people-outline', label: 'Pasien', value: '2,000+' },
            { icon: 'briefcase-outline', label: 'Experience', value: '10+' },
            {
              icon: 'star-outline',
              label: 'Rating',
              value: therapist.average_rating || 'N/A',
            },
            {
              icon: 'chatbubbles-outline',
              label: 'Reviews',
              value: therapist.total_reviews || 'N/A',
            },
          ].map((item, i) => (
            <View key={i} style={styles.statBox}>
              <Ionicons
                name={item.icon}
                size={22}
                color={colors.accent}
                style={{ marginBottom: 6 }}
              />
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                {item.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Tentang Saya */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Tentang Saya
          </Text>
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            {therapist.bio ||
              'Belum ada biodata. Terapis ini belum menambahkan biodata.'}
          </Text>
        </View>

        {/* Jam Kerja */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Jam Kerja
          </Text>
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            {therapist.working_hours
              ? `${therapist.working_hours.start} - ${therapist.working_hours.end}`
              : 'Belum ada informasi jam kerja.'}
          </Text>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <View style={styles.reviewHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Reviews
            </Text>
            <TouchableOpacity>
              <Text style={[styles.linkText, { color: colors.accent }]}>
                Lihat semua
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator
              size="small"
              color={colors.accent}
              style={{ marginTop: 12 }}
            />
          ) : reviews.length === 0 ? (
            <Text style={{ color: colors.textMuted, marginTop: 10 }}>
              Belum ada review untuk terapis ini.
            </Text>
          ) : (
            reviews.slice(0, 3).map((review, index) => (
              <View
                key={index}
                style={[
                  styles.reviewCard,
                  {
                    backgroundColor: colors.subCard,
                    shadowColor: colors.border,
                  },
                ]}
              >
                <View style={styles.reviewTop}>
                  <Image
                    source={{
                      uri:
                        review.user?.photo ||
                        'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',
                    }}
                    style={styles.reviewAvatar}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.reviewName, { color: colors.textPrimary }]}
                    >
                      {review.user?.user_name || 'Anonim'}
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: 2 }}>
                      {Array(5)
                        .fill(0)
                        .map((_, idx) => (
                          <Ionicons
                            key={idx}
                            name={idx < review.rating ? 'star' : 'star-outline'}
                            size={14}
                            color="#FFD700"
                          />
                        ))}
                    </View>
                  </View>
                </View>
                <Text
                  style={[styles.reviewText, { color: colors.textSecondary }]}
                >
                  {review.comment || '(Tanpa komentar)'}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Tombol Booking - disembunyikan jika admin */}
      {user?.role !== 'admin' && (
        <TouchableOpacity
          style={[styles.bookBtn, { backgroundColor: colors.accent }]}
          onPress={() =>
            navigation.navigate('BookAppointmentScreen', { therapist })
          }
        >
          <Text style={styles.bookBtnText}>Book Appointment</Text>
        </TouchableOpacity>
      )}
      {/* Modal Edit Terapis */}
      <Modal visible={editVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContainer, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Edit Data Terapis
            </Text>

            <TextInput
              style={[
                styles.input,
                { color: colors.textPrimary, borderColor: colors.border },
              ]}
              placeholder="Bio"
              placeholderTextColor={colors.textMuted}
              value={editData.bio}
              onChangeText={text => setEditData({ ...editData, bio: text })}
            />
            <TextInput
              style={[
                styles.input,
                { color: colors.textPrimary, borderColor: colors.border },
              ]}
              placeholder="Tahun Pengalaman"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={String(editData.experience_years)}
              onChangeText={text =>
                setEditData({ ...editData, experience_years: text })
              }
            />
            <TextInput
              style={[
                styles.input,
                { color: colors.textPrimary, borderColor: colors.border },
              ]}
              placeholder="Spesialisasi"
              placeholderTextColor={colors.textMuted}
              value={editData.specialization}
              onChangeText={text =>
                setEditData({ ...editData, specialization: text })
              }
            />
            <View
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 0,
                },
              ]}
            >
              <Picker
                selectedValue={editData.status_therapist}
                style={{ flex: 1, color: colors.textPrimary }}
                dropdownIconColor={colors.textPrimary}
                onValueChange={itemValue =>
                  setEditData({ ...editData, status_therapist: itemValue })
                }
              >
                <Picker.Item label="Available" value="available" />
                <Picker.Item label="Busy" value="busy" />
              </Picker>
            </View>

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <TextInput
                style={[
                  styles.input,
                  {
                    flex: 1,
                    color: colors.textPrimary,
                    borderColor: colors.border,
                    marginRight: 5,
                  },
                ]}
                placeholder="Mulai (09:00)"
                placeholderTextColor={colors.textMuted}
                value={editData.working_hours.start}
                onChangeText={text =>
                  setEditData({
                    ...editData,
                    working_hours: { ...editData.working_hours, start: text },
                  })
                }
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    flex: 1,
                    color: colors.textPrimary,
                    borderColor: colors.border,
                    marginLeft: 5,
                  },
                ]}
                placeholder="Selesai (21:00)"
                placeholderTextColor={colors.textMuted}
                value={editData.working_hours.end}
                onChangeText={text =>
                  setEditData({
                    ...editData,
                    working_hours: { ...editData.working_hours, end: text },
                  })
                }
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: '#4CAF50' }]}
                onPress={handleEdit}
              >
                <Text style={styles.modalBtnText}>Simpan</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: '#E53935' }]}
                onPress={() => setEditVisible(false)}
              >
                <Text style={styles.modalBtnText}>Batal</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: 16 },
  profileCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginBottom: 16,
  },
  avatar: { width: width * 0.22, height: width * 0.22, borderRadius: 12 },
  profileInfo: { marginLeft: 12, flex: 1 },
  name: { fontSize: 17, fontWeight: '700', textTransform: 'capitalize' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusText: { fontSize: 13, fontWeight: '600' },
  specialization: { fontSize: 14, marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  location: { marginLeft: 4, fontSize: 13 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 15, fontWeight: '700' },
  statLabel: { fontSize: 13, marginTop: 2 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  sectionText: { fontSize: 14, lineHeight: 20 },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkText: { fontWeight: '600' },
  reviewCard: {
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    elevation: 3,
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  reviewTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  reviewName: { fontSize: 15, fontWeight: '600' },
  reviewText: { fontSize: 14, lineHeight: 20 },
  bookBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  bookBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontSize: 17, fontWeight: '700', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  modalBtnText: { color: '#fff', fontWeight: '600' },
});

export default TerapisDetailScreen;
