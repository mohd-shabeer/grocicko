import { createContext, useContext, useReducer } from 'react';

// Cart Context
const CartContext = createContext();

// Action Types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  APPLY_DISCOUNT: 'APPLY_DISCOUNT',
  REMOVE_DISCOUNT: 'REMOVE_DISCOUNT',
};

// Initial State
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  discount: {
    code: null,
    percentage: 0,
    amount: 0,
  },
  finalPrice: 0,
};

// Cart Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);
      
      let newItems;
      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, { ...product, quantity }];
      }
      
      const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discountAmount = (newTotalPrice * state.discount.percentage) / 100;
      const newFinalPrice = newTotalPrice - discountAmount;
      
      return {
        ...state,
        items: newItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
        discount: {
          ...state.discount,
          amount: discountAmount,
        },
        finalPrice: newFinalPrice,
      };
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      const { productId } = action.payload;
      const newItems = state.items.filter(item => item.id !== productId);
      
      const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discountAmount = (newTotalPrice * state.discount.percentage) / 100;
      const newFinalPrice = newTotalPrice - discountAmount;
      
      return {
        ...state,
        items: newItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
        discount: {
          ...state.discount,
          amount: discountAmount,
        },
        finalPrice: newFinalPrice,
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { 
          type: CART_ACTIONS.REMOVE_ITEM, 
          payload: { productId } 
        });
      }
      
      const newItems = state.items.map(item => 
        item.id === productId ? { ...item, quantity } : item
      );
      
      const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discountAmount = (newTotalPrice * state.discount.percentage) / 100;
      const newFinalPrice = newTotalPrice - discountAmount;
      
      return {
        ...state,
        items: newItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
        discount: {
          ...state.discount,
          amount: discountAmount,
        },
        finalPrice: newFinalPrice,
      };
    }
    
    case CART_ACTIONS.CLEAR_CART: {
      return initialState;
    }
    
    case CART_ACTIONS.APPLY_DISCOUNT: {
      const { code, percentage } = action.payload;
      const discountAmount = (state.totalPrice * percentage) / 100;
      const newFinalPrice = state.totalPrice - discountAmount;
      
      return {
        ...state,
        discount: {
          code,
          percentage,
          amount: discountAmount,
        },
        finalPrice: newFinalPrice,
      };
    }
    
    case CART_ACTIONS.REMOVE_DISCOUNT: {
      return {
        ...state,
        discount: {
          code: null,
          percentage: 0,
          amount: 0,
        },
        finalPrice: state.totalPrice,
      };
    }
    
    default:
      return state;
  }
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  // Action Creators
  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity },
    });
  };
  
  const removeFromCart = (productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { productId },
    });
  };
  
  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity },
    });
  };
  
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };
  
  const applyDiscount = (code, percentage) => {
    dispatch({
      type: CART_ACTIONS.APPLY_DISCOUNT,
      payload: { code, percentage },
    });
  };
  
  const removeDiscount = () => {
    dispatch({ type: CART_ACTIONS.REMOVE_DISCOUNT });
  };
  
  // Helper Functions
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };
  
  const isInCart = (productId) => {
    return state.items.some(item => item.id === productId);
  };
  
  const getCartSummary = () => ({
    totalItems: state.totalItems,
    totalPrice: state.totalPrice,
    discount: state.discount,
    finalPrice: state.finalPrice,
    savings: state.discount.amount,
  });
  
  const value = {
    // State
    items: state.items,
    totalItems: state.totalItems,
    totalPrice: state.totalPrice,
    discount: state.discount,
    finalPrice: state.finalPrice,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyDiscount,
    removeDiscount,
    
    // Helpers
    getItemQuantity,
    isInCart,
    getCartSummary,
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};

export default CartProvider;