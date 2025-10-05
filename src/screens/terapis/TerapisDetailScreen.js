import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Header from '../../components/Header';

const { width } = Dimensions.get('window');

const TerapisDetailScreen = ({ route, navigation }) => {
  const { therapist } = route.params;
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

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

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Detail Terapis"
        showBack
        showLocation={false}
        onBack={() => navigation.goBack()}
        showCart={false}
        showMessage={false}
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

            {/* 🔹 Status Terapis */}
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

        {/* Statistik dengan ikon */}
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
              value: therapist.total_reviews || 0,
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
            {therapist.working_hours || 'Belum ada informasi jam kerja.'}
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

          <View
            style={[
              styles.reviewCard,
              { backgroundColor: colors.subCard, shadowColor: colors.border },
            ]}
          >
            <View style={styles.reviewTop}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',
                }}
                style={styles.reviewAvatar}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.reviewName, { color: colors.textPrimary }]}
                >
                  Maria
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 2 }}>
                  {Array(5)
                    .fill(0)
                    .map((_, idx) => (
                      <Ionicons
                        key={idx}
                        name="star"
                        size={14}
                        color="#FFD700"
                      />
                    ))}
                </View>
              </View>
            </View>
            <Text style={[styles.reviewText, { color: colors.textSecondary }]}>
              “Bagus banget, dijelaskan secara rinci, sampai kadang ngobrol jadi
              merasa nyaman banget.”
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Tombol Booking */}
      <TouchableOpacity
        style={[styles.bookBtn, { backgroundColor: colors.accent }]}
        onPress={() =>
          navigation.navigate('BookAppointmentScreen', { therapist })
        }
      >
        <Text style={styles.bookBtnText}>Book Appointment</Text>
      </TouchableOpacity>
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
  avatar: {
    width: width * 0.22,
    height: width * 0.22,
    borderRadius: 12,
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  name: { fontSize: 17, fontWeight: '700', textTransform: 'capitalize' },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
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
});

export default TerapisDetailScreen;
