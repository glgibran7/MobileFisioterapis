import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Header from '../components/Header.js';

const { width } = Dimensions.get('window');

const DATA = [
  {
    id: '1',
    name: 'Dr. John Doe',
    role: 'Fisioterapis',
    rating: 4.8,
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    name: 'Dr. Sarah Smith',
    role: 'Dokter Umum',
    rating: 4.5,
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
];

const BookScreen = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#111' : '#fff',
          borderColor: isDark ? '#333' : '#000',
          shadowColor: isDark ? '#000' : '#aaa',
        },
      ]}
    >
      {/* Foto + Rating */}
      <View style={styles.leftSection}>
        <Image source={{ uri: item.photo }} style={styles.avatar} />
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={{ color: isDark ? '#fff' : '#000', marginLeft: 4 }}>
            {item.rating}
          </Text>
        </View>
      </View>

      {/* Info kanan */}
      <View style={styles.rightSection}>
        <Text style={[styles.name, { color: isDark ? '#fff' : '#000' }]}>
          {item.name}
        </Text>
        <Text style={[styles.role, { color: isDark ? '#aaa' : '#555' }]}>
          {item.role}
        </Text>

        {/* Tombol */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.appointmentBtn}>
            <Text style={styles.btnText}>Appointment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="chatbubbles-outline" size={20} color="#007BFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="heart-outline" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <Header
        title="Book"
        showBack={false}
        showCart={true}
        showMessage={true}
      />
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? '#000' : '#fff' },
        ]}
      >
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16 }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 3,
    borderWidth: 1,
  },
  leftSection: {
    alignItems: 'center',
    marginRight: 12,
    width: width * 0.25,
  },
  avatar: {
    width: width * 0.22,
    height: width * 0.22,
    borderRadius: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  rightSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 14,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  appointmentBtn: {
    backgroundColor: '#444',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginRight: 6,
  },
  iconBtn: {
    padding: 8,
    marginHorizontal: 2,
  },
  btnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default BookScreen;
