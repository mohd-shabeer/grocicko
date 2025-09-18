import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    FlatList,
    Image,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Sample notifications data
const notificationsData = [
  {
    id: '1',
    type: 'order',
    title: 'Order Delivered!',
    message: 'Your order #GR12345 has been successfully delivered. Enjoy your fresh groceries!',
    time: '2 minutes ago',
    isRead: false,
    icon: 'checkmark-circle',
    iconColor: '#00C851',
    image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    actionText: 'Rate Order',
    onAction: () => router.push('/rate-order/GR12345'),
  },
  {
    id: '2',
    type: 'promotion',
    title: 'Flash Sale! 🔥',
    message: '50% off on organic fruits! Limited time offer ending in 4 hours.',
    time: '1 hour ago',
    isRead: false,
    icon: 'flash',
    iconColor: '#FF6B35',
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    actionText: 'Shop Now',
    onAction: () => router.push('/category/fruits'),
  },
  {
    id: '3',
    type: 'order',
    title: 'Order Confirmed',
    message: 'Your order #GR12344 is being prepared. Estimated delivery: 2-3 hours.',
    time: '3 hours ago',
    isRead: true,
    icon: 'time',
    iconColor: '#3CAA91',
    image: 'https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    actionText: 'Track Order',
    onAction: () => router.push('/track-order/GR12344'),
  },
  {
    id: '4',
    type: 'wishlist',
    title: 'Back in Stock!',
    message: 'Organic Avocados from your wishlist are now available. Get them before they sell out again!',
    time: '5 hours ago',
    isRead: true,
    icon: 'heart',
    iconColor: '#E74C3C',
    image: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    actionText: 'Add to Cart',
    onAction: () => router.push('/product/1'),
  },
  {
    id: '5',
    type: 'system',
    title: 'Welcome to Grociko! 🎉',
    message: 'Thank you for joining us! Get 20% off your first order with code WELCOME20.',
    time: '1 day ago',
    isRead: true,
    icon: 'gift',
    iconColor: '#9B59B6',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    actionText: 'Use Code',
    onAction: () => router.push('/home'),
  },
  {
    id: '6',
    type: 'reminder',
    title: 'Cart Reminder',
    message: 'You have 3 items waiting in your cart. Complete your purchase before they run out of stock.',
    time: '2 days ago',
    isRead: true,
    icon: 'bag',
    iconColor: '#3CAA91',
    actionText: 'View Cart',
    onAction: () => router.push('/cart'),
  },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(notificationsData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const slideAnims = useRef(
    notificationsData.map(() => new Animated.Value(50))
  ).current;
  
  const opacityAnims = useRef(
    notificationsData.map(() => new Animated.Value(0))
  ).current;

  const filters = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'unread', label: 'Unread', count: notifications.filter(n => !n.isRead).length },
    { key: 'order', label: 'Orders', count: notifications.filter(n => n.type === 'order').length },
    { key: 'promotion', label: 'Offers', count: notifications.filter(n => n.type === 'promotion').length },
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

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleDeleteNotification = (notificationId) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setNotifications(prev =>
              prev.filter(notification => notification.id !== notificationId)
            );
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'This will delete all your notifications. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => setNotifications([]),
        },
      ]
    );
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      // Could refresh notifications from API here
    }, 1000);
  };

  const getFilteredNotifications = () => {
    switch (selectedFilter) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'order':
        return notifications.filter(n => n.type === 'order');
      case 'promotion':
        return notifications.filter(n => n.type === 'promotion');
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();

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
        {item.label}
        {item.count > 0 && (
          <Text style={styles.filterCount}> ({item.count})</Text>
        )}
      </Text>
    </TouchableOpacity>
  );

  const renderNotification = ({ item, index }) => {
    const slideAnim = slideAnims[index] || new Animated.Value(0);
    const opacityAnim = opacityAnims[index] || new Animated.Value(1);

    return (
      <Animated.View
        style={[
          styles.notificationWrapper,
          {
            transform: [{ translateY: slideAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.notificationCard,
             styles.unreadCard,
          ]}
          onPress={() => {
            if (!item.isRead) {
              handleMarkAsRead(item.id);
            }
            item.onAction && item.onAction();
          }}
          activeOpacity={0.9}
        >
          {/* Left Section - Icon/Image */}
          <View style={styles.leftSection}>
            {item.image ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.notificationImage} />
                <View style={[styles.iconOverlay, { backgroundColor: item.iconColor }]}>
                  <Ionicons
                    name={item.icon}
                    size={16}
                    color="white"
                  />
                </View>
              </View>
            ) : (
              <View style={[styles.iconContainer, { backgroundColor: item.iconColor }]}>
                <Ionicons
                  name={item.icon}
                  size={24}
                  color="white"
                />
              </View>
            )}
          </View>

          {/* Content Section */}
          <View style={styles.contentSection}>
            <View style={styles.headerRow}>
              <Text style={styles.notificationTitle} numberOfLines={1}>
                {item.title}
              </Text>
              {!item.isRead && <View style={styles.unreadDot} />}
            </View>

            <Text style={styles.notificationMessage} numberOfLines={2}>
              {item.message}
            </Text>

            <View style={styles.footerRow}>
              <Text style={styles.timeText}>{item.time}</Text>
              {item.actionText && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    item.onAction && item.onAction();
                  }}
                >
                  <Text style={styles.actionButtonText}>{item.actionText}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Right Section - Options */}
          <View style={styles.rightSection}>
            <TouchableOpacity
              style={styles.optionsButton}
              onPress={(e) => {
                e.stopPropagation();
                Alert.alert(
                  'Notification Options',
                  'What would you like to do with this notification?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    ...(item.isRead
                      ? []
                      : [{
                          text: 'Mark as Read',
                          onPress: () => handleMarkAsRead(item.id),
                        }]
                    ),
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => handleDeleteNotification(item.id),
                    },
                  ]
                );
              }}
            >
              <Ionicons
                name="ellipsis-vertical"
                size={16}
                color={theme.colors.text.tertiary}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="notifications-off-outline" size={64} color={theme.colors.text.tertiary} />
      </View>
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyMessage}>
        {selectedFilter === 'unread' 
          ? "You're all caught up! No unread notifications."
          : "When you receive notifications, they'll appear here."
        }
      </Text>
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
        
        <Text style={styles.headerTitle}>Notifications</Text>

        <View style={styles.headerActions}>
          {notifications.some(n => !n.isRead) && (
            <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.markAllButton}>
              <Text style={styles.markAllText}>Mark All</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={20} color={theme.colors.status.error} />
          </TouchableOpacity>
        </View>
      </View>

      {notifications.length > 0 ? (
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

          {/* Notifications List */}
          <FlatList
            data={filteredNotifications}
            renderItem={renderNotification}
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

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  markAllButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.accent,
  },

  markAllText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.primary.teal,
  },

  clearButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
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

  filterCount: {
    opacity: 0.8,
  },

  listContainer: {
    paddingBottom: theme.spacing.xxxl,
  },

  notificationWrapper: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.xs,
  },

  notificationCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    
  },

  unreadCard: {
    backgroundColor: 'rgba(60, 170, 145, 0.02)',
  },

  leftSection: {
    marginRight: theme.spacing.md,
  },

  imageContainer: {
    position: 'relative',
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },

  notificationImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  iconOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background.card,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  contentSection: {
    flex: 1,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },

  notificationTitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    flex: 1,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary.teal,
    marginLeft: theme.spacing.xs,
  },

  notificationMessage: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.sizes.sm * 1.4,
    marginBottom: theme.spacing.sm,
  },

  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  timeText: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.tertiary,
  },

  actionButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.accent,
  },

  actionButtonText: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.primary.teal,
  },

  rightSection: {
    justifyContent: 'flex-start',
    marginLeft: theme.spacing.sm,
  },

  optionsButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
});

export default NotificationsPage;