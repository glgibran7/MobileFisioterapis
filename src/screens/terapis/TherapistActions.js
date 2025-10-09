import { Alert } from 'react-native';
import Api from '../../utils/Api';
/**
 * Menghapus terapis dengan konfirmasi.
 * @param {Object} params
 * @param {number} params.id
 * @param {string} params.name
 * @param {Function} params.showLoading
 * @param {Function} params.hideLoading
 * @param {Function} params.showToast
 * @param {Function} params.onSuccess
 */
export const confirmAndDeleteTherapist = ({
  id,
  name,
  showLoading,
  hideLoading,
  showToast,
  onSuccess,
}) => {
  Alert.alert(
    'Konfirmasi Hapus',
    `Apakah Anda yakin ingin menghapus terapis "${name}"?`,
    [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          showLoading();
          try {
            const res = await Api.delete(`/therapists/${id}`);
            if (res.data?.status === 'success') {
              showToast('Terapis berhasil dihapus', '', 'success');
              if (onSuccess) onSuccess();
            } else {
              showToast('Gagal menghapus terapis', '', 'error');
            }
          } catch (err) {
            console.error('Error deleting therapist:', err);
            showToast('Terjadi kesalahan', 'Tidak dapat menghapus', 'error');
          } finally {
            hideLoading();
          }
        },
      },
    ],
  );
};
