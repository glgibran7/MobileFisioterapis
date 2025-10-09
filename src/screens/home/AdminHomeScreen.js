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
    primary: isDark ? '#fff' : '#000',
    bg: isDark ? '#000' : '#FFF',
    card: isDark ? '#111' : '#F8FAFF',
    text: isDark ? '#FFF' : '#111',
    subText: isDark ? '#AAA' : '#555',
    border: isDark ? '#222' : '#E0E0E0',
    shadow: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.1)',
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
      const res = await Api.get('/admin/stats'); // <-- sesuaikan endpoint kamu
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

  return (
    <>
      <Header
        title="Halo, Admin 👋"
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
        {/* 🧾 Statistik Admin */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.totalUsers}
            </Text>
            <Text style={[styles.statLabel, { color: colors.subText }]}>
              Total Pengguna
            </Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="fitness-outline" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.totalTherapists}
            </Text>
            <Text style={[styles.statLabel, { color: colors.subText }]}>
              Total Terapis
            </Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.totalBookings}
            </Text>
            <Text style={[styles.statLabel, { color: colors.subText }]}>
              Total Booking
            </Text>
          </View>
        </View>

        {/* 📦 Kartu Aksi Admin */}
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
            Kelola Data
          </Text>

          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <TouchableOpacity
                style={[styles.cardBtn, { borderColor: colors.primary }]}
                onPress={() => navigation.navigate('Pengguna')}
              >
                <Ionicons
                  name="people-outline"
                  size={18}
                  color={colors.primary}
                />
                <Text style={[styles.cardBtnText, { color: colors.primary }]}>
                  Lihat Pengguna
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cardBtn, { borderColor: colors.primary }]}
                onPress={() => navigation.navigate('Terapis')}
              >
                <Ionicons
                  name="fitness-outline"
                  size={18}
                  color={colors.primary}
                />
                <Text style={[styles.cardBtnText, { color: colors.primary }]}>
                  Lihat Terapis
                </Text>
              </TouchableOpacity>

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
                  Lihat Booking
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },

  // 📈 Statistik
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, fontWeight: '700', marginTop: 6 },
  statLabel: { fontSize: 13 },

  // 📦 Card
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
    marginBottom: 12,
  },
  cardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    width: '80%',
    justifyContent: 'center',
  },
  cardBtnText: { fontWeight: '600', marginLeft: 8 },
});

export default AdminHomeScreen;
