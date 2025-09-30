import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Feel Well On-Demand',
    description:
      'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image: require('../img/onboarding/02.jpg'),
    logo: require('../img/onboarding/fisiotrapiputih.png'),
  },
  {
    id: '2',
    title: 'You Pick The Time & Place',
    description:
      'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image: require('../img/onboarding/01.jpg'),
    logo: require('../img/onboarding/fisiotrapiputih.png'),
  },
  {
    id: '3',
    title: 'Feel So Relax',
    description:
      'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image: require('../img/onboarding/03.jpg'),
    logo: require('../img/onboarding/fisiotrapiputih.png'),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // animasi fade & slide
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem('alreadyLaunched', 'true');
    } catch (e) {
      console.log('AsyncStorage error:', e);
    }
    navigation.replace('LoginScreen');
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      finishOnboarding();
    }
  };

  const handleSkip = () => {
    finishOnboarding();
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} resizeMode="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      />
      <Animated.View
        style={[
          styles.textContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Image source={item.logo} style={styles.logo} resizeMode="cover" />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    </View>
  );

  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={item => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
      />

      {/* Footer indikator + tombol */}
      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {slides.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1.4, 0.8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.5, 1, 0.5],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[styles.indicator, { transform: [{ scale }], opacity }]}
              />
            );
          })}
        </View>

        {currentIndex < slides.length - 1 ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <LinearGradient
              colors={['#00BFFF', '#063665ff']}
              style={styles.nextButton}
            >
              <TouchableOpacity
                onPress={handleNext}
                style={{ width: '100%', alignItems: 'center' }}
              >
                <Text style={styles.nextText}>Next</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ) : (
          <LinearGradient
            colors={['#00BFFF', '#063665ff']}
            style={styles.getStartedButton}
          >
            <TouchableOpacity
              onPress={handleNext}
              style={{ width: '100%', alignItems: 'center' }}
            >
              <Text style={styles.getStartedText}>Mulai Sekarang</Text>
            </TouchableOpacity>
          </LinearGradient>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  slide: {
    width,
    height,
    position: 'relative',
  },
  image: {
    width,
    height,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width,
    height: height * 0.5,
  },
  textContainer: {
    position: 'absolute',
    top: height * 0.1, // posisikan dari atas, bukan dari bawah
    left: 30, // jarak dari kiri
    right: 30, // biar ada padding kanan juga
    alignItems: 'flex-start', // semua isi ikut kiri
  },

  logo: {
    width: width * 0.4, // atur sesuai kebutuhan
    height: height * 0.3, // atur sesuai kebutuhan
    marginBottom: 20,
  },

  title: {
    fontSize: width * 0.075, // lebih besar
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'left',
  },

  description: {
    fontSize: width * 0.045,
    color: '#f0f0f0',
    lineHeight: 22,
    textAlign: 'left',
  },

  footer: {
    position: 'absolute',
    bottom: height * 0.06,
    width,
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginHorizontal: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#fff',
  },
  nextButton: {
    padding: 15,
    borderRadius: 12,
    width: '30%',
  },
  nextText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  getStartedButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  getStartedText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OnboardingScreen;
