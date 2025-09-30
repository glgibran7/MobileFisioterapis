import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

const { width } = Dimensions.get('window');

const Header = ({
  title,
  onBack,
  showBack = true,
  onCartPress,
  onMessagePress,
  cartCount = 3,
  messageCount = 5,
  showCart = true, // 👈 tambah kontrol
  showMessage = true, // 👈 tambah kontrol
}) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <SafeAreaView
      edges={['top']}
      style={{ backgroundColor: isDark ? '#000' : '#FFF' }}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#000' : '#FFF'}
      />

      <View style={styles.container}>
        {/* Kiri: Back + Title */}
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity onPress={onBack} style={styles.iconButton}>
              <Ionicons
                name="arrow-back"
                size={width * 0.08}
                color={isDark ? '#FFF' : '#000'}
              />
            </TouchableOpacity>
          )}
          <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>
            {title}
          </Text>
        </View>

        {/* Kanan: Cart + Message */}
        <View style={styles.rightSection}>
          {/* Keranjang */}
          {showCart && (
            <TouchableOpacity onPress={onCartPress} style={styles.iconButton}>
              <View style={{ position: 'relative' }}>
                <Ionicons
                  name="cart-outline"
                  size={width * 0.075}
                  color={isDark ? '#FFF' : '#000'}
                />
                {cartCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}

          {/* Pesan */}
          {showMessage && (
            <TouchableOpacity
              onPress={onMessagePress}
              style={styles.iconButton}
            >
              <View style={{ position: 'relative' }}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={width * 0.075}
                  color={isDark ? '#FFF' : '#000'}
                />
                {messageCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{messageCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  iconButton: {
    padding: 8,
    marginLeft: 0,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Header;
