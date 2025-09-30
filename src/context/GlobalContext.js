import React, { createContext, useContext, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import CustomSpinner from '../components/CustomSpinner';

const GlobalContext = createContext();
const { width } = Dimensions.get('window');

export const GlobalProvider = ({ children }) => {
  // hooks selalu dipanggil sama urutannya
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });

  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  const showToast = (message, type = 'info') => {
    setToast({ visible: true, message, type });

    // animasi masuk
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // hilang otomatis
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToast({ visible: false, message: '', type: '' });
      });
    }, 2500);
  };

  return (
    <GlobalContext.Provider value={{ showLoading, hideLoading, showToast }}>
      {children}

      {loading && (
        <View style={styles.loadingOverlay}>
          <CustomSpinner />
        </View>
      )}

      {toast.visible && (
        <Animated.View
          style={[
            styles.toast,
            {
              backgroundColor:
                toast.type === 'error'
                  ? '#FF4C4C'
                  : toast.type === 'success'
                  ? '#4CAF50'
                  : '#333',
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  toast: {
    position: 'absolute',
    top: 50,
    left: width * 0.1,
    right: width * 0.1,
    padding: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
    zIndex: 2000,
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
