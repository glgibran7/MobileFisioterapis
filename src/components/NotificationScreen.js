// File: src/screens/NotificationScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  useColorScheme,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Header from '../components/Header'; // sesuaikan path-nya
import Api from '../utils/Api'; // opsional kalau mau ambil data dari backend

const { width } = Dimensions.get('window');

const NotificationScreen = ({ navigation }) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // contoh dummy data, ganti dengan API call kalau sudah ada endpoint
      // const res = await Api.get('/notifications');
      const res = [
        {
          id: 1,
          title: 'Booking diterima',
          message: 'Terapis Anda telah menerima booking hari ini.',
          date: '2025-10-13 14:30',
          type: 'success',
        },
        {
          id: 2,
          title: 'Promo Spesial!',
          message: 'Dapatkan diskon 20% untuk pemesanan berikutnya.',
          date: '2025-10-12 10:15',
          type: 'promo',
        },
        {
          id: 3,
          title: 'Pembatalan Booking',
          message: 'Booking Anda telah dibatalkan oleh terapis.',
          date: '2025-10-10 08:45',
          type: 'warning',
        },
      ];
      setNotifications(res);
    } catch (error) {
      console.error('Gagal ambil notifikasi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications().finally(() => setRefreshing(false));
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}
      activeOpacity={0.8}
    >
      <View style={styles.iconWrapper}>
        <Ionicons
          name={
            item.type === 'success'
              ? 'checkmark-circle-outline'
              : item.type === 'promo'
              ? 'pricetags-outline'
              : 'alert-circle-outline'
          }
          size={28}
          color={
            item.type === 'success'
              ? '#4CAF50'
              : item.type === 'promo'
              ? '#2196F3'
              : '#FFC107'
          }
        />
      </View>
      <View style={styles.textWrapper}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          {item.title}
        </Text>
        <Text
          style={[styles.message, { color: isDark ? '#ccc' : '#555' }]}
          numberOfLines={2}
        >
          {item.message}
        </Text>
        <Text style={[styles.date, { color: isDark ? '#888' : '#888' }]}>
          {item.date}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#000' : '#f9f9f9' },
      ]}
    >
      <Header
        title="Notifikasi"
        showLocation={false}
        onBack={() => navigation.goBack()}
        showMessage={false}
        showNotification={false}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#999" />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="notifications-off-outline"
            size={60}
            color={isDark ? '#666' : '#aaa'}
          />
          <Text
            style={{
              color: isDark ? '#666' : '#999',
              fontSize: 16,
              marginTop: 8,
            }}
          >
            Belum ada notifikasi
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={isDark ? '#fff' : '#000'}
            />
          }
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  iconWrapper: {
    width: 40,
    alignItems: 'center',
    marginTop: 4,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NotificationScreen;
