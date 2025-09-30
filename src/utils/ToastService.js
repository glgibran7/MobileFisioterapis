// utils/ToastService.js
import Toast from 'react-native-toast-message';
import { ActivityIndicator } from 'react-native';
import React from 'react';

const ToastService = {
  showLoading: (text = 'Loading...') => {
    Toast.show({
      type: 'loading',
      text1: text,
      autoHide: false, // supaya tidak hilang otomatis
      position: 'top',
    });
  },

  showSuccess: (text = 'Berhasil!') => {
    Toast.show({
      type: 'success',
      text1: text,
      visibilityTime: 2000,
      position: 'top',
    });
  },

  showError: (text = 'Terjadi kesalahan!') => {
    Toast.show({
      type: 'error',
      text1: text,
      visibilityTime: 2000,
      position: 'top',
    });
  },

  hide: () => {
    Toast.hide();
  },
};

export default ToastService;
