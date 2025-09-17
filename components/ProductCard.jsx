import { useCart } from '@/providers/CartProvider';
import { useFavorites } from '@/providers/FavoritesProvider';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ProductCard = ({ 
  product, 
  showDiscount = true,
  showUnit = true,
  onPress,
  style 
}) => {
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleProductPress = () => {
    if (onPress) {
      onPress(product);
    } else {
      router.push(`/product/${product.id}`);
    }
  };

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

  const quantity = getItemQuantity(product.id);
  const isProductFavorite = isFavorite(product.id);

  return (
    <TouchableOpacity
      style={[styles.productCard, style]}
      onPress={handleProductPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        
        {/* Discount Badge */}
        {showDiscount && product.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{product.discount}</Text>
          </View>
        )}

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(product)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isProductFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isProductFavorite ? '#E74C3C' : theme.colors.text.tertiary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Unit */}
        {showUnit && product.unit && (
          <Text style={styles.unitText}>{product.unit}</Text>
        )}

        <View style={styles.bottomRow}>
          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>${product.originalPrice}</Text>
            )}
          </View>

          {/* Add to Cart / Quantity Controls */}
          <View style={styles.actionContainer}>
            {quantity === 0 ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddToCart}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={18} color={theme.colors.text.inverse} />
              </TouchableOpacity>
            ) : (
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(-1)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={14} color={theme.colors.primary.teal} />
                </TouchableOpacity>
                
                <Text style={styles.quantityText}>{quantity}</Text>
                
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(1)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={14} color={theme.colors.primary.teal} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },

  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    marginRight: theme.spacing.md,
  },

  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.lg,
    resizeMode: 'cover',
  },

  discountBadge: {
    position: 'absolute',
    top: theme.spacing.xs,
    left: theme.spacing.xs,
    backgroundColor: theme.colors.primary.orange,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },

  discountText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.xs,
    fontFamily: 'Outfit-SemiBold',
  },

  favoriteButton: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },

  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },

  productName: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.sizes.lg * 1.2,
  },

  unitText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.sm,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  price: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.primary.teal,
    marginRight: theme.spacing.sm,
  },

  originalPrice: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
    textDecorationLine: 'line-through',
  },

  actionContainer: {
    flexShrink: 0,
  },

  addButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary.teal,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xs,
  },

  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },

  quantityText: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginHorizontal: theme.spacing.md,
    minWidth: 20,
    textAlign: 'center',
  },
});

export default ProductCard;