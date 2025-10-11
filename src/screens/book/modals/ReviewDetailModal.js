import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const ReviewDetailModal = ({
  visible,
  onClose,
  selectedReview,
  isDark,
  styles,
}) => {
  if (!selectedReview) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: isDark ? '#1c1c1e' : '#fff' },
          ]}
        >
          <Text
            style={[styles.modalTitle, { color: isDark ? '#fff' : '#000' }]}
          >
            Detail Ulasan
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginVertical: 10,
            }}
          >
            {[1, 2, 3, 4, 5].map(i => (
              <Ionicons
                key={i}
                name={i <= selectedReview.rating ? 'star' : 'star-outline'}
                size={26}
                color="#FFD700"
                style={{ marginHorizontal: 3 }}
              />
            ))}
          </View>

          <Text
            style={{
              fontSize: 16,
              color: isDark ? '#ccc' : '#333',
              textAlign: 'center',
              fontStyle: 'italic',
              marginBottom: 20,
            }}
          >
            “{selectedReview.comment}”
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: isDark ? '#888' : '#666',
              textAlign: 'center',
            }}
          >
            Dikirim pada{' '}
            {new Date(selectedReview.created_at).toLocaleString('id-ID', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </Text>

          <Pressable
            style={[styles.closeBtn, { backgroundColor: '#0A84FF' }]}
            onPress={onClose}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Tutup</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ReviewDetailModal;
