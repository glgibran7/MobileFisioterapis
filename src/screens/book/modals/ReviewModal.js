import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const ReviewModal = ({
  visible,
  onClose,
  rating,
  setRating,
  comment,
  setComment,
  handleSubmitReview,
  isDark,
  styles,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.reviewModalOverlay}>
        <View
          style={[
            styles.reviewModalContent,
            { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
          ]}
        >
          <Text
            style={[
              styles.reviewModalTitle,
              { color: isDark ? '#fff' : '#000' },
            ]}
          >
            Beri Ulasan
          </Text>

          <View style={styles.reviewStarsRow}>
            {[1, 2, 3, 4, 5].map(i => (
              <TouchableOpacity key={i} onPress={() => setRating(i)}>
                <Ionicons
                  name={i <= rating ? 'star' : 'star-outline'}
                  size={32}
                  color="#FFD700"
                  style={{ marginHorizontal: 6 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Tulis komentar..."
            placeholderTextColor={isDark ? '#777' : '#aaa'}
            value={comment}
            onChangeText={setComment}
            multiline
            style={[
              styles.reviewInput,
              {
                color: isDark ? '#fff' : '#000',
                backgroundColor: isDark ? '#232323' : '#F2F2F7',
              },
            ]}
          />

          <View style={styles.reviewButtonRow}>
            <Pressable
              style={[
                styles.reviewActionBtn,
                { backgroundColor: '#ccc', marginRight: 8 },
              ]}
              onPress={onClose}
            >
              <Text style={{ color: '#000', fontWeight: '600' }}>Batal</Text>
            </Pressable>
            <Pressable
              style={[
                styles.reviewActionBtn,
                { backgroundColor: '#0A84FF', marginLeft: 8 },
              ]}
              onPress={handleSubmitReview}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Kirim</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ReviewModal;
