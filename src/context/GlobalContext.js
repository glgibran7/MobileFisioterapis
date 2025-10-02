import React, { createContext, useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native'; // ✅ tambahkan ini
import Toast from 'react-native-toast-message';
import CustomSpinner from '../components/CustomSpinner';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  const showToast = (message, type = 'success') => {
    Toast.show({
      type: type,
      text1: message,
      position: 'top',
      visibilityTime: 2500,
    });
  };

  return (
    <GlobalContext.Provider value={{ showLoading, hideLoading, showToast }}>
      {children}

      {loading && (
        <View style={styles.loadingOverlay}>
          <CustomSpinner />
        </View>
      )}

      <Toast />
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1000,
  },
});
