import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { useCart } from '@/providers/CartProvider';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    FlatList,
    Image,
    Modal,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Sample orders data with different unique IDs
const ordersData = [
  {
    id: 'ORD-001',
    orderNumber: 'GR12345',
    date: '2024-03-15',
    status: 'delivered',
    statusText: 'Delivered',
    total: 24.95,
    itemsCount: 4,
    estimatedDelivery: 'Delivered on Mar 15, 2:30 PM',
    trackingCode: 'TRK123456789',
    items: [
      {
        id: 'P001',
        name: 'Fresh Avocados',
        price: 4.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop',
        unit: 'per piece',
        category: 'fruits',
      },
      {
        id: 'P002',
        name: 'Organic Bananas',
        price: 2.49,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
        unit: 'per bunch',
        category: 'fruits',
      },
      {
        id: 'P003',
        name: 'Greek Yogurt',
        price: 3.99,
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop',
        unit: 'per cup',
        category: 'dairy',
      },
    ],
    deliveryAddress: '123 Main Street, Apt 4B, New York, NY 10001',
    paymentMethod: 'Visa ****1234',
  },
  {
    id: 'ORD-002',
    orderNumber: 'GR12346',
    date: '2024-03-14',
    status: 'in_transit',
    statusText: 'On the way',
    total: 18.47,
    itemsCount: 3,
    estimatedDelivery: 'Expected: Today, 4:00 PM - 6:00 PM',
    trackingCode: 'TRK123456790',
    items: [
      {
        id: 'P004',
        name: 'Fresh Salmon',
        price: 12.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=400&fit=crop',
        unit: 'per lb',
        category: 'meat',
      },
      {
        id: 'P005',
        name: 'Artisan Bread',
        price: 4.49,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
        unit: 'per loaf',
        category: 'bakery',
      },
    ],
    deliveryAddress: '123 Main Street, Apt 4B, New York, NY 10001',
    paymentMethod: 'PayPal',
  },
  {
    id: 'ORD-003',
    orderNumber: 'GR12347',
    date: '2024-03-13',
    status: 'processing',
    statusText: 'Being prepared',
    total: 31.92,
    itemsCount: 5,
    estimatedDelivery: 'Expected: Tomorrow, 10:00 AM - 12:00 PM',
    trackingCode: 'TRK123456791',
    items: [
      {
        id: 'P006',
        name: 'Cherry Tomatoes',
        price: 3.49,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1546470427-e7d2e7098dcd?w=400&h=400&fit=crop',
        unit: 'per pack',
        category: 'vegetables',
      },
      {
        id: 'P007',
        name: 'Organic Spinach',
        price: 2.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop',
        unit: 'per bag',
        category: 'vegetables',
      },
      {
        id: 'P008',
        name: 'Almond Milk',
        price: 3.79,
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
        unit: 'per carton',
        category: 'dairy',
      },
      {
        id: 'P009',
        name: 'Whole Grain Pasta',
        price: 2.89,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1551892589-865f69869476?w=400&h=400&fit=crop',
        unit: 'per pack',
        category: 'pantry',
      },
    ],
    deliveryAddress: '456 Business Ave, Suite 200, New York, NY 10002',
    paymentMethod: 'Apple Pay',
  },
  {
    id: 'ORD-004',
    orderNumber: 'GR12348',
    date: '2024-03-10',
    status: 'cancelled',
    statusText: 'Cancelled',
    total: 15.97,
    itemsCount: 2,
    estimatedDelivery: 'Order was cancelled',
    items: [
      {
        id: 'P010',
        name: 'Orange Juice',
        price: 4.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop',
        unit: 'per bottle',
        category: 'beverages',
      },
      {
        id: 'P011',
        name: 'Chicken Breast',
        price: 5.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop',
        unit: 'per lb',
        category: 'meat',
      },
    ],
    deliveryAddress: '123 Main Street, Apt 4B, New York, NY 10001',
    paymentMethod: 'Visa ****1234',
  },
  {
    id: 'ORD-005',
    orderNumber: 'GR12349',
    date: '2024-03-08',
    status: 'delivered',
    statusText: 'Delivered',
    total: 42.83,
    itemsCount: 7,
    estimatedDelivery: 'Delivered on Mar 8, 11:15 AM',
    trackingCode: 'TRK123456792',
    items: [
      {
        id: 'P012',
        name: 'Mixed Berries',
        price: 6.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=400&fit=crop',
        unit: 'per pack',
        category: 'fruits',
      },
      {
        id: 'P013',
        name: 'Free-Range Eggs',
        price: 4.49,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=400&h=400&fit=crop',
        unit: 'per dozen',
        category: 'dairy',
      },
      {
        id: 'P014',
        name: 'Quinoa',
        price: 5.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
        unit: 'per pack',
        category: 'pantry',
      },
      {
        id: 'P015',
        name: 'Bell Peppers',
        price: 3.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop',
        unit: 'per pack',
        category: 'vegetables',
      },
    ],
    deliveryAddress: '123 Main Street, Apt 4B, New York, NY 10001',
    paymentMethod: 'Visa ****1234',
  },
];

const OrdersPage = () => {
  const [orders, setOrders] = useState(ordersData);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const { addToCart } = useCart();

  const slideAnims = useRef(
    ordersData.map(() => new Animated.Value(50))
  ).current;
  
  const opacityAnims = useRef(
    ordersData.map(() => new Animated.Value(0))
  ).current;

  const filters = [
    { key: 'all', label: 'All Orders', count: orders.length },
    { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
    { key: 'in_transit', label: 'In Transit', count: orders.filter(o => o.status === 'in_transit').length },
    { key: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
  ];

  useEffect(() => {
    // Staggered entry animation
    const animations = slideAnims.map((anim, index) =>
      Animated.parallel([
        Animated.timing(anim, {
          toValue: 0,
          duration: 600,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnims[index], {
          toValue: 1,
          duration: 800,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.parallel(animations).start();
  }, []);

  const handleReorder = (order) => {
    Alert.alert(
      'Reorder Items',
      `Add all ${order.itemsCount} items from order ${order.orderNumber} to your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add to Cart',
          onPress: () => {
            order.items.forEach(item => {
              addToCart(item, item.quantity);
            });
            Alert.alert(
              'Items Added! 🛒',
              `${order.itemsCount} items have been added to your cart.`,
              [
                { text: 'Continue Shopping', onPress: () => router.push('/home') },
                { text: 'View Cart', onPress: () => router.push('/cart') },
              ]
            );
          },
        },
      ]
    );
  };

  const handleTrackOrder = (order) => {
    if (order.trackingCode) {
      router.push(`/track-order/${order.trackingCode}`);
    }
  };

  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsOrderModalVisible(true);
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getFilteredOrders = () => {
    if (selectedFilter === 'all') return orders;
    return orders.filter(order => order.status === selectedFilter);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return '#00C851';
      case 'in_transit':
        return '#3CAA91';
      case 'processing':
        return '#FF6B35';
      case 'cancelled':
        return '#E74C3C';
      default:
        return theme.colors.text.tertiary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return 'checkmark-circle';
      case 'in_transit':
        return 'car';
      case 'processing':
        return 'time';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const filteredOrders = getFilteredOrders();

  const renderFilterChip = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        selectedFilter === item.key && styles.filterChipActive,
      ]}
      onPress={() => setSelectedFilter(item.key)}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.filterChipText,
          selectedFilter === item.key && styles.filterChipTextActive,
        ]}
      >
        {item.label} ({item.count})
      </Text>
    </TouchableOpacity>
  );

  const renderOrderItem = ({ item, index }) => {
    const slideAnim = slideAnims[index] || new Animated.Value(0);
    const opacityAnim = opacityAnims[index] || new Animated.Value(1);

    return (
      <Animated.View
        style={[
          styles.orderWrapper,
          {
            transform: [{ translateY: slideAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.orderCard}
          onPress={() => handleOrderDetails(item)}
          activeOpacity={0.9}
        >
          {/* Header */}
          <View style={styles.orderHeader}>
            <View style={styles.orderHeaderLeft}>
              <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
              <Text style={styles.orderDate}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Ionicons 
                name={getStatusIcon(item.status)} 
                size={14} 
                color="white" 
              />
              <Text style={styles.statusText}>{item.statusText}</Text>
            </View>
          </View>

          {/* Items Preview */}
          <View style={styles.itemsPreview}>
            <View style={styles.itemsImages}>
              {item.items.slice(0, 3).map((product, idx) => (
                <Image
                  key={product.id}
                  source={{ uri: product.image }}
                  style={[
                    styles.itemImage,
                    { marginLeft: idx > 0 ? -8 : 0, zIndex: 3 - idx }
                  ]}
                />
              ))}
              {item.items.length > 3 && (
                <View style={styles.moreItemsIndicator}>
                  <Text style={styles.moreItemsText}>+{item.items.length - 3}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.orderSummary}>
              <Text style={styles.itemsCount}>{item.itemsCount} items</Text>
              <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Delivery Info */}
          <View style={styles.deliveryInfo}>
            <Ionicons name="location-outline" size={16} color={theme.colors.text.tertiary} />
            <Text style={styles.deliveryText} numberOfLines={1}>
              {item.estimatedDelivery}
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.orderActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                handleReorder(item);
              }}
            >
              <Ionicons name="repeat" size={16} color={theme.colors.primary.teal} />
              <Text style={styles.actionButtonText}>Reorder</Text>
            </TouchableOpacity>

            {item.status === 'in_transit' && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleTrackOrder(item);
                }}
              >
                <Ionicons name="navigate" size={16} color={theme.colors.primary.teal} />
                <Text style={styles.actionButtonText}>Track</Text>
              </TouchableOpacity>
            )}

            {item.status === 'delivered' && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  router.push(`/rate-order/${item.id}`);
                }}
              >
                <Ionicons name="star-outline" size={16} color={theme.colors.primary.orange} />
                <Text style={[styles.actionButtonText, { color: theme.colors.primary.orange }]}>Rate</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderOrderModal = () => (
    <Modal
      visible={isOrderModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setIsOrderModalVisible(false)}
    >
      <SafeAreaWrapper>
        {selectedOrder && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsOrderModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Order Details</Text>
              <TouchableOpacity onPress={() => handleReorder(selectedOrder)}>
                <Text style={styles.reorderText}>Reorder</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={selectedOrder.items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.modalItem}>
                  <Image source={{ uri: item.image }} style={styles.modalItemImage} />
                  <View style={styles.modalItemDetails}>
                    <Text style={styles.modalItemName}>{item.name}</Text>
                    <Text style={styles.modalItemUnit}>{item.unit}</Text>
                    <Text style={styles.modalItemPrice}>
                      ${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}
              contentContainerStyle={styles.modalContent}
            />
          </View>
        )}
      </SafeAreaWrapper>
    </Modal>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="receipt-outline" size={64} color={theme.colors.text.tertiary} />
      </View>
      <Text style={styles.emptyTitle}>No Orders Found</Text>
      <Text style={styles.emptyMessage}>
        {selectedFilter === 'all' 
          ? "You haven't placed any orders yet. Start shopping to see your orders here!"
          : `No orders found with status "${filters.find(f => f.key === selectedFilter)?.label}"`
        }
      </Text>
      {selectedFilter === 'all' && (
        <TouchableOpacity
          style={styles.startShoppingButton}
          onPress={() => router.push('/home')}
        >
          <Text style={styles.startShoppingText}>Start Shopping</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaWrapper>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>My Orders</Text>
        
        <TouchableOpacity 
          onPress={() => router.push('/help')} 
          style={styles.helpButton}
        >
          <Ionicons name="help-circle-outline" size={24} color={theme.colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {orders.length > 0 ? (
        <>
          {/* Filter Chips */}
          <View style={styles.filtersContainer}>
            <FlatList
              data={filters}
              renderItem={renderFilterChip}
              keyExtractor={(item) => item.key}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContent}
            />
          </View>

          {/* Orders List */}
          <FlatList
            data={filteredOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary.teal]}
                tintColor={theme.colors.primary.teal}
              />
            }
            ListEmptyComponent={renderEmptyState}
          />
        </>
      ) : (
        renderEmptyState()
      )}

      {renderOrderModal()}
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

  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
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

  helpButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  filtersContainer: {
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  filtersContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },

  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },

  filterChipActive: {
    backgroundColor: theme.colors.primary.teal,
    borderColor: theme.colors.primary.teal,
  },

  filterChipText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.secondary,
  },

  filterChipTextActive: {
    color: theme.colors.text.inverse,
    fontFamily: 'Outfit-SemiBold',
  },

  listContainer: {
    paddingBottom: theme.spacing.xxxl,
  },

  orderWrapper: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
  },

  orderCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  orderHeaderLeft: {
    flex: 1,
  },

  orderNumber: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },

  orderDate: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.xs,
  },

  statusText: {
    color: 'white',
    fontSize: theme.typography.sizes.xs,
    fontFamily: 'Outfit-SemiBold',
  },

  itemsPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  itemsImages: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  itemImage: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.background.card,
  },

  moreItemsIndicator: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
    borderWidth: 2,
    borderColor: theme.colors.background.card,
  },

  moreItemsText: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.tertiary,
  },

  orderSummary: {
    alignItems: 'flex-end',
  },

  itemsCount: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
  },

  orderTotal: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.primary.teal,
  },

  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },

  deliveryText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    flex: 1,
  },

  orderActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.secondary,
    gap: theme.spacing.xs,
  },

  actionButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.primary.teal,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  modalTitle: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: 'Outfit-Bold',
    color: theme.colors.text.primary,
  },

  reorderText: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.primary.teal,
  },

  modalContent: {
    padding: theme.spacing.lg,
  },

  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  modalItemImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.md,
  },

  modalItemDetails: {
    flex: 1,
  },

  modalItemName: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },

  modalItemUnit: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
  },

  modalItemPrice: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.primary.teal,
  },

  // Empty State Styles
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

  startShoppingButton: {
    backgroundColor: theme.colors.primary.teal,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  startShoppingText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
 },
});

export default OrdersPage;