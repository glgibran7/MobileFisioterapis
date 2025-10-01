import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  useColorScheme,
  ScrollView,
} from 'react-native';
import Header from '../components/Header.js';

const { width } = Dimensions.get('window');

// contoh jadwal (tanggal & jam)
const days = [
  { id: '1', day: '7', label: 'SUN' },
  { id: '2', day: '8', label: 'MON' },
  { id: '3', day: '9', label: 'TUE' },
  { id: '4', day: '10', label: 'WED' },
];

const hours = [
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
];

const AppointmentScreen = ({ route }) => {
  const { doctor } = route.params; // ✅ ambil data dokter dari BookScreen
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff' }}>
      {/* Header tetap muncul */}
      <Header
        title="Appointment"
        showBack={true}
        showCart={false}
        showMessage={false}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Dokter */}
        <View style={styles.profileSection}>
          <Image source={{ uri: doctor.photo }} style={styles.avatar} />
          <Text style={[styles.name, { color: isDark ? '#fff' : '#000' }]}>
            {doctor.name}
          </Text>
          <Text style={[styles.role, { color: isDark ? '#aaa' : '#555' }]}>
            {doctor.role}
          </Text>
        </View>

        {/* Info Trapis */}
        <View
          style={[
            styles.infoBox,
            { backgroundColor: isDark ? '#111' : '#f5f5f5' },
          ]}
        >
          <Text style={[styles.infoTitle, { color: isDark ? '#fff' : '#000' }]}>
            Info Trapis
          </Text>
          <Text style={[styles.infoText, { color: isDark ? '#ccc' : '#555' }]}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad
            minim veniam. Duis aute irure dolor in reprehenderit.
          </Text>
        </View>

        {/* Jadwal */}
        <Text
          style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}
        >
          Schedules
        </Text>
        <FlatList
          horizontal
          data={days}
          keyExtractor={item => item.id}
          contentContainerStyle={{ marginBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.dayCard,
                {
                  borderColor: isDark ? '#444' : '#ccc',
                  backgroundColor: isDark ? '#111' : '#fff',
                },
                selectedDay === item.id && {
                  backgroundColor: '#007BFF',
                  borderColor: '#007BFF',
                },
              ]}
              onPress={() => setSelectedDay(item.id)}
            >
              <Text
                style={[
                  styles.dayNumber,
                  {
                    color:
                      selectedDay === item.id
                        ? '#fff'
                        : isDark
                        ? '#fff'
                        : '#000',
                  },
                ]}
              >
                {item.day}
              </Text>
              <Text
                style={[
                  styles.dayLabel,
                  {
                    color:
                      selectedDay === item.id
                        ? '#fff'
                        : isDark
                        ? '#aaa'
                        : '#555',
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Jam kunjungan */}
        <Text
          style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}
        >
          Visit Hours
        </Text>
        <View style={styles.hoursContainer}>
          {hours.map(hour => (
            <TouchableOpacity
              key={hour}
              style={[
                styles.hourBtn,
                {
                  borderColor: isDark ? '#444' : '#ccc',
                  backgroundColor: isDark ? '#111' : '#fff',
                },
                selectedHour === hour && {
                  backgroundColor: '#007BFF',
                  borderColor: '#007BFF',
                },
              ]}
              onPress={() => setSelectedHour(hour)}
            >
              <Text
                style={[
                  styles.hourText,
                  {
                    color:
                      selectedHour === hour ? '#fff' : isDark ? '#fff' : '#000',
                  },
                ]}
              >
                {hour}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tombol Book */}
        <TouchableOpacity style={styles.bookBtn}>
          <Text style={styles.bookBtnText}>Book Appointment</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: width * 0.2,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 14,
    marginTop: 2,
  },
  infoBox: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  dayCard: {
    width: 70,
    height: 70,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dayLabel: {
    fontSize: 13,
  },
  hoursContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent: 'center',
  },
  hourBtn: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    margin: 6,
  },
  hourText: {
    fontSize: 14,
  },
  bookBtn: {
    width: '100%',
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppointmentScreen;
