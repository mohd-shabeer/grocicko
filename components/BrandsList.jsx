import theme from '@/utils/theme';
import { router } from 'expo-router';
import { useRef } from 'react';
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const brands = [
  {
    id: '1',
    name: 'Organic Valley',
    logo: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    route: '/brand/organic-valley',
  },
  {
    id: '2',
    name: 'Fresh Farm',
    logo: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    route: '/brand/fresh-farm',
  },
  {
    id: '3',
    name: 'Nature\'s Best',
    logo: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    route: '/brand/natures-best',
  },
  {
    id: '4',
    name: 'Ocean Fresh',
    logo: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    route: '/brand/ocean-fresh',
  },
  {
    id: '5',
    name: 'Artisan Bakery',
    logo: 'https://images.pexels.com/photos/298217/pexels-photo-298217.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    route: '/brand/artisan-bakery',
  },
  {
    id: '6',
    name: 'Dairy Pure',
    logo: 'https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    route: '/brand/dairy-pure',
  },
  {
    id: '7',
    name: 'Natural Foods',
    logo: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    route: '/brand/natural-foods',
  },
  {
    id: '8',
    name: 'Green Market',
    logo: 'https://images.pexels.com/photos/1400172/pexels-photo-1400172.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    route: '/brand/green-market',
  },
];

// Separate component for individual brand item to use hooks properly
const BrandItem = ({ item, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.brandContainer,
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <TouchableOpacity
        style={styles.brandItem}
        onPress={() => onPress(item)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.brandImageContainer}>
          <Image 
            source={{ uri: item.logo }} 
            style={styles.brandImage}
          />
          {/* Subtle gradient overlay for better contrast */}
          <View style={styles.imageOverlay} />
        </View>
        
        <Text style={styles.brandName} numberOfLines={2}>
          {item.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const BrandsList = () => {
  const handleBrandPress = (brand) => {
    router.push(brand.route);
  };

  const renderBrand = ({ item }) => (
    <BrandItem item={item} onPress={handleBrandPress} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Popular Brands</Text>
        <TouchableOpacity 
          onPress={() => router.push('/brands')}
          style={styles.seeAllButton}
        >
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={brands}
        renderItem={renderBrand}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        decelerationRate="fast"
        snapToInterval={85} // Width of item + separator
        snapToAlignment="start"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.xl,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },

  sectionTitle: {
    fontSize: theme.typography.sizes.xxl,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.primary,
  },

  seeAllButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },

  seeAll: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.primary.teal,
  },

  listContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },

  separator: {
    width: theme.spacing.md,
  },

  brandContainer: {
    alignItems: 'center',
  },

  brandItem: {
    alignItems: 'center',
    width: 70,
  },

  brandImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
    position: 'relative',
    // Modern elevated shadow
    shadowColor: theme.colors.primary.teal,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    // Subtle border for definition
    borderWidth: 2,
    borderColor: 'rgba(60, 170, 145, 0.08)',
  },

  brandImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(60, 170, 145, 0.02)',
  },

  brandName: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.primary,
    textAlign: 'center',
    lineHeight: theme.typography.sizes.xs * 1.3,
    marginTop: theme.spacing.xs,
    minHeight: theme.typography.sizes.xs * 2.6, // Ensure consistent height for 2 lines
  },
});

export default BrandsList;