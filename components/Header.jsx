import { useCart } from '@/providers/CartProvider';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const Header = () => {
  const { totalItems } = useCart();

  const handleProfilePress = () => {
    router.push('/profile');
  };

  const handleCartPress = () => {
    router.push('/cart');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.primary} />
      
      {/* Left Side - Logo */}
      <TouchableOpacity style={styles.logoContainer} activeOpacity={1}>
        <Image
          source={require('@/assets/company/logo.png')}
          style={styles.logo}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Right Side - Cart & Profile */}
      <View style={styles.rightContainer}>
        {/* Cart Icon with Badge */}
        <TouchableOpacity
          style={styles.cartButton}
          onPress={handleCartPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="bag-outline"
            size={24}
            color={theme.colors.text.primary}
          />
          {totalItems > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {totalItems > 99 ? '99+' : totalItems}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Profile Image */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={handleProfilePress}
          activeOpacity={0.7}
        >
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  logo: {
    width: 55,
    height: 15,
    marginRight: theme.spacing.sm,
  },

  logoText: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.primary.teal,
  },

  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },

  cartButton: {
    position: 'relative',
    padding: theme.spacing.sm,
  },

  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.primary.orange,
    borderRadius: theme.borderRadius.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },

  badgeText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.xs,
    fontFamily: 'Outfit-SemiBold',
  },

  profileButton: {
    marginLeft: theme.spacing.sm,
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    borderColor: theme.colors.primary.teal,
  },
});

export default Header;