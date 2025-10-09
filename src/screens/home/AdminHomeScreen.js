import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  useColorScheme,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Header from '../../components/Header';
import Api from '../../utils/Api';

const AdminHomeScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTherapists: 0,
    totalBookings: 0,
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

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats().finally(() => setTimeout(() => setRefreshing(false), 1200));
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await Api.get('/admin/stats');
      if (res.data?.status === 'success') {
        setStats({
          totalUsers: res.data.data.total_users || 0,
          totalTherapists: res.data.data.total_therapists || 0,
          totalBookings: res.data.data.total_bookings || 0,
        });
      }
    } catch (err) {
      console.log('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
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
        {/* <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Statistik
        </Text> */}
        {/* 🧾 Statistik Admin */}
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

        {/* 🔧 Kelola Data */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Kelola Data
        </Text>

        {/* 📦 Grid Tombol Aksi */}
        <View style={styles.actionsGrid}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={colors.text}
              style={{ marginTop: 20 }}
            />
          ) : (
            actionButtons.map((btn, idx) => (
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
            ))
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },

  // Statistik
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

  // Kelola Data
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 14,
    marginLeft: 4,
  },

  // Tombol Aksi
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
