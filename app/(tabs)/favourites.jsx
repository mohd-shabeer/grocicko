import ProductCard from '@/components/ProductCard';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { useCart } from '@/providers/CartProvider';
import { useFavorites } from '@/providers/FavoritesProvider';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - (theme.spacing.lg * 2) - theme.spacing.md) / 2;

const FavoritesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // recent, name, price
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { 
    favorites, 
    totalFavorites, 
    searchFavorites, 
    getFavoritesByCategory,
    clearFavorites,
    getFavoritesSummary,
  } = useFavorites();

  const { totalItems } = useCart();

  // Get filtered and sorted favorites
  const getFilteredFavorites = () => {
    let filteredFavorites = favorites;

    // Filter by search query
    if (searchQuery.trim()) {
      filteredFavorites = searchFavorites(searchQuery);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filteredFavorites = filteredFavorites.filter(
        item => item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort favorites
    switch (sortBy) {
      case 'name':
        return filteredFavorites.sort((a, b) => a.name.localeCompare(b.name));
      case 'price':
        return filteredFavorites.sort((a, b) => a.price - b.price);
      case 'recent':
      default:
        return filteredFavorites.sort((a, b) => 
          new Date(b.addedAt) - new Date(a.addedAt)
        );
    }
  };

  const filteredFavorites = getFilteredFavorites();
  const favoritesSummary = getFavoritesSummary();

  // Get unique categories from favorites
  const categories = ['all', ...favoritesSummary.categories];

  const handleClearAll = () => {
    clearFavorites();
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={theme.colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search favorites..."
            placeholderTextColor={theme.colors.text.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {totalFavorites} {totalFavorites === 1 ? 'favorite' : 'favorites'}
        </Text>
        {totalFavorites > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      {categories.length > 1 && (
        <View style={styles.filtersContainer}>
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  selectedCategory === item && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === item && styles.categoryChipTextActive,
                  ]}
                >
                  {item === 'all' ? 'All' : item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />
        </View>
      )}

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.sortButtons}>
          {[
            { key: 'recent', label: 'Recent' },
            { key: 'name', label: 'Name' },
            { key: 'price', label: 'Price' },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortButton,
                sortBy === option.key && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy(option.key)}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === option.key && styles.sortButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="heart-outline" size={64} color={theme.colors.text.tertiary} />
      </View>
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyMessage}>
        {searchQuery.trim() 
          ? `No favorites found for "${searchQuery}"`
          : "Start adding products to your favorites by tapping the heart icon"
        }
      </Text>
      {!searchQuery.trim() && (
        <TouchableOpacity
          style={styles.browseProduesButton}
          onPress={() => router.push('/home')}
        >
          <Text style={styles.browseProductsText}>Browse Products</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderProduct = ({ item, index }) => (
    <ProductCard 
      product={item}
      width={CARD_WIDTH}
      style={[
        styles.productCard,
        // index % 2 === 0 ? styles.leftCard : styles.rightCard,
      ]}
    />
  );

  return (
    <SafeAreaWrapper>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Favorites</Text>

        <TouchableOpacity onPress={() => router.push('/cart')} style={styles.headerButton}>
          <Ionicons name="bag-outline" size={24} color={theme.colors.text.primary} />
          {totalItems > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>
                {totalItems > 99 ? '99+' : totalItems}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {totalFavorites === 0 && !searchQuery.trim() ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredFavorites}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={searchQuery.trim() ? renderEmptyState : null}
          // columnWrapperStyle={styles.row}
        />
      )}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  headerButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  headerTitle: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },

  headerBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: theme.colors.primary.orange,
    borderRadius: theme.borderRadius.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },

  headerBadgeText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.xs,
    fontFamily: 'Outfit-SemiBold',
  },

  headerContent: {
    paddingBottom: theme.spacing.lg,
  },

  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },

  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },

  searchInput: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.xs,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },

  statsText: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.secondary,
  },

  clearButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.status.error,
  },

  clearButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.inverse,
  },

  filtersContainer: {
    marginBottom: theme.spacing.md,
  },

  categoryList: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },

  categoryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    marginRight: theme.spacing.sm,
  },

  categoryChipActive: {
    backgroundColor: theme.colors.primary.teal,
    borderColor: theme.colors.primary.teal,
  },

  categoryChipText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.secondary,
  },

  categoryChipTextActive: {
    color: theme.colors.text.inverse,
    fontFamily: 'Outfit-SemiBold',
  },

  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },

  sortLabel: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.secondary,
  },

  sortButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  sortButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.secondary,
  },

  sortButtonActive: {
    backgroundColor: theme.colors.primary.tealLight,
  },

  sortButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.tertiary,
  },

  sortButtonTextActive: {
    color: theme.colors.text.inverse,
    fontFamily: 'Outfit-SemiBold',
  },

  listContainer: {
    // paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },

  row: {
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },

  productCard: {
    marginBottom: theme.spacing.lg,
  },

  leftCard: {
    marginRight: theme.spacing.xs,
  },

  rightCard: {
    marginLeft: theme.spacing.xs,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.huge,
  },

  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },

  emptyTitle: {
    fontSize: theme.typography.sizes.xxl,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },

  emptyMessage: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: theme.typography.sizes.base * 1.5,
    marginBottom: theme.spacing.xl,
  },

  browseProduesButton: {
    backgroundColor: theme.colors.primary.teal,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },

  browseProductsText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
  },
});

export default FavoritesPage;