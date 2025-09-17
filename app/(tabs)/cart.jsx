import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { useCart } from '@/providers/CartProvider';
import { useFavorites } from '@/providers/FavoritesProvider';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const CartPage = () => {
  const [discountCode, setDiscountCode] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const {
    items,
    totalItems,
    totalPrice,
    finalPrice,
    discount,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyDiscount,
    removeDiscount,
    getCartSummary,
  } = useCart();

  const { toggleFavorite, isFavorite } = useFavorites();

  const cartSummary = getCartSummary();

  // Sample discount codes (in real app, validate with backend)
  const validDiscountCodes = {
    'SAVE10': 10,
    'WELCOME20': 20,
    'FRESH15': 15,
  };

  const handleQuantityChange = (productId, change) => {
    const currentItem = items.find(item => item.id === productId);
    if (!currentItem) return;

    const newQuantity = Math.max(0, currentItem.quantity + change);
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId, productName) => {
    Alert.alert(
      'Remove Item',
      `Remove ${productName} from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(productId) },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: () => clearCart() },
      ]
    );
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) return;

    setIsApplyingDiscount(true);

    // Simulate API call delay
    setTimeout(() => {
      const code = discountCode.trim().toUpperCase();
      const discountPercentage = validDiscountCodes[code];

      if (discountPercentage) {
        applyDiscount(code, discountPercentage);
        setDiscountCode('');
        Alert.alert('Success!', `${discountPercentage}% discount applied!`);
      } else {
        Alert.alert('Invalid Code', 'The discount code you entered is not valid.');
      }
      
      setIsApplyingDiscount(false);
    }, 1000);
  };

  const handleRemoveDiscount = () => {
    removeDiscount();
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    // Navigate to checkout page (to be created)
    router.push('/checkout');
  };

  const renderCartItem = ({ item }) => {
    const isProductFavorite = isFavorite(item.id);

    return (
      <View style={styles.cartItem}>
        <TouchableOpacity 
          onPress={() => router.push(`/product/${item.id}`)}
          style={styles.itemImageContainer}
        >
          <Image source={{ uri: item.image }} style={styles.itemImage} />
        </TouchableOpacity>

        <View style={styles.itemDetails}>
          <TouchableOpacity onPress={() => router.push(`/product/${item.id}`)}>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.name}
            </Text>
          </TouchableOpacity>

          {item.unit && (
            <Text style={styles.itemUnit}>{item.unit}</Text>
          )}

          <View style={styles.itemPriceRow}>
            <Text style={styles.itemPrice}>${item.price}</Text>
            {item.originalPrice && (
              <Text style={styles.itemOriginalPrice}>${item.originalPrice}</Text>
            )}
          </View>

          <View style={styles.itemActions}>
            {/* Quantity Controls */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(item.id, -1)}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={18} color={theme.colors.primary.teal} />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{item.quantity}</Text>
              
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(item.id, 1)}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={18} color={theme.colors.primary.teal} />
              </TouchableOpacity>
            </View>

            {/* Item Total */}
            <Text style={styles.itemTotal}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.itemActionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleFavorite(item)}
          >
            <Ionicons
              name={isProductFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isProductFavorite ? '#E74C3C' : theme.colors.text.tertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleRemoveItem(item.id, item.name)}
          >
            <Ionicons name="trash-outline" size={20} color={theme.colors.status.error} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="bag-outline" size={64} color={theme.colors.text.tertiary} />
      </View>
      <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
      <Text style={styles.emptyMessage}>
        Add some delicious items to your cart and come back to checkout
      </Text>
      <TouchableOpacity
        style={styles.shopNowButton}
        onPress={() => router.push('/home')}
      >
        <Text style={styles.shopNowText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCartSummary = () => (
    <View style={styles.summaryContainer}>
      {/* Discount Code Section */}
      <View style={styles.discountSection}>
        <Text style={styles.sectionTitle}>Discount Code</Text>
        
        {discount.code ? (
          <View style={styles.appliedDiscountContainer}>
            <View style={styles.appliedDiscount}>
              <Ionicons name="pricetag" size={16} color={theme.colors.primary.teal} />
              <Text style={styles.appliedDiscountText}>
                {discount.code} (-{discount.percentage}%)
              </Text>
            </View>
            <TouchableOpacity onPress={handleRemoveDiscount}>
              <Ionicons name="close-circle" size={20} color={theme.colors.status.error} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.discountInputContainer}>
            <TextInput
              style={styles.discountInput}
              placeholder="Enter discount code"
              placeholderTextColor={theme.colors.text.placeholder}
              value={discountCode}
              onChangeText={setDiscountCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={[
                styles.applyButton,
                (!discountCode.trim() || isApplyingDiscount) && styles.applyButtonDisabled,
              ]}
              onPress={handleApplyDiscount}
              disabled={!discountCode.trim() || isApplyingDiscount}
            >
              {isApplyingDiscount ? (
                <Ionicons name="hourglass" size={16} color={theme.colors.text.inverse} />
              ) : (
                <Text style={styles.applyButtonText}>Apply</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Price Breakdown */}
      <View style={styles.priceBreakdown}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>
            Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </Text>
          <Text style={styles.priceValue}>${totalPrice.toFixed(2)}</Text>
        </View>

        {discount.amount > 0 && (
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, styles.discountLabel]}>
              Discount ({discount.code})
            </Text>
            <Text style={[styles.priceValue, styles.discountValue]}>
              -${discount.amount.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Delivery</Text>
          <Text style={[styles.priceValue, styles.freeText]}>FREE</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${finalPrice.toFixed(2)}</Text>
        </View>

        {discount.amount > 0 && (
          <Text style={styles.savingsText}>
            You saved ${discount.amount.toFixed(2)}!
          </Text>
        )}
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <SafeAreaWrapper>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.primary} />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Cart</Text>

          <View style={styles.headerButton} />
        </View>

        {renderEmptyCart()}
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Cart ({totalItems})</Text>

        <TouchableOpacity onPress={handleClearCart} style={styles.headerButton}>
          <Ionicons name="trash-outline" size={22} color={theme.colors.status.error} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderCartSummary}
      />

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <View style={styles.checkoutInfo}>
          <Text style={styles.checkoutTotal}>${finalPrice.toFixed(2)}</Text>
          <Text style={styles.checkoutItems}>
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
          <Ionicons name="arrow-forward" size={20} color={theme.colors.text.inverse} />
        </TouchableOpacity>
      </View>
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
  },

  headerTitle: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },

  listContainer: {
    paddingBottom: theme.spacing.lg,
  },

  cartItem: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },

  itemImageContainer: {
    marginRight: theme.spacing.md,
  },

  itemImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    resizeMode: 'cover',
  },

  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },

  itemName: {
    fontSize: theme.typography.sizes.md,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.sizes.md * 1.2,
  },

  itemUnit: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
  },

  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },

  itemPrice: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.primary.teal,
    marginRight: theme.spacing.sm,
  },

  itemOriginalPrice: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
    textDecorationLine: 'line-through',
  },

  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },

  quantityText: {
    fontSize: theme.typography.sizes.md,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginHorizontal: theme.spacing.md,
    minWidth: 20,
    textAlign: 'center',
  },

  itemTotal: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.primary,
  },

  itemActionButtons: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
    gap: theme.spacing.md,
  },

  actionButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  summaryContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },

  discountSection: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },

  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },

  appliedDiscountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background.accent,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },

  appliedDiscount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  appliedDiscountText: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.primary.teal,
  },

  discountInputContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  discountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.primary,
  },

  applyButton: {
    backgroundColor: theme.colors.primary.teal,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },

  applyButtonDisabled: {
    backgroundColor: theme.colors.border.medium,
  },

  applyButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-SemiBold',
  },

  priceBreakdown: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },

  priceLabel: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
  },

  priceValue: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },

  discountLabel: {
    color: theme.colors.primary.teal,
  },

  discountValue: {
    color: theme.colors.primary.teal,
  },

  freeText: {
    color: theme.colors.status.success,
  },

  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginVertical: theme.spacing.md,
  },

  totalLabel: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.primary,
  },

  totalValue: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.primary.teal,
  },

  savingsText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.status.success,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },

  checkoutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.background.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.10,
    shadowRadius: 1.41,
    elevation: 2,
  },

  checkoutInfo: {
    flex: 1,
  },

  checkoutTotal: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.primary,
  },

  checkoutItems: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
  },

  checkoutButton: {
    backgroundColor: theme.colors.primary.teal,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },

  checkoutButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
  },

  // Empty Cart Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
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

  shopNowButton: {
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

  shopNowText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
  },
});

export default CartPage;