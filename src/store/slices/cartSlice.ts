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
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      calculateCartTotals(state);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
      calculateCartTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.totalItems = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
