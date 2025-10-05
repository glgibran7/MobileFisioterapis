import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  useColorScheme,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Header from '../../components/Header';
import { useGlobal } from '../../context/GlobalContext';

const HistoryScreen = () => {
  const { showToast, showLoading, hideLoading } = useGlobal();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeStyles = isDark ? darkStyles : lightStyles;

  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setHistory([
      {
        id: '1',
        therapist: 'Dr. Antony Santos',
        service: 'Fisioterapi Lutut',
        date: '2025-09-30',
        status: 'Selesai',
        rating: 4,
      },
      {
        id: '2',
        therapist: 'Dr. Onana Andre',
        service: 'Pijat Rehabilitasi',
        date: '2025-09-25',
        status: 'Dibatalkan',
        rating: null,
      },
      {
        id: '3',
        therapist: 'Siti Rahma',
        service: 'Terapi Punggung',
        date: '2025-09-20',
        status: 'Berjalan',
        rating: null,
      },
    ]);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    showLoading();
    setTimeout(() => {
      hideLoading();
      setRefreshing(false);
      showToast('Data diperbarui', 'success');
    }, 1500);
  };

  const renderRating = rating => {
    if (!rating) return null;
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={18}
          color="#FFD700"
          style={{ marginRight: 2 }}
        />,
      );
    }
    return <View style={{ flexDirection: 'row', marginTop: 4 }}>{stars}</View>;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, themeStyles.card]}
      activeOpacity={0.8}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons
          name="medkit-outline"
          size={24}
          color={
            item.status === 'Selesai'
              ? '#4CAF50'
              : item.status === 'Berjalan'
              ? '#FF9800'
              : '#F44336'
          }
          style={{ marginRight: 10 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={[styles.therapist, themeStyles.text]}>
            {item.therapist}
          </Text>
          <Text style={[styles.service, themeStyles.text]}>{item.service}</Text>
          <Text style={[styles.date, themeStyles.subtext]}>{item.date}</Text>
          {renderRating(item.rating)}
        </View>
        <Text
          style={[
            styles.status,
            item.status === 'Selesai'
              ? styles.done
              : item.status === 'Berjalan'
              ? styles.progress
              : styles.cancel,
          ]}
        >
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Header
        title="Riwayat"
        showBack={false}
        onBack={() => navigation.goBack()}
        showCart={true}
        showMessage={true}
      />

      {history.length === 0 ? (
        <Text style={[styles.empty, themeStyles.text]}>
          Belum ada riwayat pemesanan
        </Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={isDark ? '#fff' : '#000'}
            />
          }
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      )}
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  therapist: {
    fontSize: 15,
    fontWeight: '600',
  },
  service: {
    fontSize: 14,
    fontWeight: '400',
  },
  date: {
    fontSize: 13,
    marginTop: 2,
  },
  status: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  done: { color: '#4CAF50' },
  progress: { color: '#FF9800' },
  cancel: { color: '#F44336' },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});

/* Tema Terang */
const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  card: { backgroundColor: '#f9f9f9', borderColor: '#ddd', borderWidth: 1 },
  text: { color: '#222' },
  subtext: { color: '#555' },
});

/* Tema Gelap */
const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#000' },
  card: { backgroundColor: '#1e1e1e', borderColor: '#333', borderWidth: 1 },
  text: { color: '#fff' },
  subtext: { color: '#aaa' },
});
