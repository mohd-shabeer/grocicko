import { createContext, useContext, useReducer } from 'react';

// Favorites Context
const FavoritesContext = createContext();

// Action Types
const FAVORITES_ACTIONS = {
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  CLEAR_FAVORITES: 'CLEAR_FAVORITES',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
};

// Initial State
const initialState = {
  favorites: [],
  totalFavorites: 0,
};

// Favorites Reducer
const favoritesReducer = (state, action) => {
  switch (action.type) {
    case FAVORITES_ACTIONS.ADD_FAVORITE: {
      const { product } = action.payload;
      
      // Check if already in favorites
      const isAlreadyFavorite = state.favorites.some(item => item.id === product.id);
      if (isAlreadyFavorite) {
        return state;
      }
      
      const newFavorites = [...state.favorites, { 
        ...product, 
        addedAt: new Date().toISOString() 
      }];
      
      return {
        ...state,
        favorites: newFavorites,
        totalFavorites: newFavorites.length,
      };
    }
    
    case FAVORITES_ACTIONS.REMOVE_FAVORITE: {
      const { productId } = action.payload;
      const newFavorites = state.favorites.filter(item => item.id !== productId);
      
      return {
        ...state,
        favorites: newFavorites,
        totalFavorites: newFavorites.length,
      };
    }
    
    case FAVORITES_ACTIONS.TOGGLE_FAVORITE: {
      const { product } = action.payload;
      const isCurrentlyFavorite = state.favorites.some(item => item.id === product.id);
      
      if (isCurrentlyFavorite) {
        return favoritesReducer(state, {
          type: FAVORITES_ACTIONS.REMOVE_FAVORITE,
          payload: { productId: product.id },
        });
      } else {
        return favoritesReducer(state, {
          type: FAVORITES_ACTIONS.ADD_FAVORITE,
          payload: { product },
        });
      }
    }
    
    case FAVORITES_ACTIONS.CLEAR_FAVORITES: {
      return initialState;
    }
    
    default:
      return state;
  }
};

// Favorites Provider Component
export const FavoritesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);
  
  // Action Creators
  const addToFavorites = (product) => {
    dispatch({
      type: FAVORITES_ACTIONS.ADD_FAVORITE,
      payload: { product },
    });
  };
  
  const removeFromFavorites = (productId) => {
    dispatch({
      type: FAVORITES_ACTIONS.REMOVE_FAVORITE,
      payload: { productId },
    });
  };
  
  const toggleFavorite = (product) => {
    dispatch({
      type: FAVORITES_ACTIONS.TOGGLE_FAVORITE,
      payload: { product },
    });
  };
  
  const clearFavorites = () => {
    dispatch({ type: FAVORITES_ACTIONS.CLEAR_FAVORITES });
  };
  
  // Helper Functions
  const isFavorite = (productId) => {
    return state.favorites.some(item => item.id === productId);
  };
  
  const getFavoriteById = (productId) => {
    return state.favorites.find(item => item.id === productId);
  };
  
  const getFavoritesByCategory = (category) => {
    return state.favorites.filter(item => 
      item.category?.toLowerCase() === category?.toLowerCase()
    );
  };
  
  const getRecentFavorites = (limit = 5) => {
    return [...state.favorites]
      .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
      .slice(0, limit);
  };
  
  const getFavoritesCount = () => state.totalFavorites;
  
  const searchFavorites = (query) => {
    if (!query.trim()) return state.favorites;
    
    const searchTerm = query.toLowerCase().trim();
    return state.favorites.filter(item => 
      item.name?.toLowerCase().includes(searchTerm) ||
      item.category?.toLowerCase().includes(searchTerm) ||
      item.brand?.toLowerCase().includes(searchTerm)
    );
  };
  
  const getFavoritesSummary = () => ({
    total: state.totalFavorites,
    categories: [...new Set(state.favorites.map(item => item.category))].filter(Boolean),
    brands: [...new Set(state.favorites.map(item => item.brand))].filter(Boolean),
    recent: getRecentFavorites(3),
    isEmpty: state.totalFavorites === 0,
  });
  
  const value = {
    // State
    favorites: state.favorites,
    totalFavorites: state.totalFavorites,
    
    // Actions
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
    
    // Helpers
    isFavorite,
    getFavoriteById,
    getFavoritesByCategory,
    getRecentFavorites,
    getFavoritesCount,
    searchFavorites,
    getFavoritesSummary,
  };
  
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom Hook
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  
  return context;
};

export default FavoritesProvider;