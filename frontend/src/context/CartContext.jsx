import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const refreshCounts = useCallback(async () => {
    if (!user) { setCartCount(0); setWishlistCount(0); return; }
    try {
      const [cartRes, wishlistRes] = await Promise.all([
        api.get('/cart'),
        api.get('/wishlist'),
      ]);
      const count = cartRes.data.items.reduce((sum, i) => sum + i.quantity, 0);
      setCartCount(count);
      setWishlistCount(wishlistRes.data.products.length);
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => { refreshCounts(); }, [refreshCounts]);

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await api.post('/cart', { productId, quantity });
    setCartCount(data.cartCount);
    return data;
  };

  const toggleWishlist = async (productId) => {
    const { data } = await api.post('/wishlist/toggle', { productId });
    setWishlistCount(data.wishlistCount);
    return data;
  };

  return (
    <CartContext.Provider value={{ cartCount, wishlistCount, addToCart, toggleWishlist, refreshCounts }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
