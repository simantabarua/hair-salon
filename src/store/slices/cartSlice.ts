import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  rating?: number;
  ratingCount?: number;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  totalItems: 0,
};

const calculateCartTotals = (state: CartState) => {
  state.subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      const qtyToAdd = action.payload.quantity ?? 1;
      if (existingItem) {
        existingItem.quantity += qtyToAdd;
      } else {
        state.items.push({ ...action.payload, quantity: qtyToAdd });
      }
      calculateCartTotals(state);
      if (typeof window !== 'undefined') {
        localStorage.setItem('salon_cart', JSON.stringify({
          items: state.items,
          subtotal: state.subtotal,
          totalItems: state.totalItems,
        }));
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      calculateCartTotals(state);
      if (typeof window !== 'undefined') {
        localStorage.setItem('salon_cart', JSON.stringify({
          items: state.items,
          subtotal: state.subtotal,
          totalItems: state.totalItems,
        }));
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
      calculateCartTotals(state);
      if (typeof window !== 'undefined') {
        localStorage.setItem('salon_cart', JSON.stringify({
          items: state.items,
          subtotal: state.subtotal,
          totalItems: state.totalItems,
        }));
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.totalItems = 0;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('salon_cart');
      }
    },
    initializeCart: (state) => {
      if (typeof window !== 'undefined') {
        try {
          const savedCart = localStorage.getItem('salon_cart');
          if (savedCart) {
            const parsed = JSON.parse(savedCart);
            if (parsed && Array.isArray(parsed.items)) {
              state.items = parsed.items;
              state.subtotal = parsed.subtotal;
              state.totalItems = parsed.totalItems;
            }
          }
        } catch (e) {
          console.error('Failed to initialize cart from localStorage', e);
        }
      }
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, initializeCart } = cartSlice.actions;

export default cartSlice.reducer;
