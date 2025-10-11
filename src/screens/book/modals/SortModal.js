import React from 'react';
import { Modal, Pressable, View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const SortModal = ({
  visible,
  onClose,
  sortOrder,
  setSortOrder,
  isDark,
  styles,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
          ]}
        >
          <Text
            style={[
              styles.modalTitle,
              { color: isDark ? '#fff' : '#000', textAlign: 'center' },
            ]}
          >
            Urutkan Berdasarkan
          </Text>

          {[
            { key: 'desc', label: 'Terbaru' },
            { key: 'asc', label: 'Terlama' },
          ].map(option => (
            <TouchableOpacity
              key={option.key}
              style={styles.modalItem}
              onPress={() => {
                setSortOrder(option.key);
                onClose();
              }}
            >
              <Text
                style={{
                  color:
                    sortOrder === option.key
                      ? isDark
                        ? '#4da6ff'
                        : '#007bff'
                      : isDark
                      ? '#fff'
                      : '#000',
                  fontWeight: sortOrder === option.key ? '600' : '400',
                }}
              >
                {option.label}
              </Text>
              {sortOrder === option.key && (
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
  );
};

export default SortModal;
