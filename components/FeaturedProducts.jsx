import ProductCard from '@/components/ProductCard';
import theme from '@/utils/theme';
import { router } from 'expo-router';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const featuredProducts = [
  {
    id: '1',
    name: 'Fresh Avocados',
    price: 4.99,
    originalPrice: 6.99,
    image: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=400',
    discount: '30%',
    unit: 'per piece',
    category: 'fruits',
  },
  {
    id: '2',
    name: 'Organic Bananas',
    price: 2.49,
    image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=400',
    unit: 'per bunch',
    category: 'fruits',
  },
  {
    id: '3',
    name: 'Fresh Salmon',
    price: 12.99,
    originalPrice: 15.99,
    image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
    discount: '20%',
    unit: 'per lb',
    category: 'meat',
  },
  {
    id: '4',
    name: 'Greek Yogurt',
    price: 3.99,
    image: 'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg?auto=compress&cs=tinysrgb&w=400',
    unit: 'per cup',
    category: 'dairy',
  },
  {
    id: '5',
    name: 'Artisan Bread',
    price: 4.49,
    image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=400',
    unit: 'per loaf',
    category: 'bakery',
  },
  {
    id: '6',
    name: 'Cherry Tomatoes',
    price: 3.49,
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400',
    unit: 'per pack',
    category: 'vegetables',
  },
  {
    id: '7',
    name: 'Organic Spinach',
    price: 2.99,
    image: 'https://images.pexels.com/photos/2328460/pexels-photo-2328460.jpeg?auto=compress&cs=tinysrgb&w=400',
    unit: 'per bag',
    category: 'vegetables',
  },
  {
    id: '8',
    name: 'Almond Milk',
    price: 3.79,
    image: 'https://images.pexels.com/photos/6120375/pexels-photo-6120375.jpeg?auto=compress&cs=tinysrgb&w=400',
    unit: 'per carton',
    category: 'dairy',
  },
];

const FeaturedProducts = () => {
  const renderProduct = ({ item }) => (
    <ProductCard product={item} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <TouchableOpacity onPress={() => router.push('/products')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={featuredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
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
});

export default FeaturedProducts;