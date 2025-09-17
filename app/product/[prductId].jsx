import SafeAreaWrapper from "@/components/SafeAreaWrapper";
import { useCart } from "@/providers/CartProvider";
import { useFavorites } from "@/providers/FavoritesProvider";
import theme from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    PanGestureHandler,
    PinchGestureHandler,
    State,
} from "react-native-gesture-handler";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Sample product data - In real app, fetch based on productId
const getProductById = (id) => ({
  id,
  name: "Fresh Organic Avocados",
  price: 4.99,
  originalPrice: 6.99,
  discount: "30%",
  rating: 4.8,
  reviewsCount: 124,
  unit: "per piece",
  category: "Fruits",
  brand: "Organic Valley",
  stock: 45,
  description:
    "Premium quality organic avocados sourced directly from certified organic farms. These creamy, nutrient-rich avocados are perfect for salads, toast, guacamole, and smoothies. Packed with healthy fats, fiber, and potassium.",
  nutritionFacts: {
    calories: 234,
    fat: "21g",
    saturatedFat: "3g",
    carbs: "12g",
    fiber: "10g",
    sugar: "1g",
    protein: "3g",
    potassium: "690mg",
    vitamin: "K, C, E",
  },
  features: [
    "USDA Organic Certified",
    "Hand-picked at peak ripeness",
    "Rich in healthy monounsaturated fats",
    "High in fiber and potassium",
    "Perfect for heart-healthy diet",
    "Naturally gluten-free",
  ],
  images: [
    "https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4198018/pexels-photo-4198018.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4198018/pexels-photo-4198018.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2228553/pexels-photo-2228553.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  seller: {
    name: "Farm Fresh Co.",
    rating: 4.9,
    location: "California, USA",
  },
  shipping: {
    freeShipping: true,
    estimatedDays: "2-3 days",
    returnPolicy: "7-day return policy",
  },
});

const ProductDetailPage = () => {
  const { productId } = useLocalSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const carouselRef = useRef(null);
  // Animation values for zoom
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const product = getProductById(productId);
  const quantity = getItemQuantity(product.id);
  const isProductFavorite = isFavorite(product.id);

  const handleAddToCart = () => {
    const currentQuantity = getItemQuantity(product.id);
    if (currentQuantity > 0) {
      updateQuantity(product.id, currentQuantity + 1);
    } else {
      addToCart(product, 1);
    }
  };

  const handleQuantityChange = (change) => {
    const currentQuantity = getItemQuantity(product.id);
    const newQuantity = Math.max(0, currentQuantity + change);
    updateQuantity(product.id, newQuantity);
  };

  const handleImagePress = (index) => {
    setCurrentImageIndex(index);
    setIsImageModalVisible(true);
  };

  const onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: scale } }],
    { useNativeDriver: true }
  );

  const onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );

  const resetImageTransform = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
    ]).start();
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={16} color="#FFD700" />);
    }
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#FFD700" />
      );
    }
    return stars;
  };

  const renderImageItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => handleImagePress(index)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item }} style={styles.carouselImage} />
    </TouchableOpacity>
  );

  const renderThumbnail = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.thumbnail,
        currentImageIndex === index && styles.activeThumbnail,
      ]}
      onPress={() => setCurrentImageIndex(index)}
    >
      <Image source={{ uri: item }} style={styles.thumbnailImage} />
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.descriptionText}>{product.description}</Text>

            <Text style={styles.sectionTitle}>Key Features</Text>
            {product.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={theme.colors.primary.teal}
                />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        );

      case "nutrition":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>
              Nutrition Facts (per serving)
            </Text>
            <View style={styles.nutritionGrid}>
              {Object.entries(product.nutritionFacts).map(([key, value]) => (
                <View key={key} style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Text>
                  <Text style={styles.nutritionValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      case "reviews":
        return (
          <View style={styles.tabContent}>
            <View style={styles.reviewsSummary}>
              <View style={styles.ratingOverview}>
                <Text style={styles.overallRating}>{product.rating}</Text>
                <View style={styles.starsContainer}>
                  {renderStars(product.rating)}
                </View>
                <Text style={styles.reviewsCount}>
                  ({product.reviewsCount} reviews)
                </Text>
              </View>
            </View>
            <Text style={styles.comingSoon}>
              Detailed reviews coming soon...
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaWrapper>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background.primary}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/cart")}
          style={styles.headerButton}
        >
          <Ionicons
            name="bag-outline"
            size={24}
            color={theme.colors.text.primary}
          />
          {quantity > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{quantity}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.imageSection}>
          <FlatList
            ref={carouselRef}
            data={product.images}
            renderItem={renderImageItem}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / screenWidth
              );
              setCurrentImageIndex(index);
            }}
            getItemLayout={(data, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
          />

          {/* Image Indicator */}
          <View style={styles.imageIndicator}>
            {product.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicatorDot,
                  currentImageIndex === index && styles.indicatorDotActive,
                ]}
              />
            ))}
          </View>

          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={() => toggleFavorite(product)}
          >
            <Ionicons
              name={isProductFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isProductFavorite ? "#E74C3C" : theme.colors.text.tertiary}
            />
          </TouchableOpacity>
        </View>

        {/* Thumbnails */}
        <FlatList
          data={product.images}
          renderItem={renderThumbnail}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailContainer}
        />

        {/* Product Info */}
        <View style={styles.productInfo}>
          {/* Discount Badge */}
          {product.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount} OFF</Text>
            </View>
          )}

          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.brandName}>by {product.brand}</Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(product.rating)}
            </View>
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviewsCount} reviews)
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>${product.originalPrice}</Text>
            )}
            <Text style={styles.unitText}>{product.unit}</Text>
          </View>

          {/* Stock */}
          <Text style={styles.stockText}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={theme.colors.status.success}
            />{" "}
            {product.stock} in stock
          </Text>

          {/* Seller Info */}
          <View style={styles.sellerInfo}>
            <Text style={styles.sellerLabel}>Sold by</Text>
            <Text style={styles.sellerName}>{product.seller.name}</Text>
            <View style={styles.sellerRating}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.sellerRatingText}>
                {product.seller.rating}
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabButtons}>
            {["description", "nutrition", "reviews"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === tab && styles.activeTabButtonText,
                  ]}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {renderTabContent()}
        </View>

        {/* Shipping Info */}
        <View style={styles.shippingInfo}>
          <View style={styles.shippingItem}>
            <Ionicons
              name="car-outline"
              size={20}
              color={theme.colors.primary.teal}
            />
            <Text style={styles.shippingText}>
              {product.shipping.freeShipping
                ? "Free Shipping"
                : "Standard Shipping"}
            </Text>
          </View>
          <View style={styles.shippingItem}>
            <Ionicons
              name="time-outline"
              size={20}
              color={theme.colors.primary.teal}
            />
            <Text style={styles.shippingText}>
              Delivery in {product.shipping.estimatedDays}
            </Text>
          </View>
          <View style={styles.shippingItem}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={theme.colors.primary.teal}
            />
            <Text style={styles.shippingText}>
              {product.shipping.returnPolicy}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        {quantity === 0 ? (
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Ionicons
              name="bag-add"
              size={20}
              color={theme.colors.text.inverse}
            />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(-1)}
            >
              <Ionicons
                name="remove"
                size={20}
                color={theme.colors.primary.teal}
              />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(1)}
            >
              <Ionicons
                name="add"
                size={20}
                color={theme.colors.primary.teal}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Full Screen Image Modal */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setIsImageModalVisible(false);
          resetImageTransform();
        }}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setIsImageModalVisible(false);
              resetImageTransform();
            }}
          >
            <Ionicons
              name="close"
              size={30}
              color={theme.colors.text.inverse}
            />
          </TouchableOpacity>

          <PanGestureHandler
            onGestureEvent={onPanGestureEvent}
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.state === State.END) {
                if (scale._value === 1) {
                  resetImageTransform();
                }
              }
            }}
          >
            <Animated.View style={styles.modalImageContainer}>
              <PinchGestureHandler
                onGestureEvent={onPinchGestureEvent}
                onHandlerStateChange={({ nativeEvent }) => {
                  if (nativeEvent.state === State.END) {
                    if (nativeEvent.scale < 1) {
                      resetImageTransform();
                    }
                  }
                }}
              >
                <Animated.Image
                  source={{ uri: product.images[currentImageIndex] }}
                  style={[
                    styles.modalImage,
                    {
                      transform: [
                        { scale: scale },
                        { translateX: translateX },
                        { translateY: translateY },
                      ],
                    },
                  ]}
                  resizeMode="contain"
                />
              </PinchGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </Modal>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  headerBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: theme.colors.primary.orange,
    borderRadius: theme.borderRadius.full,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xs,
  },

  headerBadgeText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.xs,
    fontFamily: "Outfit-SemiBold",
  },

  imageSection: {
    height: 300,
    position: "relative",
  },

  carouselImage: {
    width: screenWidth,
    height: 300,
    resizeMode: "cover",
  },

  imageIndicator: {
    position: "absolute",
    bottom: theme.spacing.lg,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },

  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },

  indicatorDotActive: {
    backgroundColor: theme.colors.text.inverse,
    width: 20,
  },

  favoriteBtn: {
    position: "absolute",
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  thumbnailContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },

  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    marginRight: theme.spacing.sm,
    borderWidth: 2,
    borderColor: "transparent",
  },

  activeThumbnail: {
    borderColor: theme.colors.primary.teal,
  },

  thumbnailImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  productInfo: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },

  discountBadge: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primary.orange,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },

  discountText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.sm,
    fontFamily: "Outfit-SemiBold",
  },

  productName: {
    fontSize: theme.typography.sizes.xxxl,
    fontFamily: "Outfit-Bold",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.sizes.xxxl * 1.2,
  },

  brandName: {
    fontSize: theme.typography.sizes.md,
    fontFamily: "Outfit-Medium",
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },

  starsContainer: {
    flexDirection: "row",
    marginRight: theme.spacing.sm,
  },

  ratingText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.tertiary,
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: theme.spacing.md,
  },

  price: {
    fontSize: theme.typography.sizes.huge,
    fontFamily: "Outfit-Bold",
    color: theme.colors.primary.teal,
    marginRight: theme.spacing.sm,
  },

  originalPrice: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.tertiary,
    textDecorationLine: "line-through",
    marginRight: theme.spacing.sm,
  },

  unitText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.tertiary,
  },

  stockText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: "Outfit-Medium",
    color: theme.colors.status.success,
    marginBottom: theme.spacing.lg,
  },

  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },

  sellerLabel: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.tertiary,
  },

  sellerName: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
    flex: 1,
  },

  sellerRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },

  sellerRatingText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: "Outfit-Medium",
    color: theme.colors.text.secondary,
  },

  tabsContainer: {
    marginTop: theme.spacing.xl,
  },

  tabButtons: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  tabButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginRight: theme.spacing.sm,
  },

  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary.teal,
  },

  tabButtonText: {
    fontSize: theme.typography.sizes.base,
    fontFamily: "Outfit-Medium",
    color: theme.colors.text.tertiary,
  },

  activeTabButtonText: {
    color: theme.colors.primary.teal,
    fontFamily: "Outfit-SemiBold",
  },

  tabContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },

  descriptionText: {
    fontSize: theme.typography.sizes.base,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.sizes.base * 1.5,
    marginBottom: theme.spacing.xl,
  },

  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },

  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },

  featureText: {
    fontSize: theme.typography.sizes.base,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.secondary,
    flex: 1,
  },

  nutritionGrid: {
    gap: theme.spacing.md,
  },

  nutritionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  nutritionLabel: {
    fontSize: theme.typography.sizes.base,
    fontFamily: "Outfit-Medium",
    color: theme.colors.text.primary,
  },

  nutritionValue: {
    fontSize: theme.typography.sizes.base,
    fontFamily: "Outfit-SemiBold",
    color: theme.colors.primary.teal,
  },

  reviewsSummary: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },

  ratingOverview: {
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  overallRating: {
    fontSize: theme.typography.sizes.huge,
    fontFamily: "Outfit-Bold",
    color: theme.colors.text.primary,
  },

  reviewsCount: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.tertiary,
  },

  comingSoon: {
    fontSize: theme.typography.sizes.base,
    fontFamily: "Outfit-Regular",
    color: theme.colors.text.tertiary,
    textAlign: "center",
    fontStyle: "italic",
  },

  shippingInfo: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.background.accent,
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },

  shippingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },

  shippingText: {
    fontSize: theme.typography.sizes.base,
    fontFamily: "Outfit-Medium",
    color: theme.colors.text.secondary,
  },

  bottomBar: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.background.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },

  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary.teal,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },

  addToCartText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.lg,
    fontFamily: "Outfit-SemiBold",
  },

  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.card,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  quantityText: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: "Outfit-Bold",
    color: theme.colors.text.primary,
    marginHorizontal: theme.spacing.xl,
    minWidth: 30,
    textAlign: "center",
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1000,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalScrollContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalImage: {
    width: screenWidth,
    height: screenHeight * 0.7,
  },

  modalImageNavigation: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
  },

  modalNavButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalNavButtonDisabled: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  modalImageCounter: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.base,
    fontFamily: "Outfit-Medium",
  },
});

export default ProductDetailPage;
