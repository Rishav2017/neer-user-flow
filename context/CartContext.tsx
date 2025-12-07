import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  addToCart as apiAddToCart,
  getCart as apiGetCart,
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  CartItem,
  CartResponse,
} from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<boolean>;
  removeFromCart: (cartItemId: string) => Promise<boolean>;
  refreshCart: () => Promise<void>;
  getItemQuantity: (productId: string) => number;
  getCartItem: (productId: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cart when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      refreshCart();
    } else {
      // Clear cart when logged out
      setCartItems([]);
      setCartTotal(0);
    }
  }, [isLoggedIn]);

  const refreshCart = async (): Promise<void> => {
    if (!isLoggedIn) return;

    try {
      setIsLoading(true);
      const response = await apiGetCart();
      setCartItems(response.data.items || []);
      setCartTotal(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1): Promise<boolean> => {
    if (!isLoggedIn) {
      console.log('User not logged in');
      return false;
    }

    try {
      setIsLoading(true);
      await apiAddToCart(productId, quantity);
      await refreshCart();
      return true;
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number): Promise<boolean> => {
    if (!isLoggedIn) return false;

    try {
      setIsLoading(true);
      if (quantity <= 0) {
        await apiRemoveFromCart(cartItemId);
      } else {
        await apiUpdateCartItem(cartItemId, quantity);
      }
      await refreshCart();
      return true;
    } catch (error: any) {
      console.error('Error updating cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: string): Promise<boolean> => {
    if (!isLoggedIn) return false;

    try {
      setIsLoading(true);
      await apiRemoveFromCart(cartItemId);
      await refreshCart();
      return true;
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getItemQuantity = (productId: string): number => {
    const item = cartItems.find((item) => item.product_id === productId);
    return item?.quantity || 0;
  };

  const getCartItem = (productId: string): CartItem | undefined => {
    return cartItems.find((item) => item.product_id === productId);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const value: CartContextType = {
    cartItems,
    cartTotal,
    cartCount,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    refreshCart,
    getItemQuantity,
    getCartItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
