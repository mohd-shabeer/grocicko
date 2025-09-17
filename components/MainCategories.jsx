import theme from '@/utils/theme';
import { router } from 'expo-router';
import {
    FlatList,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const categories = [
  {
    id: '1',
    name: 'Fresh Fruits',
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#FF6B6B',
    route: '/category/fruits',
  },
  {
    id: '2',
    name: 'Vegetables',
    image: 'https://images.pexels.com/photos/1400172/pexels-photo-1400172.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#4ECDC4',
    route: '/category/vegetables',
  },
  {
    id: '3',
    name: 'Dairy & Eggs',
    image: 'https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#45B7D1',
    route: '/category/dairy',
  },
  {
    id: '4',
    name: 'Meat & Fish',
    image: 'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#F39C12',
    route: '/category/meat',
  },
  {
    id: '5',
    name: 'Bakery',
    image: 'https://images.pexels.com/photos/298217/pexels-photo-298217.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#9B59B6',
    route: '/category/bakery',
  },
  {
    id: '6',
    name: 'Beverages',
    image: 'https://images.pexels.com/photos/1194434/pexels-photo-1194434.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#E74C3C',
    route: '/category/beverages',
  },
];

const MainCategories = () => {
  const handleCategoryPress = (category) => {
    router.push(category.route);
  };

  const renderCategory = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        index % 2 === 0 ? styles.leftCard : styles.rightCard,
      ]}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.categoryBackground}
        imageStyle={styles.categoryImage}
      >
        <View style={[styles.categoryOverlay, { backgroundColor: `${item.color}20` }]} />
        <View style={styles.categoryContent}>
          <Text style={styles.categoryName}>{item.name}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity onPress={() => router.push('/categories')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  gridContainer: {
    gap: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    
  },

  row: {
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },

  categoryCard: {
    flex: 1,
    height: 120,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },

  leftCard: {
    marginRight: theme.spacing.xs,
  },

  rightCard: {
    marginLeft: theme.spacing.xs,
  },

  categoryBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  categoryImage: {
    borderRadius: theme.borderRadius.xl,
  },

  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: theme.borderRadius.xl,
  },

  categoryContent: {
    padding: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
  },

  categoryName: {
    fontSize: theme.typography.sizes.md,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
});

export default MainCategories;