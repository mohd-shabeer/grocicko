import theme from '@/utils/theme';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - (theme.spacing.lg * 2);
const ITEM_WIDTH = SLIDER_WIDTH;

const sliderData = [
  {
    id: '1',
    subtitle: 'Fresh Arrivals',
    title: 'Organic Fruits & Vegetables',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'fruits',
  },
  {
    id: '2',
    subtitle: 'Premium Quality',
    title: 'Farm Fresh Dairy Products',
    image: 'https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'dairy',
  },
  {
    id: '3',
    subtitle: 'Special Offer',
    title: 'Artisan Bakery Collection',
    image: 'https://images.pexels.com/photos/298217/pexels-photo-298217.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'bakery',
  },
];

const HeroSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % sliderData.length;
      handleScroll(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleScroll = (index) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    scrollViewRef.current?.scrollTo({
      x: index * ITEM_WIDTH,
      animated: true,
    });
    setActiveIndex(index);
  };

  const handleShopNow = (category) => {
    // Navigate to category page
    console.log('Shop now:', category);
  };

  const onMomentumScrollEnd = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setActiveIndex(pageNum);
  };

  const renderSlide = (item) => (
    <View key={item.id} style={styles.slide}>
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.slideBackground}
        imageStyle={styles.slideImage}
      >
        <View style={styles.overlay} />
        <Animated.View style={[styles.slideContent, { opacity: fadeAnim }]}>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => handleShopNow(item.category)}
            activeOpacity={0.8}
          >
            <Text style={styles.shopButtonText}>Shop Now</Text>
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        contentContainerStyle={styles.scrollContainer}
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH}
        snapToAlignment="center"
      >
        {sliderData.map(renderSlide)}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {sliderData.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              activeIndex === index && styles.paginationDotActive,
            ]}
            onPress={() => handleScroll(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.lg,
  },

  scrollContainer: {
    paddingHorizontal: theme.spacing.lg,
  },

  slide: {
    width: ITEM_WIDTH,
    height: 200,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginRight: theme.spacing.md,
  },

  slideBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  slideImage: {
    borderRadius: theme.borderRadius.xl,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: theme.borderRadius.xl,
  },

  slideContent: {
    padding: theme.spacing.xl,
    flex: 1,
    justifyContent: 'center',
  },

  subtitle: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.primary.orange,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  title: {
    fontSize: theme.typography.sizes.xxl,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing.lg,
    lineHeight: theme.typography.sizes.xxl * 1.2,
    maxWidth: '80%',
  },

  shopButton: {
    backgroundColor: '#73a619',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignSelf: 'flex-start',
    ...theme.shadows.md,
  },

  shopButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },

  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border.medium,
  },

  paginationDotActive: {
    backgroundColor: theme.colors.primary.teal,
    width: 24,
  },
});

export default HeroSlider;