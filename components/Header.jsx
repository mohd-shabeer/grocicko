import { useCart } from "@/providers/CartProvider";
import theme from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const Header = () => {
  const { totalItems } = useCart();
  const badgeScale = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  const profileScale = useRef(new Animated.Value(1)).current;

  // Animate badge when items change
  useEffect(() => {
    if (totalItems > 0) {
      Animated.sequence([
        Animated.spring(badgeScale, {
          toValue: 1.2,
          useNativeDriver: true,
          tension: 150,
          friction: 8,
        }),
        Animated.spring(badgeScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 150,
          friction: 8,
        }),
      ]).start();
    }
  }, [totalItems]);

  const handleProfilePress = () => {
    router.push("/profile");
  };

  const handleCartPress = () => {
    router.push("/cart");
  };

  const handleLogoPress = () => {
    // Logo tap animation
    Animated.sequence([
      Animated.spring(logoScale, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 150,
        friction: 8,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 150,
        friction: 8,
      }),
    ]).start();

    // Optional: Navigate to home or perform action
    router.push("/home");
  };

  const handleProfilePressIn = () => {
    Animated.spring(profileScale, {
      toValue: 0.9,
      useNativeDriver: true,
      tension: 150,
      friction: 8,
    }).start();
  };

  const handleProfilePressOut = () => {
    Animated.spring(profileScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 150,
      friction: 8,
    }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background.primary}
        translucent={false}
      />

      {/* Left Side - Logo Only */}
      <TouchableOpacity
        style={styles.logoContainer}
        onPress={handleLogoPress}
        activeOpacity={1}
      >
        <Image
          source={require("@/assets/company/logo.png")}
          style={styles.logo}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Right Side - Actions */}
      <View style={styles.rightContainer}>
        {/* Notification Bell */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/notifications")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color={theme.colors.text.secondary}
          />
          {/* Optional notification badge */}
          <View style={styles.notificationDot} />
        </TouchableOpacity>

        {/* Search Icon */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/search")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="search-outline"
            size={22}
            color={theme.colors.text.secondary}
          />
        </TouchableOpacity>

        {/* Profile Image */}
        <Animated.View
          style={[
            styles.profileContainer,
            { transform: [{ scale: profileScale }] },
          ]}
        >
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfilePress}
            onPressIn={handleProfilePressIn}
            onPressOut={handleProfilePressOut}
            activeOpacity={1}
          >
            <View style={styles.profileImageWrapper}>
              <Image
                source={{
                  uri: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
                }}
                style={styles.profileImage}
              />
              {/* Online status indicator */}
              <View style={styles.onlineIndicator} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
  },

  logoContainer: {
    flex: 1,
    // marginRight: theme.spacing.lg,
  },

  logoWrapper: {
    alignItems: "flex-start",
  },

  logo: {
    width: 120, // Optimized for landscape Grociko logo
    height: 36, // Proper aspect ratio for landscape
    // Optional: slight tint if needed
    // tintColor: theme.colors.primary.teal,
  },

  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },

  actionButton: {
    position: "relative",
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: "rgba(60, 170, 145, 0.04)",
    justifyContent: "center",
    alignItems: "center",
  },

  notificationDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary.orange,
  },

  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: theme.colors.primary.orange,
    borderRadius: theme.borderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xs,
    borderWidth: 2,
    borderColor: theme.colors.background.primary,
    // Glow effect for badge
    shadowColor: theme.colors.primary.orange,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },

  badgeText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.xs,
    fontFamily: "Outfit-Bold",
    lineHeight: theme.typography.sizes.xs * 1.2,
  },

  profileContainer: {
    marginLeft: theme.spacing.sm,
  },

  profileButton: {
    position: "relative",
  },

  profileImageWrapper: {
    position: "relative",
    width: 48,
    height: 48,
    borderRadius: 24,
    // Modern elevated shadow for profile
    shadowColor: theme.colors.primary.teal,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: theme.colors.primary.teal,
  },

  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#00C851", // Green for online
    borderWidth: 2,
    borderColor: theme.colors.background.primary,
  },
});

export default Header;
