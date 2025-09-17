import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { useCart } from '@/providers/CartProvider';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const CheckoutPage = () => {
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(0);
  const [selectedDelivery, setSelectedDelivery] = useState(0);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const {
    items,
    totalItems,
    totalPrice,
    finalPrice,
    discount,
    getCartSummary,
    clearCart,
  } = useCart();

  // Sample data - In real app, fetch from user profile/backend
  const addresses = [
    {
      id: '1',
      type: 'Home',
      name: 'John Doe',
      address: '123 Main Street, Apt 4B',
      city: 'New York, NY 10001',
      phone: '+1 (555) 123-4567',
      isDefault: true,
    },
    {
      id: '2',
      type: 'Work',
      name: 'John Doe',
      address: '456 Business Ave, Suite 200',
      city: 'New York, NY 10002',
      phone: '+1 (555) 123-4567',
      isDefault: false,
    },
  ];

  const paymentMethods = [
    {
      id: '1',
      type: 'Credit Card',
      name: 'Visa ****1234',
      icon: 'card-outline',
      isDefault: true,
    },
    {
      id: '2',
      type: 'PayPal',
      name: 'john.doe@email.com',
      icon: 'logo-paypal',
      isDefault: false,
    },
    {
      id: '3',
      type: 'Apple Pay',
      name: 'Touch ID',
      icon: 'logo-apple',
      isDefault: false,
    },
  ];

  const deliveryOptions = [
    {
      id: '1',
      name: 'Standard Delivery',
      time: '2-3 business days',
      price: 0,
      description: 'Free delivery on orders over $25',
      isDefault: true,
    },
    {
      id: '2',
      name: 'Express Delivery',
      time: 'Same day delivery',
      price: 9.99,
      description: 'Order before 2 PM for same day delivery',
      isDefault: false,
    },
    {
      id: '3',
      name: 'Next Day Delivery',
      time: 'Next business day',
      price: 4.99,
      description: 'Guaranteed next day delivery',
      isDefault: false,
    },
  ];

  const orderSummary = getCartSummary();
  const deliveryFee = deliveryOptions[selectedDelivery].price;
  const finalTotal = finalPrice + deliveryFee;

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    setIsPlacingOrder(true);

    // Simulate order processing
    setTimeout(() => {
      setIsPlacingOrder(false);
      
      Alert.alert(
        'Order Placed Successfully! 🎉',
        `Your order #GR${Date.now().toString().slice(-6)} has been placed successfully. You'll receive a confirmation email shortly.`,
        [
          {
            text: 'Track Order',
            onPress: () => {
              clearCart();
              router.replace('/orders');
            },
          },
          {
            text: 'Continue Shopping',
            onPress: () => {
              clearCart();
              router.replace('/home');
            },
          },
        ]
      );
    }, 2000);
  };

  const renderOrderItem = (item) => (
    <View key={item.id} style={styles.orderItem}>
      <Image source={{ uri: item.image }} style={styles.orderItemImage} />
      <View style={styles.orderItemDetails}>
        <Text style={styles.orderItemName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.orderItemUnit}>{item.unit}</Text>
        <View style={styles.orderItemPriceRow}>
          <Text style={styles.orderItemQuantity}>Qty: {item.quantity}</Text>
          <Text style={styles.orderItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  const renderAddressSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="location-outline" size={20} color={theme.colors.primary.teal} />
          <Text style={styles.sectionTitle}>Delivery Address</Text>
        </View>
        <TouchableOpacity onPress={() => setShowAddressModal(true)}>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.selectedAddress}>
        <View style={styles.addressHeader}>
          <Text style={styles.addressType}>{addresses[selectedAddress].type}</Text>
          {addresses[selectedAddress].isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>
        <Text style={styles.addressName}>{addresses[selectedAddress].name}</Text>
        <Text style={styles.addressText}>{addresses[selectedAddress].address}</Text>
        <Text style={styles.addressText}>{addresses[selectedAddress].city}</Text>
        <Text style={styles.addressPhone}>{addresses[selectedAddress].phone}</Text>
      </View>
    </View>
  );

  const renderPaymentSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="card-outline" size={20} color={theme.colors.primary.teal} />
          <Text style={styles.sectionTitle}>Payment Method</Text>
        </View>
        <TouchableOpacity onPress={() => setShowPaymentModal(true)}>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.selectedPayment}>
        <View style={styles.paymentRow}>
          <Ionicons 
            name={paymentMethods[selectedPayment].icon} 
            size={24} 
            color={theme.colors.text.primary} 
          />
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentType}>{paymentMethods[selectedPayment].type}</Text>
            <Text style={styles.paymentName}>{paymentMethods[selectedPayment].name}</Text>
          </View>
          {paymentMethods[selectedPayment].isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderDeliverySection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="time-outline" size={20} color={theme.colors.primary.teal} />
          <Text style={styles.sectionTitle}>Delivery Options</Text>
        </View>
      </View>

      <View style={styles.deliveryOptions}>
        {deliveryOptions.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.deliveryOption,
              selectedDelivery === index && styles.deliveryOptionSelected,
            ]}
            onPress={() => setSelectedDelivery(index)}
          >
            <View style={styles.deliveryOptionLeft}>
              <View style={styles.radioButton}>
                {selectedDelivery === index && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
              <View style={styles.deliveryOptionDetails}>
                <Text style={styles.deliveryOptionName}>{option.name}</Text>
                <Text style={styles.deliveryOptionTime}>{option.time}</Text>
                <Text style={styles.deliveryOptionDescription}>{option.description}</Text>
              </View>
            </View>
            <Text style={styles.deliveryOptionPrice}>
              {option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Delivery Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsLabel}>Delivery Instructions (Optional)</Text>
        <TextInput
          style={styles.instructionsInput}
          placeholder="Add special instructions for delivery..."
          placeholderTextColor={theme.colors.text.placeholder}
          value={deliveryInstructions}
          onChangeText={setDeliveryInstructions}
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );

  const renderOrderSummary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      
      {/* Order Items */}
      <View style={styles.orderItems}>
        {items.map(renderOrderItem)}
      </View>

      {/* Promo Code */}
      <View style={styles.promoContainer}>
        <View style={styles.promoInputContainer}>
          <TextInput
            style={styles.promoInput}
            placeholder="Enter promo code"
            placeholderTextColor={theme.colors.text.placeholder}
            value={promoCode}
            onChangeText={setPromoCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.promoApplyButton}>
            <Text style={styles.promoApplyText}>Apply</Text>
          </TouchableOpacity>
        </View>
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
          <Text style={styles.priceLabel}>
            Delivery ({deliveryOptions[selectedDelivery].name})
          </Text>
          <Text style={[styles.priceValue, deliveryFee === 0 && styles.freeText]}>
            {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Tax</Text>
          <Text style={styles.priceValue}>$0.00</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
        </View>

        {discount.amount > 0 && (
          <Text style={styles.savingsText}>
            You saved ${discount.amount.toFixed(2)}!
          </Text>
        )}
      </View>
    </View>
  );

  const renderAddressModal = () => (
    <Modal
      visible={showAddressModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowAddressModal(false)}
    >
      <SafeAreaWrapper>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowAddressModal(false)}>
            <Ionicons name="close" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Select Address</Text>
          <TouchableOpacity>
            <Text style={styles.addNewText}>Add New</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {addresses.map((address, index) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressOption,
                selectedAddress === index && styles.addressOptionSelected,
              ]}
              onPress={() => {
                setSelectedAddress(index);
                setShowAddressModal(false);
              }}
            >
              <View style={styles.addressOptionLeft}>
                <View style={styles.radioButton}>
                  {selectedAddress === index && (
                    <View style={styles.radioButtonSelected} />
                  )}
                </View>
                <View style={styles.addressOptionDetails}>
                  <View style={styles.addressOptionHeader}>
                    <Text style={styles.addressType}>{address.type}</Text>
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.addressName}>{address.name}</Text>
                  <Text style={styles.addressText}>{address.address}</Text>
                  <Text style={styles.addressText}>{address.city}</Text>
                  <Text style={styles.addressPhone}>{address.phone}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaWrapper>
    </Modal>
  );

  const renderPaymentModal = () => (
    <Modal
      visible={showPaymentModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowPaymentModal(false)}
    >
      <SafeAreaWrapper>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
            <Ionicons name="close" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Payment Method</Text>
          <TouchableOpacity>
            <Text style={styles.addNewText}>Add New</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {paymentMethods.map((payment, index) => (
            <TouchableOpacity
              key={payment.id}
              style={[
                styles.paymentOption,
                selectedPayment === index && styles.paymentOptionSelected,
              ]}
              onPress={() => {
                setSelectedPayment(index);
                setShowPaymentModal(false);
              }}
            >
              <View style={styles.paymentOptionLeft}>
                <View style={styles.radioButton}>
                  {selectedPayment === index && (
                    <View style={styles.radioButtonSelected} />
                  )}
                </View>
                <Ionicons name={payment.icon} size={24} color={theme.colors.text.primary} />
                <View style={styles.paymentOptionDetails}>
                  <Text style={styles.paymentType}>{payment.type}</Text>
                  <Text style={styles.paymentName}>{payment.name}</Text>
                </View>
              </View>
              {payment.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>Default</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaWrapper>
    </Modal>
  );

  if (items.length === 0) {
    return (
      <SafeAreaWrapper>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.primary} />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={styles.headerButton} />
        </View>

        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={64} color={theme.colors.text.tertiary} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyMessage}>Add some items to proceed with checkout</Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => router.push('/home')}
          >
            <Text style={styles.shopNowText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
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
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {renderAddressSection()}
        {renderPaymentSection()}
        {renderDeliverySection()}
        {renderOrderSummary()}
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.placeOrderContainer}>
        <View style={styles.orderTotalInfo}>
          <Text style={styles.orderTotalLabel}>Total</Text>
          <Text style={styles.orderTotalValue}>${finalTotal.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            isPlacingOrder && styles.placeOrderButtonDisabled,
          ]}
          onPress={handlePlaceOrder}
          disabled={isPlacingOrder}
        >
          {isPlacingOrder ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="hourglass" size={20} color={theme.colors.text.inverse} />
              <Text style={styles.placeOrderText}>Processing...</Text>
            </View>
          ) : (
            <View style={styles.placeOrderContent}>
              <Text style={styles.placeOrderText}>Place Order</Text>
              <Ionicons name="arrow-forward" size={20} color={theme.colors.text.inverse} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Modals */}
      {renderAddressModal()}
      {renderPaymentModal()}
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

  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  contentContainer: {
    paddingBottom: theme.spacing.lg,
  },

  section: {
    backgroundColor: theme.colors.background.card,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },

  changeText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.primary.teal,
  },

  // Address Styles
  selectedAddress: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },

  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    gap: theme.spacing.sm,
  },

  addressType: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },

  defaultBadge: {
    backgroundColor: theme.colors.primary.teal,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },

  defaultBadgeText: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.inverse,
  },

  addressName: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },

  addressText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },

  addressPhone: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.primary.teal,
  },

  // Payment Styles
  selectedPayment: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },

  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },

  paymentDetails: {
    flex: 1,
  },

  paymentType: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },

  paymentName: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
  },

  // Delivery Styles
  deliveryOptions: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },

  deliveryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    backgroundColor: theme.colors.background.secondary,
  },

  deliveryOptionSelected: {
    borderColor: theme.colors.primary.teal,
    backgroundColor: theme.colors.background.accent,
  },

  deliveryOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },

  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.border.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary.teal,
  },

  deliveryOptionDetails: {
    flex: 1,
  },

  deliveryOptionName: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },

  deliveryOptionTime: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.primary.teal,
    marginBottom: theme.spacing.xs,
  },

  deliveryOptionDescription: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
  },

  deliveryOptionPrice: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.primary,
  },

  instructionsContainer: {
    marginTop: theme.spacing.lg,
  },

  instructionsLabel: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },

  instructionsInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.primary,
    textAlignVertical: 'top',
    minHeight: 80,
  },

  // Order Summary Styles
  orderItems: {
    marginBottom: theme.spacing.lg,
  },

  orderItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
  },

  orderItemImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
  },

  orderItemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },

  orderItemName: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },

  orderItemUnit: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
  },

  orderItemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  orderItemQuantity: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.secondary,
  },

  orderItemPrice: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.primary.teal,
  },

  promoContainer: {
    marginBottom: theme.spacing.lg,
  },

  promoInputContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.primary,
  },

  promoApplyButton: {
    backgroundColor: theme.colors.primary.teal,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  promoApplyText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-SemiBold',
  },

  priceBreakdown: {
    gap: theme.spacing.sm,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
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

  // Place Order Button
  placeOrderContainer: {
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

  orderTotalInfo: {
    flex: 1,
  },

  orderTotalLabel: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
  },

  orderTotalValue: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.primary,
  },

  placeOrderButton: {
    backgroundColor: theme.colors.primary.teal,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    minWidth: 150,
  },

  placeOrderButtonDisabled: {
    backgroundColor: theme.colors.border.medium,
  },

  placeOrderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },

  placeOrderText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
  },

  // Modal Styles
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    backgroundColor: theme.colors.background.primary,
  },

  modalTitle: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.primary,
  },

  addNewText: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.primary.teal,
  },

  modalContent: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  // Address Modal Styles
  addressOption: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  addressOptionSelected: {
    backgroundColor: theme.colors.background.accent,
  },

  addressOptionLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },

  addressOptionDetails: {
    flex: 1,
  },

  addressOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    gap: theme.spacing.sm,
  },

  // Payment Modal Styles
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  paymentOptionSelected: {
    backgroundColor: theme.colors.background.accent,
  },

  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },

  paymentOptionDetails: {
    flex: 1,
  },

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },

  emptyTitle: {
    fontSize: theme.typography.sizes.xxl,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
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

export default CheckoutPage;