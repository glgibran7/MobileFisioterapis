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
  StatusBar,
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

  const fetchTherapist = async () => {
    try {
      const res = await Api.get(`/therapists/me`);
      if (res.data?.status === 'success') {
        setTherapist(res.data.data);
      }
    } catch (error) {
      console.log('Fetch therapist error:', error);
    }
  };

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

  const fetchStats = async () => {
    try {
      const res = await Api.get(`/therapists/me`);
      if (res.data?.status === 'success') {
        const data = res.data.data;
        setStats({
          total: data.total_patients || 0,
          belum: data.unserved_patients || 0,
          terlayani: data.served_patients || 0,
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
        {/* 👋 Greeting
        <Text style={[styles.greeting, { color: colors.text }]}>
          Halo, {therapist?.name || 'Terapis'} 👋
        </Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>
          Selamat datang kembali.
        </Text> */}

        {/* 🧑‍⚕️ Profil Card */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              elevation: isDark ? 0 : 3,
              shadowColor: colors.shadow,
              shadowOpacity: isDark ? 0 : 0.15,
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
            <Text style={[styles.specialty, { color: colors.subText }]}>
              {therapist?.specialization || 'Fisioterapi Muskuloskeletal'}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={14}
                color={colors.subText}
              />
              <Text style={[styles.locationText, { color: colors.subText }]}>
                {therapist?.location || 'Fisioterapi Lombok'}
              </Text>
            </View>
          </View>
        </View>

        {/* 📊 Statistik */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.total}
            </Text>
            <Text style={[styles.statLabel, { color: colors.subText }]}>
              Total Pasien
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="star-outline" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.belum}
            </Text>
            <Text style={[styles.statLabel, { color: colors.subText }]}>
              Belum Terlayani
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="checkmark-done-outline"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.terlayani}
            </Text>
            <Text style={[styles.statLabel, { color: colors.subText }]}>
              Terlayani
            </Text>
          </View>
        </View>

        {/* 📅 Booking Hari Ini */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              elevation: isDark ? 0 : 2,
              shadowColor: colors.shadow,
              shadowOpacity: isDark ? 0 : 0.12,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.primary }]}>
            Booking Masuk
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
  greeting: { fontSize: 22, fontWeight: '700', marginTop: 10 },
  subtitle: { fontSize: 14, marginBottom: 20 },

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
  name: { fontSize: 16, fontWeight: '700' },
  specialty: { fontSize: 13, marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { marginLeft: 4, fontSize: 12 },

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
});

export default TerapisHomeScreen;
