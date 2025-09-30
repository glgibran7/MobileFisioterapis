import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Dimensions,
} from 'react-native';
import Header from '../components/Header.js';

const { width } = Dimensions.get('window');

// Data layanan (dummy)
const services = [
  {
    id: 1,
    title: 'Fisioterapi Muskuloskeletal',
    description: 'lor ipsum dolor sit amet, consectetur adipiscing elit.',
    image: require('../img/onboarding/01.jpg'),
  },
  {
    id: 2,
    title: 'Fisioterapi Neurologi',
    description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: require('../img/onboarding/02.jpg'),
  },
  {
    id: 3,
    title: 'Fisioterapi Kardiopulmoner',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: require('../img/onboarding/03.jpg'),
  },
];

export default function HomeScreen({ navigation }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <>
      <Header
        title="Home"
        showBack={false}
        onBack={() => navigation.goBack()}
        showCart={true}
        showMessage={true}
      />

      <ScrollView
        style={{
          flex: 1,
          backgroundColor: isDark ? '#000' : '#fff',
        }}
        contentContainerStyle={styles.scrollContainer}
      >
        {services.map(service => (
          <View
            key={service.id}
            style={[
              styles.card,
              { backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9' },
            ]}
          >
            <Image source={service.image} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
                {service.title}
              </Text>
              <Text
                style={[
                  styles.description,
                  { color: isDark ? '#ccc' : '#555' },
                ]}
              >
                {service.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  image: {
    width: '100%',
    height: width * 0.4,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});
