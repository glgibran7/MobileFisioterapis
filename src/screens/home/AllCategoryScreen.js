import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Dimensions,
  useColorScheme,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Header from '../../components/Header';

const { width } = Dimensions.get('window');

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
  { id: 8, name: 'Senam Jantung', color: '#89CCDC', icon: 'fitness-outline' },
];

export default function AllCategoryScreen({ navigation }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const renderItem = ({ item }) => (
    <TouchableOpacity
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
        }}
        style={[styles.categoryBox, { backgroundColor: item.color }]}
      >
        <Ionicons name={item.icon} size={30} color="#fff" />
      </ImageBackground>
      <Text style={[styles.categoryText, { color: isDark ? '#fff' : '#333' }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff' }}>
      <Header
        title="Semua Kategori"
        showLocation={false}
        showMessage={false}
        showNotification={false}
        showBack={true}
        onBack={() => navigation.goBack()}
      />
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  categoryWrapper: {
    width: width * 0.28,
    alignItems: 'center',
    marginVertical: 12,
    marginHorizontal: 8,
  },
  categoryBox: {
    width: width * 0.23,
    height: width * 0.23,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
