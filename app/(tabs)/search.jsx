import ProductCard from '@/components/ProductCard';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { useCart } from '@/providers/CartProvider';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - (theme.spacing.lg * 2) - theme.spacing.md) / 2;

// Sample data - In real app, fetch from API
const allProducts = [
  {
    id: '1',
    name: 'Fresh Avocados',
    price: 4.99,
    originalPrice: 6.99,
    image: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'fruits',
    brand: 'Organic Valley',
    rating: 4.8,
    discount: '30%',
    unit: 'per piece',
    tags: ['organic', 'healthy', 'fresh'],
  },
  {
    id: '2',
    name: 'Organic Bananas',
    price: 2.49,
    image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'fruits',
    brand: 'Fresh Farm',
    rating: 4.6,
    unit: 'per bunch',
    tags: ['organic', 'tropical', 'potassium'],
  },
  {
    id: '3',
    name: 'Fresh Salmon',
    price: 12.99,
    originalPrice: 15.99,
    image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'meat',
    brand: 'Ocean Fresh',
    rating: 4.9,
    discount: '20%',
    unit: 'per lb',
    tags: ['fresh', 'protein', 'omega-3'],
  },
  {
    id: '4',
    name: 'Greek Yogurt',
    price: 3.99,
    image: 'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'dairy',
    brand: 'Dairy Pure',
    rating: 4.7,
    unit: 'per cup',
    tags: ['protein', 'probiotics', 'healthy'],
  },
  {
    id: '5',
    name: 'Artisan Bread',
    price: 4.49,
    image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'bakery',
    brand: 'Artisan Bakery',
    rating: 4.5,
    unit: 'per loaf',
    tags: ['fresh', 'artisan', 'handmade'],
  },
  {
    id: '6',
    name: 'Cherry Tomatoes',
    price: 3.49,
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'vegetables',
    brand: 'Fresh Farm',
    rating: 4.4,
    unit: 'per pack',
    tags: ['fresh', 'vitamin-c', 'antioxidants'],
  },
  {
    id: '7',
    name: 'Organic Spinach',
    price: 2.99,
    image: 'https://images.pexels.com/photos/2328460/pexels-photo-2328460.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'vegetables',
    brand: 'Organic Valley',
    rating: 4.3,
    unit: 'per bag',
    tags: ['organic', 'iron', 'leafy-greens'],
  },
  {
    id: '8',
    name: 'Almond Milk',
    price: 3.79,
    image: 'https://images.pexels.com/photos/6120375/pexels-photo-6120375.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'dairy',
    brand: 'Nature\'s Best',
    rating: 4.6,
    unit: 'per carton',
    tags: ['plant-based', 'calcium', 'dairy-free'],
  },
];

const categories = ['all', 'fruits', 'vegetables', 'meat', 'dairy', 'bakery'];
const brands = ['all', 'Organic Valley', 'Fresh Farm', 'Ocean Fresh', 'Dairy Pure', 'Artisan Bakery', 'Nature\'s Best'];
const sortOptions = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'price-low', label: 'Price: Low to High' },
  { key: 'price-high', label: 'Price: High to Low' },
  { key: 'rating', label: 'Rating' },
  { key: 'name', label: 'Name A-Z' },
];

const popularSearches = ['organic', 'fresh', 'vegetables', 'dairy', 'protein', 'healthy'];
const trendingSearches = ['avocado', 'salmon', 'yogurt', 'spinach'];

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [minRating, setMinRating] = useState(0);
  const [showDiscountOnly, setShowDiscountOnly] = useState(false);
  
  const searchInputRef = useRef(null);
  const { totalItems } = useCart();
  const slideAnim = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    if (searchQuery.length > 0) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
      setIsSearchActive(false);
    }
  }, [searchQuery, selectedCategory, selectedBrand, sortBy, priceRange, minRating, showDiscountOnly]);

  const performSearch = (query) => {
    setIsLoading(true);
    setIsSearchActive(true);

    // Simulate API call
    setTimeout(() => {
      let results = allProducts.filter(product => {
        const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) ||
                            product.category.toLowerCase().includes(query.toLowerCase()) ||
                            product.brand.toLowerCase().includes(query.toLowerCase()) ||
                            product.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
        
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        const matchesRating = product.rating >= minRating;
        const matchesDiscount = !showDiscountOnly || product.discount;

        return matchesQuery && matchesCategory && matchesBrand && matchesPrice && matchesRating && matchesDiscount;
      });

      // Sort results
      results = sortResults(results, sortBy);
      
      setSearchResults(results);
      setIsLoading(false);
    }, 500);
  };

  const sortResults = (results, sortType) => {
    switch (sortType) {
      case 'price-low':
        return results.sort((a, b) => a.price - b.price);
      case 'price-high':
        return results.sort((a, b) => b.price - a.price);
      case 'rating':
        return results.sort((a, b) => b.rating - a.rating);
      case 'name':
        return results.sort((a, b) => a.name.localeCompare(b.name));
      case 'relevance':
      default:
        return results;
    }
  };

  const handleSearch = (query) => {
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches(prev => [query.trim(), ...prev.slice(0, 9)]);
    }
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchActive(false);
    searchInputRef.current?.blur();
  };

  const handleRecentSearchPress = (query) => {
    setSearchQuery(query);
    searchInputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const openFilters = () => {
    setShowFilters(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeFilters = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowFilters(false);
    });
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSortBy('relevance');
    setPriceRange([0, 50]);
    setMinRating(0);
    setShowDiscountOnly(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedBrand !== 'all') count++;
    if (sortBy !== 'relevance') count++;
    if (priceRange[0] !== 0 || priceRange[1] !== 50) count++;
    if (minRating > 0) count++;
    if (showDiscountOnly) count++;
    return count;
  };

  const renderSearchSuggestions = () => (
    <ScrollView style={styles.suggestionsContainer} showsVerticalScrollIndicator={false}>
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <View style={styles.suggestionSection}>
          <View style={styles.suggestionHeader}>
            <Text style={styles.suggestionTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={clearRecentSearches}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chipContainer}>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => handleRecentSearchPress(search)}
              >
                <Ionicons name="time-outline" size={16} color={theme.colors.text.tertiary} />
                <Text style={styles.chipText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Popular Searches */}
      <View style={styles.suggestionSection}>
        <Text style={styles.suggestionTitle}>Popular Searches</Text>
        <View style={styles.chipContainer}>
          {popularSearches.map((search, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionChip}
              onPress={() => handleSearch(search)}
            >
              <Ionicons name="trending-up" size={16} color={theme.colors.primary.teal} />
              <Text style={styles.chipText}>{search}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Trending */}
      <View style={styles.suggestionSection}>
        <Text style={styles.suggestionTitle}>Trending Now</Text>
        <View style={styles.chipContainer}>
          {trendingSearches.map((search, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.suggestionChip, styles.trendingChip]}
              onPress={() => handleSearch(search)}
            >
              <Ionicons name="flame" size={16} color={theme.colors.primary.orange} />
              <Text style={[styles.chipText, styles.trendingText]}>{search}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.suggestionSection}>
        <Text style={styles.suggestionTitle}>Browse Categories</Text>
        <View style={styles.categoryGrid}>
          {categories.filter(cat => cat !== 'all').map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryCard}
              onPress={() => handleSearch(category)}
            >
              <Text style={styles.categoryEmoji}>
                {category === 'fruits' ? '🍎' : 
                 category === 'vegetables' ? '🥕' :
                 category === 'meat' ? '🥩' :
                 category === 'dairy' ? '🥛' : '🍞'}
              </Text>
              <Text style={styles.categoryName}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderFilters = () => (
    <Modal
      visible={showFilters}
      transparent={true}
      animationType="none"
      onRequestClose={closeFilters}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.filtersModal,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Filters</Text>
            <View style={styles.filtersHeaderButtons}>
              <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeFilters} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.filtersContent} showsVerticalScrollIndicator={false}>
            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Category</Text>
              <View style={styles.filterOptions}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterOption,
                      selectedCategory === category && styles.filterOptionActive,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedCategory === category && styles.filterOptionTextActive,
                      ]}
                    >
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Brand Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Brand</Text>
              <View style={styles.filterOptions}>
                {brands.map((brand) => (
                  <TouchableOpacity
                    key={brand}
                    style={[
                      styles.filterOption,
                      selectedBrand === brand && styles.filterOptionActive,
                    ]}
                    onPress={() => setSelectedBrand(brand)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedBrand === brand && styles.filterOptionTextActive,
                      ]}
                    >
                      {brand === 'all' ? 'All Brands' : brand}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Sort By</Text>
              <View style={styles.filterOptions}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.filterOption,
                      sortBy === option.key && styles.filterOptionActive,
                    ]}
                    onPress={() => setSortBy(option.key)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        sortBy === option.key && styles.filterOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </Text>
              <View style={styles.priceRangeContainer}>
                <TouchableOpacity
                  style={styles.priceButton}
                  onPress={() => setPriceRange([0, 10])}
                >
                  <Text style={styles.priceButtonText}>$0 - $10</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.priceButton}
                  onPress={() => setPriceRange([10, 25])}
                >
                  <Text style={styles.priceButtonText}>$10 - $25</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.priceButton}
                  onPress={() => setPriceRange([25, 50])}
                >
                  <Text style={styles.priceButtonText}>$25+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Rating Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Minimum Rating</Text>
              <View style={styles.ratingContainer}>
                {[0, 3, 4, 4.5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingOption,
                      minRating === rating && styles.ratingOptionActive,
                    ]}
                    onPress={() => setMinRating(rating)}
                  >
                    <Text
                      style={[
                        styles.ratingOptionText,
                        minRating === rating && styles.ratingOptionTextActive,
                      ]}
                    >
                      {rating === 0 ? 'Any' : `${rating}+ ⭐`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Discount Filter */}
            <View style={styles.filterSection}>
              <TouchableOpacity
                style={styles.discountToggle}
                onPress={() => setShowDiscountOnly(!showDiscountOnly)}
              >
                <View style={styles.discountToggleLeft}>
                  <Ionicons
                    name={showDiscountOnly ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={showDiscountOnly ? theme.colors.primary.teal : theme.colors.text.tertiary}
                  />
                  <Text style={styles.discountToggleText}>Show discounted items only</Text>
                </View>
                {showDiscountOnly && (
                  <Ionicons name="pricetag" size={16} color={theme.colors.primary.orange} />
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.filtersFooter}>
            <TouchableOpacity style={styles.applyFiltersButton} onPress={closeFilters}>
              <Text style={styles.applyFiltersText}>
                Apply Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  const renderSearchResults = () => (
    <View style={styles.resultsContainer}>
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {isLoading ? 'Searching...' : `${searchResults.length} results for "${searchQuery}"`}
        </Text>
        
        <TouchableOpacity style={styles.filtersButton} onPress={openFilters}>
          <Ionicons name="options-outline" size={20} color={theme.colors.text.primary} />
          <Text style={styles.filtersButtonText}>Filters</Text>
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filtersBadge}>
              <Text style={styles.filtersBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {searchResults.length === 0 && !isLoading ? (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search-outline" size={48} color={theme.colors.text.tertiary} />
          <Text style={styles.noResultsTitle}>No results found</Text>
          <Text style={styles.noResultsMessage}>
            Try adjusting your search or filters
          </Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={({ item, index }) => (
            <ProductCard
              product={item}
              width={CARD_WIDTH}
              style={[
                styles.productCard,
              ]}
            />
          )}
          keyExtractor={(item) => item.id}
          // numColumns={2}
          // contentContainerStyle={styles.resultsGrid}
          // columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );

  return (
    <SafeAreaWrapper>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={theme.colors.text.tertiary} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor={theme.colors.text.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
              returnKeyType="search"
              onSubmitEditing={() => handleSearch(searchQuery)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Ionicons name="close-circle" size={20} color={theme.colors.text.tertiary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

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

      {/* Content */}
      {isSearchActive ? renderSearchResults() : renderSearchSuggestions()}

      {/* Filters Modal */}
      {renderFilters()}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    gap: theme.spacing.md,
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

  searchContainer: {
    flex: 1,
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

  // Suggestions Styles
  suggestionsContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  suggestionSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  suggestionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },

  clearText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.primary.teal,
  },

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },

  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.xs,
  },

  trendingChip: {
    backgroundColor: theme.colors.background.accent,
    borderWidth: 1,
    borderColor: theme.colors.primary.orange,
  },

  chipText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.secondary,
  },

  trendingText: {
    color: theme.colors.primary.orange,
  },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },

  categoryCard: {
    width: (width - (theme.spacing.lg * 2) - theme.spacing.md) / 2,
    backgroundColor: theme.colors.background.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },

  categoryEmoji: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },

  categoryName: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },

  // Results Styles
  resultsContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  resultsCount: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.secondary,
    flex: 1,
  },

  filtersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.xs,
    position: 'relative',
  },

  filtersButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.primary,
  },

  filtersBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.primary.orange,
    borderRadius: theme.borderRadius.full,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  filtersBadgeText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.xs,
    fontFamily: 'Outfit-Bold',
  },

  resultsGrid: {
    paddingHorizontal: theme.spacing.lg,
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

  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.huge,
  },

  noResultsTitle: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },

  noResultsMessage: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },

  // Filters Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  filtersModal: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    marginLeft: width * 0.2,
  },

  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  filtersTitle: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.primary,
  },

  filtersHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },

  resetButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.secondary,
  },

  resetButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  filtersContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },

  filterSection: {
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  filterTitle: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },

  filterOptions: {
    gap: theme.spacing.sm,
  },

  filterOption: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },

  filterOptionActive: {
    backgroundColor: theme.colors.primary.teal,
    borderColor: theme.colors.primary.teal,
  },

  filterOptionText: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.secondary,
  },

  filterOptionTextActive: {
    color: theme.colors.text.inverse,
    fontFamily: 'Outfit-SemiBold',
  },

  priceRangeContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  priceButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    alignItems: 'center',
  },

  priceButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },

  ratingContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  ratingOption: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },

  ratingOptionActive: {
    backgroundColor: theme.colors.primary.teal,
    borderColor: theme.colors.primary.teal,
  },

  ratingOptionText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.secondary,
  },

  ratingOptionTextActive: {
    color: theme.colors.text.inverse,
    fontFamily: 'Outfit-SemiBold',
  },

  discountToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },

  discountToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },

  discountToggleText: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.primary,
  },

  filtersFooter: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },

  applyFiltersButton: {
    backgroundColor: theme.colors.primary.teal,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },

  applyFiltersText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
  },
});

export default SearchPage;