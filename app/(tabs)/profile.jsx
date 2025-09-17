import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { useCart } from "@/providers/CartProvider";
import { useFavorites } from "@/providers/FavoritesProvider";
import theme from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const ProfilePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // In real app, get from auth provider
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(true);

  const { totalItems, clearCart } = useCart();
  const { totalFavorites, clearFavorites } = useFavorites();

  // Sample user data - In real app, get from auth provider/API
  const userData = {
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    profileImage:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    memberSince: "2023",
    ordersCount: 24,
    savedAddresses: 2,
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // In real app, clear auth state
          setIsLoggedIn(false);
          clearCart();
          Alert.alert("Success", "You have been logged out successfully");
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Account Deleted",
              "Your account has been deleted successfully"
            );
            setIsLoggedIn(false);
            clearCart();
            clearFavorites();
          },
        },
      ]
    );
  };

  const profileItems = [
    {
      section: "Account",
      items: [
        {
          icon: "person-outline",
          title: "Edit Profile",
          subtitle: "Update your personal information",
          onPress: () => router.push("/edit-profile"),
          showArrow: true,
        },
        {
          icon: "location-outline",
          title: "Addresses",
          subtitle: `${userData.savedAddresses} saved addresses`,
          onPress: () => router.push("/addresses"),
          showArrow: true,
        },
        {
          icon: "card-outline",
          title: "Payment Methods",
          subtitle: "Manage your payment options",
          onPress: () => router.push("/payment-methods"),
          showArrow: true,
        },
      ],
    },
    {
      section: "Orders & Activity",
      items: [
        {
          icon: "bag-outline",
          title: "Order History",
          subtitle: `${userData.ordersCount} orders placed`,
          onPress: () => router.push("/orders"),
          showArrow: true,
        },
        {
          icon: "heart-outline",
          title: "Favorites",
          subtitle: `${totalFavorites} saved items`,
          onPress: () => router.push("/favourites"),
          showArrow: true,
        },
        {
          icon: "receipt-outline",
          title: "Track Orders",
          subtitle: "Check delivery status",
          onPress: () => router.push("/track-orders"),
          showArrow: true,
        },
      ],
    },
    {
      section: "Preferences",
      items: [
        {
          icon: "notifications-outline",
          title: "Push Notifications",
          subtitle: "Order updates and promotions",
          onPress: () => setPushNotifications(!pushNotifications),
          showSwitch: true,
          switchValue: pushNotifications,
        },
        {
          icon: "mail-outline",
          title: "Email Notifications",
          subtitle: "Newsletters and offers",
          onPress: () => setEmailNotifications(!emailNotifications),
          showSwitch: true,
          switchValue: emailNotifications,
        },
        {
          icon: "finger-print-outline",
          title: "Biometric Authentication",
          subtitle: "Use fingerprint or face ID",
          onPress: () => setBiometricAuth(!biometricAuth),
          showSwitch: true,
          switchValue: biometricAuth,
        },
        {
          icon: "language-outline",
          title: "Language",
          subtitle: "English (US)",
          onPress: () => router.push("/language"),
          showArrow: true,
        },
      ],
    },
    {
      section: "Support & Information",
      items: [
        {
          icon: "help-circle-outline",
          title: "Help & Support",
          subtitle: "FAQs and customer service",
          onPress: () => router.push("/help"),
          showArrow: true,
        },
        {
          icon: "chatbubble-outline",
          title: "Contact Us",
          subtitle: "Get in touch with our team",
          onPress: () => router.push("/contact"),
          showArrow: true,
        },
        {
          icon: "star-outline",
          title: "Rate Our App",
          subtitle: "Share your feedback",
          onPress: () => {
            Alert.alert("Thank you!", "We appreciate your feedback");
          },
          showArrow: true,
        },
        {
          icon: "information-circle-outline",
          title: "About Grociko",
          subtitle: "Learn more about our app",
          onPress: () => router.push("/about"),
          showArrow: true,
        },
      ],
    },
    {
      section: "Legal",
      items: [
        {
          icon: "document-text-outline",
          title: "Terms & Conditions",
          subtitle: "Read our terms of service",
          onPress: () => router.push("/terms"),
          showArrow: true,
        },
        {
          icon: "shield-outline",
          title: "Privacy Policy",
          subtitle: "How we handle your data",
          onPress: () => router.push("/privacy"),
          showArrow: true,
        },
        {
          icon: "book-outline",
          title: "Open Source Libraries",
          subtitle: "Third-party acknowledgments",
          onPress: () => router.push("/licenses"),
          showArrow: true,
        },
      ],
    },
  ];

  const renderUserHeader = () => {
    if (!isLoggedIn) {
      return (
        <View style={styles.guestHeader}>
          <View style={styles.guestIconContainer}>
            <Ionicons
              name="person-outline"
              size={48}
              color={theme.colors.text.tertiary}
            />
          </View>
          <Text style={styles.guestTitle}>Welcome to Grociko!</Text>
          <Text style={styles.guestSubtitle}>
            Sign in to access your orders, favorites, and personalized
            recommendations
          </Text>
          <View style={styles.authButtons}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignup}
            >
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.userHeader}>
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={() => router.push("/edit-profile")}
        >
          <Image
            source={{ uri: userData.profileImage }}
            style={styles.profileImage}
          />
          <View style={styles.editImageIcon}>
            <Ionicons
              name="camera"
              size={16}
              color={theme.colors.text.inverse}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <Text style={styles.memberSince}>
            Member since {userData.memberSince}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => router.push("/edit-profile")}
        >
          <Ionicons
            name="create-outline"
            size={20}
            color={theme.colors.primary.teal}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderStatsCards = () => {
    if (!isLoggedIn) return null;

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{userData.ordersCount}</Text>
          <Text style={styles.statsLabel}>Orders</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{totalFavorites}</Text>
          <Text style={styles.statsLabel}>Favorites</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{totalItems}</Text>
          <Text style={styles.statsLabel}>In Cart</Text>
        </View>
      </View>
    );
  };

  const renderProfileItem = (item) => (
    <TouchableOpacity
      key={item.title}
      style={styles.profileItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.profileItemLeft}>
        <View style={styles.profileItemIcon}>
          <Ionicons
            name={item.icon}
            size={22}
            color={theme.colors.primary.teal}
          />
        </View>
        <View style={styles.profileItemText}>
          <Text style={styles.profileItemTitle}>{item.title}</Text>
          <Text style={styles.profileItemSubtitle}>{item.subtitle}</Text>
        </View>
      </View>

      <View style={styles.profileItemRight}>
        {item.showSwitch && (
          <Switch
            value={item.switchValue}
            onValueChange={item.onPress}
            trackColor={{
              false: theme.colors.border.medium,
              true: theme.colors.primary.tealLight,
            }}
            thumbColor={
              item.switchValue
                ? theme.colors.primary.teal
                : theme.colors.background.card
            }
          />
        )}
        {item.showArrow && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.text.tertiary}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSection = (section) => (
    <View key={section.section} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.section}</Text>
      <View style={styles.sectionContent}>
        {section.items.map(renderProfileItem)}
      </View>
    </View>
  );

  const renderLogoutSection = () => {
    if (!isLoggedIn) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionContent}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={22}
              color={theme.colors.status.error}
            />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          >
            <Ionicons
              name="trash-outline"
              size={22}
              color={theme.colors.status.error}
            />
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaWrapper>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background.primary}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        {isLoggedIn && (
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push("/settings")}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {renderUserHeader()}
        {renderStatsCards()}

        {/* Profile Sections */}
        {profileItems.map(renderSection)}

        {renderLogoutSection()}

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Grociko v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  headerTitle: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: "Outfit-Bold",
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: "center",
  },

  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  contentContainer: {
    paddingBottom: theme.spacing.xxxl,
  },

  // User Header Styles
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.background.card,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  profileImageContainer: {
    position: "relative",
    marginRight: theme.spacing.lg,
  },

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    borderWidth: 3,
    borderColor: theme.colors.primary.teal,
  },

  editImageIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary.teal,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.background.card,
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: "Outfit-Bold",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },

  userEmail: {
    fontSize: theme.typography.sizes.base,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },

  memberSince: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: "Outfit-Medium",
    color: theme.colors.primary.teal,
  },

  editProfileButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.accent,
    justifyContent: "center",
    alignItems: "center",
  },

  // Guest Header Styles
  guestHeader: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xxxl,
    backgroundColor: theme.colors.background.card,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  guestIconContainer: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },

  guestTitle: {
    fontSize: theme.typography.sizes.xxl,
    fontFamily: "Outfit-Bold",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },

  guestSubtitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.tertiary,
    textAlign: "center",
    lineHeight: theme.typography.sizes.base * 1.5,
    marginBottom: theme.spacing.xl,
  },

  authButtons: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },

  loginButton: {
    backgroundColor: theme.colors.primary.teal,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  loginButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.base,
    fontFamily: "Outfit-SemiBold",
  },

  signupButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: theme.colors.primary.teal,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },

  signupButtonText: {
    color: theme.colors.primary.teal,
    fontSize: theme.typography.sizes.base,
    fontFamily: "Outfit-SemiBold",
  },

  // Stats Cards
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },

  statsCard: {
    flex: 1,
    backgroundColor: theme.colors.background.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  statsNumber: {
    fontSize: theme.typography.sizes.xxl,
    fontFamily: "Outfit-Bold",
    color: theme.colors.primary.teal,
    marginBottom: theme.spacing.xs,
  },

  statsLabel: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: "Outfit-Medium",
    color: theme.colors.text.tertiary,
  },

  // Section Styles
  section: {
    marginBottom: theme.spacing.lg,
  },

  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },

  sectionContent: {
    backgroundColor: theme.colors.background.card,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  // Profile Item Styles
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  profileItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  profileItemIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.accent,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },

  profileItemText: {
    flex: 1,
  },

  profileItemTitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },

  profileItemSubtitle: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.tertiary,
  },

  profileItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Logout Section
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    gap: theme.spacing.md,
  },

  logoutButtonText: {
    fontSize: theme.typography.sizes.base,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.status.error,
  },

  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.md,
  },

  deleteButtonText: {
    fontSize: theme.typography.sizes.base,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.status.error,
  },

  // Version
  versionContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    marginTop: theme.spacing.lg,
  },

  versionText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: "Outfit-Medium",
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
  },

  versionSubtext: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.tertiary,
  },
});

export default ProfilePage;
