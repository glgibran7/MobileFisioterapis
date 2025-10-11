import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  useColorScheme,
} from 'react-native';
import Header from '../../components/Header';

const { width } = Dimensions.get('window');

// Dummy data detail (nanti bisa ganti API)
const detailData = {
  1: {
    title: 'Fisioterapi Muskuloskeletal',
    image: require('../../img/onboarding/01.jpg'),
    content: `Fisioterapi muskuloskeletal adalah bidang fisioterapi yang berfokus pada pengobatan cedera dan gangguan pada otot, sendi, dan tulang. 
Terapinya membantu mengurangi nyeri, meningkatkan fleksibilitas, serta memperbaiki postur tubuh.`,
  },
  2: {
    title: 'Fisioterapi Neurologi',
    image: require('../../img/onboarding/02.jpg'),
    content: `Fisioterapi neurologi menangani pasien dengan gangguan sistem saraf seperti stroke, cedera tulang belakang, dan penyakit Parkinson. 
Tujuan utamanya adalah mengembalikan fungsi gerak dan meningkatkan koordinasi.`,
  },
  3: {
    title: 'Fisioterapi Kardiopulmoner',
    image: require('../../img/onboarding/03.jpg'),
    content: `Fisioterapi kardiopulmoner membantu pasien dengan gangguan jantung dan paru-paru melalui latihan pernapasan, edukasi, dan aktivitas fisik yang terarah.`,
  },
  4: {
    title: 'Fisioterapi Pediatrik',
    image: require('../../img/onboarding/01.jpg'),
    content: `Fisioterapi pediatrik ditujukan untuk anak-anak dengan gangguan perkembangan motorik, cedera, atau kelainan bawaan. 
Terapi difokuskan pada peningkatan kemampuan gerak dan koordinasi.`,
  },
  5: {
    title: 'Terapi Olahraga',
    image: require('../../img/onboarding/02.jpg'),
    content: `Terapi olahraga berperan dalam pencegahan dan pemulihan cedera akibat aktivitas fisik. 
Diterapkan untuk atlet maupun masyarakat umum agar performa tubuh tetap optimal.`,
  },
};

export default function DetailInformasiScreen({ route, navigation }) {
  const { id } = route.params || {};
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const data = detailData[id] || detailData[1]; // fallback

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff' }}>
      <Header
        title={data.title}
        showLocation={false}
        showMessage={false}
        showNotification={false}
        showBack={true}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={data.image} style={styles.image} />
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          {data.title}
        </Text>
        <Text style={[styles.content, { color: isDark ? '#ccc' : '#333' }]}>
          {data.content}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  image: {
    width: width - 32,
    height: width * 0.55,
    borderRadius: 14,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  content: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'justify',
  },
});
