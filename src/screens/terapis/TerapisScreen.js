// ... kode import di atas
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  TextInput,
  ScrollView,
  RefreshControl,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import Api from '../../utils/Api';
import { useGlobal } from '../../context/GlobalContext';
import { confirmAndDeleteTherapist } from './TherapistActions';
import ModalTambahTerapis from './ModalTambahTerapis';

const { width } = Dimensions.get('window');
const FILTERS = ['All', 'Available', 'Busy'];

const sortOptions = [
  { key: 'name', label: 'Nama (A-Z)' },
  { key: 'status', label: 'Status' },
  { key: 'newest', label: 'Terbaru' },
  { key: 'oldest', label: 'Terlama' },
];

const TerapisScreen = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { showToast, showLoading, hideLoading, user } = useGlobal();
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [therapists, setTherapists] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showTambahModal, setShowTambahModal] = useState(false);

  const [sortBy, setSortBy] = useState('name');
  const navigation = useNavigation();

  const fetchTherapists = async () => {
    showLoading();
    try {
      const res = await Api.get('/therapists');
      if (res.data?.status === 'success') {
        setTherapists(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching therapists:', err);
      showToast('Gagal mengambil data', 'Terjadi kesalahan', 'error');
    } finally {
      hideLoading();
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTherapists();
  };

  const filteredData = therapists
    .filter(item => {
      const matchSearch = item.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchFilter =
        selectedFilter === 'All'
          ? true
          : item.status_therapist === selectedFilter.toLowerCase();
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'status')
        return a.status_therapist.localeCompare(b.status_therapist);
      if (sortBy === 'newest') return b.id_therapist - a.id_therapist;
      if (sortBy === 'oldest') return a.id_therapist - b.id_therapist;
      return 0;
    });

  const renderItem = ({ item }) => {
    const status =
      item.status_therapist === 'available'
        ? { label: 'Available', color: '#4CAF50', icon: 'ellipse' }
        : { label: 'Busy', color: '#E53935', icon: 'ellipse' };

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('TerapisDetailScreen', { therapist: item })
        }
        activeOpacity={0.9}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? '#1a1a1a' : '#fff',
              shadowColor: isDark ? '#000' : '#555',
            },
          ]}
        >
          <Image
            source={{
              uri:
                item.photo ||
                'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            }}
            style={styles.avatar}
          />
          <View style={styles.infoContainer}>
            <Text style={[styles.name, { color: isDark ? '#fff' : '#000' }]}>
              {item.name}
            </Text>
            <View style={styles.statusRow}>
              <Ionicons
                name={status.icon}
                size={10}
                color={status.color}
                style={{ marginRight: 5 }}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: status.color, fontWeight: '600' },
                ]}
              >
                {status.label}
              </Text>
            </View>
            <Text
              style={[
                styles.specialization,
                { color: isDark ? '#aaa' : '#555' },
              ]}
            >
              {item.specialization || 'Spesialisasi tidak tersedia'}
            </Text>
            <View style={styles.row}>
              <Ionicons
                name="call-outline"
                size={14}
                color={isDark ? '#bbb' : '#666'}
              />
              <Text
                style={[styles.location, { color: isDark ? '#bbb' : '#666' }]}
              >
                {item.phone || '-'}
              </Text>
            </View>
            <View style={styles.row}>
              <Ionicons
                name="mail-outline"
                size={14}
                color={isDark ? '#bbb' : '#666'}
              />
              <Text
                style={[styles.location, { color: isDark ? '#bbb' : '#666' }]}
              >
                {item.email || '-'}
              </Text>
            </View>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text
                style={[styles.rating, { color: isDark ? '#fff' : '#000' }]}
              >
                {item.average_rating || 'N/A'}
              </Text>
              <Text
                style={[
                  styles.reviewCount,
                  { color: isDark ? '#999' : '#777' },
                ]}
              >
                • {item.total_reviews || 0} Reviews
              </Text>
            </View>
          </View>

          {/* Tombol Aksi */}
          <View style={styles.iconButtons}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons
                name="heart-outline"
                size={20}
                color={isDark ? '#888' : '#555'}
              />
            </TouchableOpacity>

            {user?.role === 'admin' && (
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() =>
                  confirmAndDeleteTherapist({
                    id: item.id_therapist,
                    name: item.name,
                    showLoading,
                    hideLoading,
                    showToast,
                    onSuccess: () =>
                      setTherapists(prev =>
                        prev.filter(t => t.id_therapist !== item.id_therapist),
                      ),
                  })
                }
              >
                <Ionicons name="trash-outline" size={20} color="#E53935" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
    >
      <Header
        title="Daftar Terapis"
        showLocation={false}
        showBack={false}
        showMessage={false}
        onNotificationPress={() => navigation.navigate('NotificationScreen')}
      />

      {/* Search */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: isDark ? '#111' : '#f9f9f9',
            borderColor: isDark ? '#444' : '#ddd',
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={isDark ? '#ccc' : '#555'}
          style={{ marginRight: 6 }}
        />
        <TextInput
          style={[styles.searchInput, { color: isDark ? '#fff' : '#000' }]}
          placeholder="Cari Terapis"
          placeholderTextColor={isDark ? '#777' : '#999'}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
        style={styles.filterScrollView}
      >
        {FILTERS.map((item, index) => (
          <TouchableOpacity
            key={item + index}
            style={[
              styles.chip,
              {
                backgroundColor:
                  selectedFilter === item
                    ? isDark
                      ? '#4da6ff'
                      : '#007bff'
                    : isDark
                    ? '#222'
                    : '#f0f0f0',
              },
            ]}
            onPress={() => setSelectedFilter(item)}
          >
            <Text
              style={{
                color:
                  selectedFilter === item ? '#fff' : isDark ? '#ddd' : '#000',
                fontWeight: '600',
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Header jumlah dan sort */}
      <View style={styles.resultHeader}>
        <Text style={[styles.countText, { color: isDark ? '#fff' : '#000' }]}>
          {filteredData.length} ditemukan
        </Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <Text style={{ color: isDark ? '#fff' : '#000', marginRight: 4 }}>
            {sortOptions.find(opt => opt.key === sortBy)?.label.split(' ')[0] ||
              'Default'}
          </Text>
          <Ionicons
            name="swap-vertical-outline"
            size={16}
            color={isDark ? '#fff' : '#000'}
          />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        style={{ flex: 1, marginTop: 4 }}
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id_therapist.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[isDark ? '#4da6ff' : '#007bff']}
            tintColor={isDark ? '#4da6ff' : '#007bff'}
          />
        }
      />

      {user?.role === 'admin' && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 25,
            right: 25,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: isDark ? '#4da6ff' : '#007bff',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
          }}
          onPress={() => setShowTambahModal(true)}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Modal Tambah Terapis */}
      <ModalTambahTerapis
        visible={showTambahModal}
        onClose={() => setShowTambahModal(false)}
        onSuccess={fetchTherapists} // reload list setelah tambah
      />

      {/* Modal Sort */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSortModal(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
            ]}
          >
            <Text
              style={[styles.modalTitle, { color: isDark ? '#fff' : '#000' }]}
            >
              Urutkan Berdasarkan
            </Text>
            {sortOptions.map(option => (
              <TouchableOpacity
                key={option.key}
                style={styles.modalItem}
                onPress={() => {
                  setSortBy(option.key);
                  setShowSortModal(false);
                }}
              >
                <Text
                  style={{
                    color:
                      sortBy === option.key
                        ? isDark
                          ? '#4da6ff'
                          : '#007bff'
                        : isDark
                        ? '#fff'
                        : '#000',
                    fontWeight: sortBy === option.key ? '600' : '400',
                  }}
                >
                  {option.label}
                </Text>
                {sortBy === option.key && (
                  <Ionicons
                    name="checkmark-outline"
                    size={18}
                    color={isDark ? '#4da6ff' : '#007bff'}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    margin: 16,
    height: 42,
  },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 0 },
  chip: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  countText: { fontSize: 15, fontWeight: '600' },
  sortButton: { flexDirection: 'row', alignItems: 'center' },
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    position: 'relative',
  },
  avatar: { width: width * 0.2, height: width * 0.2, borderRadius: 10 },
  infoContainer: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '700', textTransform: 'capitalize' },
  specialization: { fontSize: 14, marginTop: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  statusText: { fontSize: 13 },
  location: { marginLeft: 4, fontSize: 13 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  rating: { fontSize: 14, fontWeight: '600', marginLeft: 4 },
  reviewCount: { fontSize: 13, marginLeft: 4 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  iconButtons: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    padding: 4,
  },
  filterScrollView: { flexGrow: 0, maxHeight: 70, marginBottom: 8 },
  filterScrollContent: { paddingHorizontal: 16, alignItems: 'center' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: { width: '75%', borderRadius: 10, paddingVertical: 14 },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});

export default TerapisScreen;
