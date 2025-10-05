import React, { createContext, useContext, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import CustomSpinner from '../components/CustomSpinner';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  const showToast = (message, message2, type) => {
    Toast.show({
      type,
      text1: message,
      text2: message2,
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

      {/* ✅ Config toast type */}
      <Toast
        config={{
          success: props => (
            <BaseToast
              {...props}
              style={{ borderLeftColor: 'green' }}
              text1Style={{ fontSize: 15, fontWeight: 'bold' }}
              text2Style={{ fontSize: 13 }}
            />
          ),
          error: props => (
            <ErrorToast
              {...props}
              style={{ borderLeftColor: 'red' }}
              text1Style={{ fontSize: 15, fontWeight: 'bold' }}
              text2Style={{ fontSize: 13 }}
            />
          ),
          warning: props => (
            <BaseToast
              {...props}
              style={{ borderLeftColor: 'orange', borderLeftWidth: 6 }}
              text1Style={{ fontSize: 15, fontWeight: 'bold', color: 'orange' }}
              text2Style={{ fontSize: 13, color: 'orange' }}
            />
          ),
        }}
      />
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
