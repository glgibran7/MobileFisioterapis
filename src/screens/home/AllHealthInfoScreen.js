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
import Header from '../../components/Header';

const { width } = Dimensions.get('window');

// Data dummy — bisa diganti dari API nanti
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
  {
    id: 4,
    title: 'Fisioterapi Pediatrik',
    image: require('../../img/onboarding/01.jpg'),
  },
  {
    id: 5,
    title: 'Terapi Olahraga',
    image: require('../../img/onboarding/02.jpg'),
  },
];

export default function AllHealthInfoScreen({ navigation }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#F8F8F8' }]}
      onPress={() =>
        navigation.navigate('DetailInformasiScreen', { id: item.id })
      }
      activeOpacity={0.8}
    >
      <Image source={item.image} style={styles.image} />
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff' }}>
      <Header
        title="Semua Informasi Kesehatan"
        showLocation={false}
        showMessage={false}
        showNotification={false}
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={services}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={1} // 🔹 satu per baris
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: width * 0.45,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
