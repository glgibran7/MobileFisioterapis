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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Api from '../../utils/Api';
import Ionicons from '@react-native-vector-icons/ionicons';
import Header from '../../components/Header';

const TerapisHomeScreen = () => {
  const navigation = useNavigation();
  const [todayBookings, setTodayBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, belum: 0, terlayani: 0 });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [therapist, setTherapist] = useState(null);

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
    accent: isDark ? '#0A84FF' : '#007AFF',
  };

  useEffect(() => {
    fetchTherapist();
    fetchTodayBookings();
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    Promise.all([fetchTherapist(), fetchTodayBookings(), fetchStats()]).finally(
      () => setTimeout(() => setRefreshing(false), 1200),
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
          ...data.therapist_profile,
        };
        setTherapist(therapistData);
      }
    } catch (error) {
      console.log('Fetch therapist error:', error);
    }
  };

  /** 🔹 Ambil data booking hari ini */
  const fetchTodayBookings = async () => {
    setLoading(true);
    try {
      const res = await Api.get('/bookings/today');
      if (res.data?.status === 'success') setTodayBookings(res.data.data);
    } catch (err) {
      console.log(err);
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

  return (
    <>
      <Header
        title="Halo, Terapis 👋"
        showLocation={false}
        showBack={false}
        showCart={false}
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

            <View
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
                  : 'Tidak Tersedia'}
              </Text>
            </View>

            <Text style={[styles.specialty, { color: colors.subText }]}>
              {therapist?.specialization || 'Spesialisasi tidak tersedia'}
            </Text>
            {/* 
            <Text style={[styles.contact, { color: colors.subText }]}>
              📞 {therapist?.phone || '-'}
            </Text>
            <Text style={[styles.contact, { color: colors.subText }]}>
              ✉️ {therapist?.email || '-'}
            </Text> */}
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
              {therapist?.experience_years || 0}+
            </Text>
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
              {therapist?.total_reviews || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.subText }]}>
              Reviews
            </Text>
          </View>
        </View>

        {/* 🧾 Tentang Saya */}
        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Tentang Saya
          </Text>
          <Text style={[styles.sectionText, { color: colors.subText }]}>
            {therapist?.bio
              ? therapist.bio
              : 'Belum ada biodata. Terapis ini belum menambahkan biodata.'}
          </Text>

          <Text
            style={[styles.sectionTitle, { color: colors.text, marginTop: 14 }]}
          >
            Jam Kerja
          </Text>
          <Text style={[styles.sectionText, { color: colors.subText }]}>
            {therapist?.working_hours || 'Belum ada informasi jam kerja.'}
          </Text>
        </View>

        {/* 📅 Booking Hari Ini */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.primary }]}>
            Booking Masuk Hari Ini
          </Text>
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={[styles.cardCount, { color: colors.primary }]}>
              {todayBookings.length}
            </Text>
          )}
          <TouchableOpacity
            style={[styles.cardBtn, { borderColor: colors.primary }]}
            onPress={() => navigation.navigate('Book')}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color={colors.primary}
            />
            <Text style={[styles.cardBtnText, { color: colors.primary }]}>
              Lihat Daftar Booking
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },

  // 👨‍⚕️ Profil Card
  profileCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 12 },
  name: { fontSize: 16, fontWeight: '700', textTransform: 'capitalize' },
  specialty: { fontSize: 13, marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { marginLeft: 4, fontSize: 12 },

  // 📋 Detail Profil
  detailCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 8 },
  detailItem: { fontSize: 13, marginBottom: 4 },
  label: { fontWeight: '600' },

  // 📈 Statistik
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, fontWeight: '700', marginTop: 6 },
  statLabel: { fontSize: 13 },

  // 📅 Booking Hari Ini
  card: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardCount: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
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
  statusText: {
    fontSize: 12,
    marginLeft: 4,
  },
  contact: {
    fontSize: 12,
    marginTop: 2,
  },

  infoSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 13,
    lineHeight: 20,
  },

  // Override untuk profil agar lebih mirip seperti di SS
  profileCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
  },
});

export default TerapisHomeScreen;
