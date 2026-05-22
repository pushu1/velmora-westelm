import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MockProduct, MockVariant } from './db';

export interface CartItem {
  variant: MockVariant;
  product: Omit<MockProduct, 'variants'>;
  quantity: number;
}

interface ECommerceState {
  cart: CartItem[];
  wishlist: Omit<MockProduct, 'variants'>[];
  isCartOpen: boolean;
  
  // Cart Actions
  addToCart: (product: Omit<MockProduct, 'variants'>, variant: MockVariant, quantity?: number) => void;
  removeFromCart: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  
  // Wishlist Actions
  toggleWishlist: (product: Omit<MockProduct, 'variants'>) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useStore = create<ECommerceState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      isCartOpen: false,

      // Cart management
      addToCart: (product, variant, quantity = 1) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((item) => item.variant.sku === variant.sku);

        if (existingItem) {
          set({
            cart: currentCart.map((item) =>
              item.variant.sku === variant.sku
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            cart: [...currentCart, { product, variant, quantity }],
          });
        }
      },

      removeFromCart: (sku) => {
        set({
          cart: get().cart.filter((item) => item.variant.sku !== sku),
        });
      },

      updateQuantity: (sku, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(sku);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.variant.sku === sku ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),
      setCartOpen: (open) => set({ isCartOpen: open }),

      // Wishlist management
      toggleWishlist: (product) => {
        const currentWishlist = get().wishlist;
        const exists = currentWishlist.some((item) => item.id === product.id);

        if (exists) {
          set({
            wishlist: currentWishlist.filter((item) => item.id !== product.id),
          });
        } else {
          set({
            wishlist: [...currentWishlist, product],
          });
        }
      },

      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item.id === productId);
      },
    }),
    {
      name: 'westelm-replica-storage',
      partialize: (state) => ({ cart: state.cart, wishlist: state.wishlist }),
    }
  )
);
