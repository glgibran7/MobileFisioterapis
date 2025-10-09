import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Api from '../../utils/Api';
import Header from '../../components/Header';
import { useGlobal } from '../../context/GlobalContext';

const TherapistEditScreen = ({ route, navigation }) => {
  const { therapistId } = route.params;
  const { showLoading, hideLoading, showToast } = useGlobal();

  const [therapist, setTherapist] = useState({
    bio: '',
    experience_years: '',
    specialization: '',
    status_therapist: 'available',
    working_hours: {},
  });

  useEffect(() => {
    fetchTherapist();
  }, []);

  const fetchTherapist = async () => {
    try {
      showLoading();
      const res = await Api.get(`/therapists/${therapistId}`);
      setTherapist(res.data);
    } catch (error) {
      showToast('Error', 'Gagal memuat data therapist', 'error');
    } finally {
      hideLoading();
    }
  };

  const handleSave = async () => {
    try {
      showLoading();

      const payload = {
        bio: therapist.bio,
        experience_years: parseInt(therapist.experience_years) || 0,
        specialization: therapist.specialization,
        status_therapist: therapist.status_therapist,
        working_hours: therapist.working_hours || {},
      };

      await Api.put(`/therapists/${therapistId}`, payload);

      showToast('Sukses', 'Data therapist berhasil diperbarui', 'success');
      navigation.goBack();
    } catch (error) {
      showToast('Error', 'Gagal memperbarui data therapist', 'error');
    } finally {
      hideLoading();
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Edit Therapist" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={styles.input}
          value={therapist.bio}
          onChangeText={text => setTherapist({ ...therapist, bio: text })}
          placeholder="Masukkan bio"
        />

        <Text style={styles.label}>Pengalaman (tahun)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(therapist.experience_years)}
          onChangeText={text =>
            setTherapist({ ...therapist, experience_years: text })
          }
          placeholder="Misal: 5"
        />

        <Text style={styles.label}>Spesialisasi</Text>
        <TextInput
          style={styles.input}
          value={therapist.specialization}
          onChangeText={text =>
            setTherapist({ ...therapist, specialization: text })
          }
          placeholder="Misal: Pijat refleksi"
        />

        <Text style={styles.label}>Status Therapist</Text>
        <TextInput
          style={styles.input}
          value={therapist.status_therapist}
          onChangeText={text =>
            setTherapist({ ...therapist, status_therapist: text })
          }
          placeholder="available / busy"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Simpan Perubahan</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default TherapistEditScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 15,
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  saveBtn: {
    marginTop: 24,
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
});
