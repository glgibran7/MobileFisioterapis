import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import Header from '../../components/Header';
import Api from '../../utils/Api';
import { useGlobal } from '../../context/GlobalContext';

const BookAppointmentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { showToast, showLoading, hideLoading } = useGlobal();

  const { therapist } = route.params;

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const timeSlots = [
    '09.00 WITA',
    '09.30 WITA',
    '10.00 WITA',
    '10.30 WITA',
    '11.00 WITA',
    '11.30 WITA',
    '13.00 WITA',
    '13.30 WITA',
    '14.00 WITA',
    '14.30 WITA',
    '15.00 WITA',
    '15.30 WITA',
  ];

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      showToast(
        'Peringatan',
        'Pilih tanggal dan jam terlebih dahulu!',
        'warning',
      );
      return;
    }

    if (!location.trim()) {
      showToast('Peringatan', 'Masukkan lokasi kunjungan!', 'warning');
      return;
    }

    try {
      showLoading();

      // Konversi waktu ke format ISO
      const [hour, minute] = selectedTime.replace(' WITA', '').split('.');
      const bookingTime = new Date(
        `${selectedDate}T${hour}:${minute}:00+08:00`,
      );

      const payload = {
        therapist_id: therapist.id_therapist,
        location: location.trim(),
        booking_time: bookingTime.toISOString(),
        notes: notes.trim() || 'Tidak ada catatan',
      };

      const res = await Api.post('/bookings', payload);

      if (res.data?.status === 'success') {
        showToast(
          'Booking Berhasil',
          'Terapis akan segera mengonfirmasi',
          'success',
        );
        navigation.navigate('Home');
      } else {
        showToast(
          'Gagal',
          res.data?.message || 'Tidak dapat melakukan booking',
          'error',
        );
      }
    } catch (err) {
      console.error('Booking error:', err);
      showToast('Terjadi Kesalahan', 'Gagal membuat booking', 'error');
    } finally {
      hideLoading();
    }
  };

  const styles = getStyles(isDark);

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: styles.container.backgroundColor },
      ]}
    >
      <Header
        title="Book Appointment"
        showBack
        showLocation={false}
        onBack={() => navigation.goBack()}
        showMessage={false}
        showNotification={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Pilih Tanggal</Text>

        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={day => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: '#0A84FF',
                selectedTextColor: '#fff',
              },
            }}
            theme={{
              backgroundColor: isDark ? '#1C1C1E' : '#fff',
              calendarBackground: isDark ? '#1C1C1E' : '#fff',
              textSectionTitleColor: isDark ? '#aaa' : '#444',
              dayTextColor: isDark ? '#fff' : '#000',
              monthTextColor: isDark ? '#fff' : '#000',
              todayTextColor: '#0A84FF',
              arrowColor: '#0A84FF',
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
            }}
          />
        </View>

        <Text style={styles.title}>Pilih Jam Kunjungan</Text>

        <View style={styles.timeGrid}>
          {timeSlots.map(time => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeButton,
                selectedTime === time && styles.timeButtonSelected,
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text
                style={[
                  styles.timeText,
                  selectedTime === time && styles.timeTextSelected,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.title}>Lokasi Kunjungan</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: Rumah, Klinik, atau Lokasi lain"
          placeholderTextColor={isDark ? '#888' : '#aaa'}
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.title}>Catatan (Opsional)</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
          placeholder="Tambahkan catatan untuk terapis"
          placeholderTextColor={isDark ? '#888' : '#aaa'}
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Konfirmasi Booking</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// 🎨 Dynamic Styles
const getStyles = isDark =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    container: {
      backgroundColor: isDark ? '#000' : '#fff',
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 10,
      color: isDark ? '#fff' : '#000',
    },
    calendarContainer: {
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
      shadowColor: '#000',
      shadowOpacity: isDark ? 0.6 : 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 3,
      marginBottom: 15,
    },
    timeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    timeButton: {
      width: '31%',
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: isDark ? '#444' : '#ddd',
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
      alignItems: 'center',
      marginBottom: 8,
    },
    timeButtonSelected: {
      backgroundColor: '#0A84FF',
      borderColor: '#0A84FF',
    },
    timeText: {
      color: isDark ? '#fff' : '#333',
      fontWeight: '500',
    },
    timeTextSelected: {
      color: '#fff',
    },
    input: {
      borderWidth: 1,
      borderColor: isDark ? '#444' : '#ddd',
      borderRadius: 10,
      padding: 12,
      marginBottom: 15,
      color: isDark ? '#fff' : '#000',
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
    },
    confirmButton: {
      marginTop: 10,
      backgroundColor: '#0A84FF',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    confirmText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default BookAppointmentScreen;
