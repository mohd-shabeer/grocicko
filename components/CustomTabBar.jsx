import { useCart } from '@/providers/CartProvider';
import { useFavorites } from '@/providers/FavoritesProvider';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const { totalItems: cartItems } = useCart();
  const { totalFavorites } = useFavorites();
  
  // Separate animation values for native and non-native animations
  const scaleValues = useRef(
    state.routes.map(() => new Animated.Value(1))
  ).current;

  const activeSliderPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Scale animation for active tab (native driver)
    scaleValues.forEach((scale, index) => {
      Animated.spring(scale, {
        toValue: state.index === index ? 1.1 : 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }).start();
    });

    // Active slider position (non-native driver for layout properties)
    Animated.spring(activeSliderPosition, {
      toValue: state.index,
      tension: 300,
      friction: 10,
      useNativeDriver: false,
    }).start();
  }, [state.index]);

  const getTabIcon = (routeName, focused) => {
    let iconName;
    
    switch (routeName) {
      case 'home':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'favourites':
        iconName = focused ? 'heart' : 'heart-outline';
        break;
      case 'search':
        iconName = focused ? 'search' : 'search-outline';
        break;
      case 'profile':
        iconName = focused ? 'person' : 'person-outline';
        break;
      case 'cart':
        iconName = focused ? 'bag' : 'bag-outline';
        break;
      default:
        iconName = 'help-outline';
    }
    
    return iconName;
  };

  const getBadgeCount = (routeName) => {
    switch (routeName) {
      case 'cart':
        return cartItems;
      case 'favourites':
        return totalFavorites;
      default:
        return 0;
    }
  };

  const renderTabButton = (route, index) => {
    const { options } = descriptors[route.key];
    const label = options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
      ? options.title
      : route.name;

    const isFocused = state.index === index;
    const badgeCount = getBadgeCount(route.name);

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };

    return (
      <TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.tabButton}
        activeOpacity={0.7}
      >
        <Animated.View
          style={[
            styles.tabButtonContent,
            {
              backgroundColor: isFocused ? theme.colors.background.accent : 'transparent',
              transform: [{ scale: scaleValues[index] }],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <Ionicons
                name={getTabIcon(route.name, isFocused)}
                size={24}
                color={isFocused ? theme.colors.primary.teal : theme.colors.text.tertiary}
              />
            </View>
            
            {/* Badge */}
            {badgeCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {badgeCount > 99 ? '99+' : badgeCount}
                </Text>
              </View>
            )}

            {/* Active indicator dot */}
            {isFocused && (
              <View style={styles.activeIndicator} />
            )}
          </View>

          <Text
            style={[
              styles.tabLabel,
              {
                color: isFocused ? theme.colors.primary.teal : theme.colors.text.tertiary,
                opacity: isFocused ? 1 : 0.7,
                fontFamily: isFocused ? 'Outfit-SemiBold' : 'Outfit-Medium',
              },
            ]}
          >
            {label}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tab Bar Background */}
      <View
        style={[
          styles.tabBar,
          {
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : theme.spacing.md,
          },
        ]}
      >
        {/* Background Blur Effect */}
        <View style={styles.backgroundBlur} />
        
        {/* Active Tab Slider */}
        <Animated.View
          style={[
            styles.activeTabSlider,
            {
              left: activeSliderPosition.interpolate({
                inputRange: [0, state.routes.length - 1],
                outputRange: [
                  theme.spacing.sm,
                  width - (width / state.routes.length) + theme.spacing.sm,
                ],
              }),
              width: (width / state.routes.length) - (theme.spacing.sm * 2),
            },
          ]}
        />

        {/* Tab Buttons */}
        <View style={styles.tabButtonsContainer}>
          {state.routes.map((route, index) => renderTabButton(route, index))}
        </View>
      </View>

      {/* Shadow */}
      <View style={styles.shadow} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    position: 'relative',
  },

  backgroundBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },

  activeTabSlider: {
    position: 'absolute',
    top: theme.spacing.xs,
    height: 3,
    backgroundColor: theme.colors.primary.teal,
    borderRadius: theme.borderRadius.sm,
  },

  tabButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    zIndex: 1,
  },

  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
  },

  tabButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    minHeight: 60,
    width: '100%',
  },

  iconContainer: {
    position: 'relative',
    marginBottom: theme.spacing.xs,
  },

  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: theme.colors.primary.orange,
    borderRadius: theme.borderRadius.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
    borderWidth: 2,
    borderColor: theme.colors.background.primary,
  },

  badgeText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.xs,
    fontFamily: 'Outfit-Bold',
    lineHeight: theme.typography.sizes.xs,
  },

  activeIndicator: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary.teal,
  },

  tabLabel: {
    fontSize: theme.typography.sizes.xs,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },

  shadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default CustomTabBar;