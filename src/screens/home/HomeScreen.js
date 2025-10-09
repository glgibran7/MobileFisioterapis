import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  RefreshControl,
  ImageBackground,
} from 'react-native';
import Header from '../../components/Header.js';
import Ionicons from '@react-native-vector-icons/ionicons';

const { width } = Dimensions.get('window');

// Data slide (gunakan full gambar tanpa text)
const slides = [
  require('../../img/carousel/carosel.png'),
  require('../../img/carousel/carosel.png'),
  require('../../img/carousel/carosel.png'),
];

// Data kategori

const categories = [
  { id: 1, name: 'Terapi Hati', color: '#DC9497', icon: 'fitness-outline' },
  { id: 2, name: 'Meditasi Hati', color: '#93C19D', icon: 'fitness-outline' },
  { id: 3, name: 'Pengobatan Hati', color: '#F5AD7D', icon: 'fitness-outline' },
  { id: 4, name: 'Pelari Kalcer', color: '#ACA1CC', icon: 'fitness-outline' },
  {
    id: 5,
    name: 'Rehabilitasi Hati',
    color: '#4E9B91',
    icon: 'fitness-outline',
  },
  { id: 6, name: 'Konsultasi Hati', color: '#352361', icon: 'fitness-outline' },
  {
    id: 7,
    name: 'Dilarang Main Hati',
    color: '#DEB6B6',
    icon: 'fitness-outline',
  },
  {
    id: 8,
    name: 'Senam Jantung',
    color: '#89CCDC',
    icon: 'fitness-outline',
  },
];

// Data layanan (dummy)
const services = [
  {
    id: 1,
    title: 'Fisioterapi Muskuloskeletal',
    image: require('../../img/onboarding/01.jpg'),
  },
  {
    id: 2,
    title: 'Fisioterapi Neurologi',
    image: require('../../img/onboarding/02.jpg'),
  },
  {
    id: 3,
    title: 'Fisioterapi Kardiopulmoner',
    image: require('../../img/onboarding/03.jpg'),
  },
];

export default function HomeScreen({ navigation }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const scrollRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // simulasi loading 2 detik (ganti dengan fetch API kalau ada)
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  // Auto slide setiap 3 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => {
        const nextIndex = (prev + 1) % slides.length;
        scrollRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Header
        title="Home"
        showBack={false}
        showCart={true}
        showMessage={true}
      />

      <ScrollView
        style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff' }}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00BFFF']} // Android
            tintColor="#00BFFF" // iOS
          />
        }
      >
        {/* 🔹 Carousel Slide */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={scrollRef}
          onMomentumScrollEnd={e => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveSlide(index);
          }}
          style={styles.carousel}
        >
          {slides.map((img, index) => (
            <Image key={index} source={img} style={styles.slideImage} />
          ))}
        </ScrollView>
        {/* 🔹 Dots Indicator */}
        <View style={styles.dots}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, { opacity: index === activeSlide ? 1 : 0.3 }]}
            />
          ))}
        </View>
        {/* 🔹 Kategori */}
        <View style={styles.sectionHeader}>
          <Text
            style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}
          >
            Kategori
          </Text>
          <TouchableOpacity>
            <Text style={{ color: '#00BFFF' }}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoryContainer}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryWrapper}
              onPress={() => navigation.navigate('Terapis')}
            >
              <ImageBackground
                source={require('../../img/transparant.png')}
                imageStyle={{
                  width: '70%',
                  height: '70%',
                  borderRadius: 10,
                  opacity: 0.5,
                  resizeMode: 'cover',
                }}
                style={[styles.categoryBox, { backgroundColor: cat.color }]}
              >
                <Ionicons name={cat.icon} size={28} color="#fff" />
              </ImageBackground>
              <Text
                style={[
                  styles.categoryText,
                  { color: isDark ? '#fff' : '#333' },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🔹 Informasi Kesehatan */}
        <View style={styles.sectionHeader}>
          <Text
            style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}
          >
            Informasi Kesehatan
          </Text>
          <TouchableOpacity>
            <Text style={{ color: '#00BFFF' }}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {services.map(service => (
            <View key={service.id} style={styles.serviceCard}>
              <Image source={service.image} style={styles.serviceImage} />
              <Text
                style={[
                  styles.serviceTitle,
                  { color: isDark ? '#fff' : '#000' },
                ]}
              >
                {service.title}
              </Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  carousel: {
    height: width * 0.5,
    marginBottom: 10,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  slideImage: {
    width: width,
    height: width * 0.5,
    resizeMode: 'cover',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00BFFF',
    marginHorizontal: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  categoryWrapper: {
    width: width * 0.22,
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryBox: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryIcon: {
    fontSize: 26,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  serviceCard: {
    width: width * 0.6,
    marginLeft: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: width * 0.35,
    borderRadius: 12,
  },
  serviceTitle: {
    fontSize: 14,
    marginTop: 8,
    marginHorizontal: 8,
    fontWeight: '600',
  },
});
