import theme from '@/utils/theme';
import { router } from 'expo-router';
import {
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
    description: 'Premium organic products',
    productsCount: 45,
    route: '/brand/organic-valley',
  },
  {
    id: '2',
    name: 'Fresh Farm',
    logo: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    description: 'Farm fresh produce',
    productsCount: 32,
    route: '/brand/fresh-farm',
  },
  {
    id: '3',
    name: 'Nature\'s Best',
    logo: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    description: 'Natural & healthy foods',
    productsCount: 28,
    route: '/brand/natures-best',
  },
  {
    id: '4',
    name: 'Ocean Fresh',
    logo: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    description: 'Fresh seafood & fish',
    productsCount: 18,
    route: '/brand/ocean-fresh',
  },
  {
    id: '5',
    name: 'Artisan Bakery',
    logo: 'https://images.pexels.com/photos/298217/pexels-photo-298217.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    description: 'Handcrafted bread & pastries',
    productsCount: 24,
    route: '/brand/artisan-bakery',
  },
  {
    id: '6',
    name: 'Dairy Pure',
    logo: 'https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    description: 'Pure dairy products',
    productsCount: 36,
    route: '/brand/dairy-pure',
  },
];

const BrandsList = () => {
  const handleBrandPress = (brand) => {
    router.push(brand.route);
  };

  const renderBrand = ({ item }) => (
    <TouchableOpacity
      style={styles.brandCard}
      onPress={() => handleBrandPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.brandImageContainer}>
        <Image source={{ uri: item.logo }} style={styles.brandImage} />
      </View>
      
      <View style={styles.brandInfo}>
        <Text style={styles.brandName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.brandDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.productsCount}>
          {item.productsCount} products
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Popular Brands</Text>
        <TouchableOpacity onPress={() => router.push('/brands')}>
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

  seeAll: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.primary.teal,
  },

  listContainer: {
    paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
    
  },

  separator: {
    width: theme.spacing.md,
  },

  brandCard: {
    width: 140,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },

  brandImageContainer: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },

  brandImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  brandInfo: {
    alignItems: 'center',
    flex: 1,
  },

  brandName: {
    fontSize: theme.typography.sizes.md,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },

  brandDescription: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    lineHeight: theme.typography.sizes.sm * 1.3,
  },

  productsCount: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.primary.teal,
    backgroundColor: theme.colors.background.accent,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
});

export default BrandsList;