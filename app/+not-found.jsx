import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import {
    Dimensions,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const NotFoundPage = () => {
  const pathname = usePathname();

  const handleGoHome = () => {
    router.replace('/home');
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  };

  const handleReportIssue = () => {
    // In real app, you might send error reports or navigate to feedback
    router.push('/contact');
  };

  return (
    <SafeAreaWrapper>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.primary} />
      
      <View style={styles.container}>
        {/* Decorative Background Elements */}
        <View style={styles.backgroundElements}>
          <View style={[styles.floatingCircle, styles.circle1]} />
          <View style={[styles.floatingCircle, styles.circle2]} />
          <View style={[styles.floatingCircle, styles.circle3]} />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/company/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* 404 Illustration */}
          <View style={styles.illustrationContainer}>
            <View style={styles.numberContainer}>
              <Text style={styles.number}>4</Text>
              <View style={styles.zeroContainer}>
                <Ionicons 
                  name="search-outline" 
                  size={60} 
                  color={theme.colors.primary.teal} 
                />
              </View>
              <Text style={styles.number}>4</Text>
            </View>
          </View>

          {/* Error Message */}
          <View style={styles.messageContainer}>
            <Text style={styles.title}>Oops! Page Not Found</Text>
            <Text style={styles.subtitle}>
              The page you're looking for seems to have wandered off to the grocery store
            </Text>
            
            {/* Show current path for debugging */}
            <View style={styles.pathContainer}>
              <Text style={styles.pathLabel}>Requested path:</Text>
              <Text style={styles.pathText}>{pathname}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleGoHome}
              activeOpacity={0.8}
            >
              <Ionicons name="home" size={20} color={theme.colors.text.inverse} />
              <Text style={styles.primaryButtonText}>Go to Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleGoBack}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={20} color={theme.colors.primary.teal} />
              <Text style={styles.secondaryButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Links */}
          <View style={styles.quickLinksContainer}>
            <Text style={styles.quickLinksTitle}>Quick Links</Text>
            <View style={styles.quickLinks}>
              <TouchableOpacity
                style={styles.quickLink}
                onPress={() => router.push('/search')}
              >
                <Ionicons name="search" size={18} color={theme.colors.primary.teal} />
                <Text style={styles.quickLinkText}>Search</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickLink}
                onPress={() => router.push('/favourites')}
              >
                <Ionicons name="heart" size={18} color={theme.colors.primary.teal} />
                <Text style={styles.quickLinkText}>Favorites</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickLink}
                onPress={() => router.push('/cart')}
              >
                <Ionicons name="bag" size={18} color={theme.colors.primary.teal} />
                <Text style={styles.quickLinkText}>Cart</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickLink}
                onPress={() => router.push('/profile')}
              >
                <Ionicons name="person" size={18} color={theme.colors.primary.teal} />
                <Text style={styles.quickLinkText}>Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Help Section */}
          <View style={styles.helpSection}>
            <TouchableOpacity
              style={styles.helpButton}
              onPress={handleReportIssue}
              activeOpacity={0.7}
            >
              <Ionicons name="bug-outline" size={16} color={theme.colors.text.tertiary} />
              <Text style={styles.helpButtonText}>Report an Issue</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Need help? Contact our support team
          </Text>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    position: 'relative',
  },

  // Background Elements
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  floatingCircle: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.1,
  },

  circle1: {
    width: 120,
    height: 120,
    backgroundColor: theme.colors.primary.teal,
    top: height * 0.1,
    right: -60,
  },

  circle2: {
    width: 80,
    height: 80,
    backgroundColor: theme.colors.primary.orange,
    bottom: height * 0.2,
    left: -40,
  },

  circle3: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.primary.teal,
    top: height * 0.3,
    left: width * 0.2,
  },

  // Main Content
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    zIndex: 1,
  },

  logoContainer: {
    marginBottom: theme.spacing.xl,
  },

  logo: {
    width: 80,
    height: 80,
    opacity: 0.8,
  },

  // 404 Illustration
  illustrationContainer: {
    marginBottom: theme.spacing.xxxl,
    alignItems: 'center',
  },

  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  number: {
    fontSize: 120,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.primary.teal,
    opacity: 0.8,
  },

  zeroContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.background.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.primary.teal,
    borderStyle: 'dashed',
  },

  // Message Section
  messageContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl,
  },

  title: {
    fontSize: theme.typography.sizes.xxxl,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },

  subtitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: theme.typography.sizes.base * 1.5,
    marginBottom: theme.spacing.lg,
    maxWidth: width * 0.8,
  },

  pathContainer: {
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },

  pathLabel: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
  },

  pathText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xxxl,
  },

  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.teal,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },

  primaryButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
  },

  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary.teal,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },

  secondaryButtonText: {
    color: theme.colors.primary.teal,
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
  },

  // Quick Links
  quickLinksContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },

  quickLinksTitle: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },

  quickLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },

  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },

  quickLinkText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.primary,
  },

  // Help Section
  helpSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },

  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
  },

  helpButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
    textDecorationLine: 'underline',
  },

  // Footer
  footer: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },

  footerText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
});

export default NotFoundPage;