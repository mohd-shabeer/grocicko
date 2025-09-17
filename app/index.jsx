import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import theme from '@/utils/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Logo animation sequence
    const logoAnimation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]);

    // Pulse animation for the logo
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Start animations
    logoAnimation.start();
    
    setTimeout(() => {
      pulseAnimation.start();
    }, 800);

    // Navigate to home after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 2000);

    return () => {
      clearTimeout(timer);
      pulseAnimation.stop();
    };
  }, []);

  return (
    <SafeAreaWrapper backgroundColor={theme.colors.background.primary}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.primary} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={[
          theme.colors.background.primary,
          theme.colors.background.accent,
          theme.colors.background.primary,
        ]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Floating Circles Animation */}
      <View style={styles.floatingCirclesContainer}>
        <Animated.View style={[
          styles.floatingCircle,
          styles.circle1,
          {
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, -20],
                }),
              },
            ],
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.6],
            }),
          },
        ]} />
        
        <Animated.View style={[
          styles.floatingCircle,
          styles.circle2,
          {
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 30],
                }),
              },
            ],
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.2, 0.4],
            }),
          },
        ]} />
      </View>

      {/* Main Content */}
      <View style={styles.container}>
        {/* Logo Container */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { scale: pulseAnim },
              ],
            },
          ]}
        >
          <View style={styles.logoWrapper}>
            <Animated.Image
              source={require('@/assets/company/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* App Name and Tagline */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
              ],
            },
          ]}
        >
          <Text style={styles.appName}>Grociko</Text>
          <Text style={styles.tagline}>Fresh • Fast • Delivered</Text>
          
          {/* Loading Indicator */}
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBar}>
              <Animated.View
                style={[
                  styles.loadingProgress,
                  {
                    transform: [
                      {
                        scaleX: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Decoration */}
      <Animated.View
        style={[
          styles.bottomDecoration,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.1],
            }),
          },
        ]}
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  
  floatingCirclesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  floatingCircle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: theme.colors.primary.teal,
  },
  
  circle1: {
    width: 120,
    height: 120,
    top: height * 0.15,
    right: -60,
  },
  
  circle2: {
    width: 80,
    height: 80,
    bottom: height * 0.2,
    left: -40,
    backgroundColor: theme.colors.primary.orange,
  },
  
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  
  logoContainer: {
    marginBottom: theme.spacing.huge,
  },
  
  logoWrapper: {
    width: 140,
    height: 140,
    borderRadius: theme.borderRadius.xxl,
    backgroundColor: theme.colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  
  logo: {
    width: 100,
    height: 100,
  },
  
  textContainer: {
    alignItems: 'center',
  },
  
  appName: {
    fontSize: theme.typography.sizes.huge,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    letterSpacing: -0.5,
  },
  
  tagline: {
    fontSize: theme.typography.sizes.md,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xxxl,
    letterSpacing: 0.5,
  },
  
  loadingContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  
  loadingBar: {
    width: 200,
    height: 3,
    backgroundColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  
  loadingProgress: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.primary.teal,
    borderRadius: theme.borderRadius.full,
    transformOrigin: 'left',
  },
  
  bottomDecoration: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: theme.colors.primary.teal,
  },
});

export default SplashScreen;