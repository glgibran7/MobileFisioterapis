import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  useColorScheme,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Header from '../../components/Header';
import Api from '../../utils/Api';
import { useGlobal } from '../../context/GlobalContext';

const AdminHomeScreen = () => {
  const navigation = useNavigation();
  const { showLoading, hideLoading } = useGlobal();
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTherapists: 0,
    totalBookings: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
  });

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const colors = {
    bg: isDark ? '#000' : '#FFF',
    card: isDark ? '#111' : '#F8F8F8',
    text: isDark ? '#FFF' : '#000',
    subText: isDark ? '#AAA' : '#555',
    border: isDark ? '#333' : '#DDD',
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  const fetchStats = async () => {
    try {
      showLoading();

      // ✅ Ambil semua data dari masing-masing endpoint
      const [userRes, therapistRes, bookingRes] = await Promise.all([
        Api.get('/users'),
        Api.get('/therapists'),
        Api.get('/bookings'),
      ]);

      const users = userRes.data?.data || [];
      const therapists = therapistRes.data?.data || [];
      const bookings = bookingRes.data?.data || [];

      // ✅ Hitung berdasarkan status booking
      const pending = bookings.filter(
        b => b.status_booking === 'pending',
      ).length;
      const accepted = bookings.filter(
        b => b.status_booking === 'accepted',
      ).length;
      const completed = bookings.filter(
        b => b.status_booking === 'completed',
      ).length;

      setStats({
        totalUsers: users.length,
        totalTherapists: therapists.length,
        totalBookings: bookings.length,
        pending,
        accepted,
        completed,
      });
    } catch (err) {
      console.log('Error fetching stats:', err);
    } finally {
      hideLoading();
    }
  };

  const actionButtons = [
    { label: 'Pengguna', icon: 'people-outline', screen: 'Pengguna' },
    { label: 'Terapis', icon: 'fitness-outline', screen: 'Terapis' },
    { label: 'Booking', icon: 'calendar-outline', screen: 'Book' },
  ];

  return (
    <>
      <Header
        title="Hi, Admin 👋"
        showLocation={false}
        showBack={false}
        showCart={false}
        showMessage={false}
      />

      <ScrollView
        style={[styles.container, { backgroundColor: colors.bg }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.text]}
            progressBackgroundColor={isDark ? '#1A1A1A' : '#FFF'}
            tintColor={colors.text}
          />
        }
      >
        {/* 🧾 Statistik Pengguna & Terapis */}
        <View style={styles.statsRow}>
          {[
            {
              icon: 'people-outline',
              label: 'Total Pengguna',
              value: stats.totalUsers,
            },
            {
              icon: 'fitness-outline',
              label: 'Total Terapis',
              value: stats.totalTherapists,
            },
            {
              icon: 'calendar-outline',
              label: 'Total Booking',
              value: stats.totalBookings,
            },
          ].map((item, index) => (
            <View
              key={index}
              style={[
                styles.statItem,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Ionicons name={item.icon} size={26} color={colors.text} />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {item.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.subText }]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        {/* 📊 Statistik Booking per Status */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Statistik Booking
        </Text>
        <View style={styles.statsRow}>
          {[
            { icon: 'time-outline', label: 'Pending', value: stats.pending },
            {
              icon: 'checkmark-circle-outline',
              label: 'Accepted',
              value: stats.accepted,
            },
            {
              icon: 'trophy-outline',
              label: 'Completed',
              value: stats.completed,
            },
          ].map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.statItem,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Ionicons name={item.icon} size={26} color={colors.text} />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {item.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.subText }]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        {/* 🔧 Kelola Data */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Kelola Data
        </Text>
        <View style={styles.actionsGrid}>
          {actionButtons.map((btn, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.actionBtn,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => navigation.navigate(btn.screen)}
            >
              <Ionicons name={btn.icon} size={26} color={colors.text} />
              <Text style={[styles.actionBtnText, { color: colors.text }]}>
                {btn.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statItem: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
  },
  statValue: { fontSize: 18, fontWeight: '700', marginTop: 6 },
  statLabel: { fontSize: 12, marginTop: 4 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 14,
    marginLeft: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionBtn: {
    width: '48%',
    paddingVertical: 18,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  actionBtnText: { marginTop: 8, fontSize: 15, fontWeight: '600' },
});

export default AdminHomeScreen;
